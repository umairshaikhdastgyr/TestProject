import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TextInputMask } from "react-native-masked-text";
import valid from "card-validator";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { BallIndicator } from "react-native-indicators";
import Imgs from "#assets/images";
import usePrevious from "#utils/usePrevious";
import {
  Icon,
  FooterAction,
  Button,
  SweetDialog,
  Toast,
  Heading,
} from "#components";
import { styles } from "./styles";
import { userSelector } from "#modules/User/selectors";
import { createTokenWithBankOrCard } from "../../../../services/Stripe";
import {
  updatePaymentMethod,
  getPaymentCards,
} from "../../../../modules/User/actions";
import { flex, margins } from "#styles/utilities";
import { setPaymentDefault } from "#modules/Orders/actions";

import { Colors } from "#themes";
import { Utilities } from "#styles";
import fonts from "#themes/fonts";

const CardScreen = ({ navigation, route }) => {
  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;

  const exitDialogData = {
    code: "draft_available",
    title: "Delete payment method",
    message:
      "Are you sure you want to delete this card? This action can't be undone.",
    mainBtTitle: "Delete",
    secondaryBtTitle: "Cancel",
  };
  const showDefult = route?.params?.showDefult;
  const cardDetail = route?.params?.detail ?? null;
  const isDefaultFromData = _.get(cardDetail, "metadata.isDefault", false);
  const fromScreen = route?.params?.fromScreen ?? "default";
  const boost = route?.params?.boost;
  const boostItem = route?.params?.boostItem;
  const isFromProfileDashboard = route?.params?.isFromProfileDashboard ?? false;

  const [cardState, setCardState] = useState({
    fullName: "",
    cardNumber: "",
    expDate: "",
    securityCode: "",
    zipCode: "",
  });

  const [dialogVisible, setDialogVisible] = useState(false);
  const [fetchMethod, setFetchMethod] = useState("");
  const [errFullName, setErrFullName] = useState(false);
  const [errCardNumber, setErrCardNumber] = useState(false);
  const [errExpDate, setErrExpDate] = useState(false);
  const [errSecurityCode, setErrSecurityCode] = useState(false);
  const [errZipCode, setErrZipCode] = useState(false);
  const [isDefault, setDefault] = useState(
    cardDetail ? isDefaultFromData === "true" : false
  );
  const [cardOption, setCardOption] = useState({
    obfuscated: false,
    issuer: "visa-or-mastercard",
  });
  const [toastError, setToastError] = useState({
    isVisible: false,
    message: "",
  });
  const [buttonVisibility, setButtonVisibility] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    user: {
      information: { id },
      updatePaymentMethodState,
      paymentCardList,
    },
  } = useSelector(userSelector);
  const cardList = paymentCardList?.data?.data || [];

  const dispatch = useDispatch();

  const prevUpdatePaymentMethodState = usePrevious(updatePaymentMethodState);

  /**
   * @description Modifies the state
   * @param { String } key
   * @param { String } value
   * @returns Void
   */
  const handleCardOnChange = (key = "", value = "") => {
    if (key === "firstName" || key === "lastName") {
      let newValue = "";
      if (key === "firstName") {
        let arr = cardState["fullName"].split(" ");
        arr[0] = value;
        newValue = arr.join(" ");
      } else {
        let arr = cardState["fullName"].split(" ");
        arr[1] = value;
        newValue = arr.join(" ");
      }
      setCardState({
        ...cardState,
        fullName: newValue,
      });
      return;
    }
    if (key === "cardNumber") {
      _onChangeCardNum(value);
      return;
    }
    if (key === "expDate") {
      setCardState({
        ...cardState,
        [key]: value,
      });
      return;
    }
    if (key === "securityCode") {
      setCardState({
        ...cardState,
        [key]: value,
      });
      return;
    }
    if (key === "zipCode") {
      _onSetZipCode(value);
      return;
    }
  };

  const onSetDefault = () => setDefault(!isDefault);

  const prevCardUpdate = async (DefaultData) => {
    const params = {
      address_zip: DefaultData.address_zip,
      exp_month: DefaultData.exp_month,
      exp_year: DefaultData.exp_year,
      name: DefaultData.name,
      metadata: {
        isDefault: false,
      },
    };

    const data = dispatch(
      updatePaymentMethod({
        userId: id,
        body: { params },
        cardId: DefaultData.id,
        type: "card",
        method: "PATCH",
      })
    );
    return data;
  };
  const currentCardUpdate = async (cardState, splitedExp) => {
    const params = {
      address_zip: cardState.zipCode,
      exp_month: parseInt(splitedExp[0], 10),
      exp_year: parseInt(splitedExp[1], 10),
      name: cardState.fullName,
      metadata: {
        isDefault,
      },
    };

    setFetchMethod("PATCH");
    setLoading(false);
    const datax = dispatch(
      updatePaymentMethod({
        userId: id,
        body: { params },
        cardId: cardDetail.id,
        type: "card",
        method: "PATCH",
      })
    );
    return datax;
  };

  const onSave = async () => {
    const splitedExp = cardState.expDate
      ? cardState.expDate.split("/")
      : ["00", "0000"];

    setLoading(true);
    Keyboard.dismiss();

    if (cardDetail) {
      var DefaultData = await cardList?.find(
        (item) => item?.metadata?.isDefault == "true"
      );
      if (DefaultData) {
        const prevResponse = await prevCardUpdate(DefaultData);

        const currentResponse = await currentCardUpdate(cardState, splitedExp);

        return;
      } else {
        const params = {
          address_zip: cardState.zipCode,
          exp_month: parseInt(splitedExp[0], 10),
          exp_year: parseInt(splitedExp[1], 10),
          name: cardState.fullName,
          metadata: {
            isDefault,
          },
        };

        setFetchMethod("PATCH");
        setLoading(false);
        dispatch(
          updatePaymentMethod({
            userId: id,
            body: { params },
            cardId: cardDetail.id,
            type: "card",
            method: "PATCH",
          })
        );
        return;
      }
    }

    if (isDefault) {
      var DefaultDataX = await cardList?.find(
        (item) => item?.metadata?.isDefault == "true"
      );
      if (DefaultDataX) {
        await prevCardUpdate(DefaultDataX);
      }
    }

    if (!validForm()) {
      setLoading(false);
      return;
    }

    setFetchMethod("POST");

    let params = {
      number: cardState.cardNumber,
      expMonth: parseInt(splitedExp[0], 10),
      expYear: parseInt(splitedExp[1], 10),
      cvc: cardState.securityCode,
      name: cardState.fullName,
      addressZip: cardState.zipCode,
      // currency: "USD"
    };

    console.log("params=====> ", params);

    try {
      const data = await createTokenWithBankOrCard({ type: "card", params });

      if (data.success) {
        setLoading(false);
        params = { tokenId: data.token.tokenId, isDefault };

        const updatePaymentMethodRes = dispatch(
          updatePaymentMethod({
            userId: id,
            body: { params },
            type: "card",
            method: "POST",
          })
        );
        return;
      }

      setLoading(false);
      setToastError({
        isVisible: true,
        message: data?.errMsg?.raw?.message
          ? data?.errMsg?.raw?.message
          : data?.errMsg,
      });
    } catch (e) {
      setToastError({
        isVisible: true,
        message: JSON.stringify(e?.raw?.message),
      });
    }
  };

  const validForm = () => {
    let isValid = true;
    const validName = cardState.fullName;

    const validCard = valid.number(cardState.cardNumber);
    const validExpDate = valid.expirationDate(cardState.expDate);
    const validSecCode =
      cardState.securityCode.length > 2 && cardState.securityCode.length <= 4;
    const validBillingZip = valid.postalCode(cardState.zipCode,{minLength: 5});

    if (validName) {
      setErrFullName(false);
    } else {
      setErrFullName(true);
      isValid = false;
    }

    if (validCard.isValid) {
      setErrCardNumber(false);
    } else {
      setErrCardNumber(true);
      isValid = false;
    }

    if (validExpDate.isValid) {
      setErrExpDate(false);
    } else {
      setErrExpDate(true);
      isValid = false;
    }

    if (validSecCode) {
      setErrSecurityCode(false);
    } else {
      setErrSecurityCode(true);
      isValid = false;
    }

    if (validBillingZip.isValid) {
      setErrZipCode(false);
    } else {
      setErrZipCode(true);
      isValid = false;
    }
    return isValid;
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onSecondaryButtonPressed = () => {
    setDialogVisible(false);
  };

  const deletePaymentMethod = () => {
    setFetchMethod("DELETE");
    dispatch(
      updatePaymentMethod({
        userId: id,
        cardId: cardDetail.id,
        type: "card",
        method: "DELETE",
      })
    );
  };

  const onMainButtonPressed = () => {
    deletePaymentMethod();
    setDialogVisible(false);
  };

  const _onChangeCardNum = (text) => {
    if (text.length === 4) {
      const numberValidation = valid.number(text);
      if (
        _.get(numberValidation, "card.type", "").indexOf("american-express") !==
        -1
      ) {
        const options = {
          obfuscated: false,
          issuer: "amex",
        };
        setCardOption(options);
      } else if (
        _.get(numberValidation, "card.type", "").indexOf("diners") !== -1
      ) {
        const options = {
          obfuscated: false,
          issuer: "diners",
        };
        setCardOption(options);
      }
    }
    setCardState({
      ...cardState,
      cardNumber: text,
    });
  };

  const _onSetZipCode = (text) => {
    let postCode = text.match(/\d/g);
    if (postCode) {
      postCode = postCode.join("");
    } else {
      postCode = "";
    }
    setCardState({
      ...cardState,
      zipCode: text,
    });
  };

  useFocusEffect(
    useCallback(() => {
      const keyboardDidShow = () => {
        setButtonVisibility(false);
      };

      const keyboardDidHide = () => {
        setButtonVisibility(true);
      };
      keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        keyboardDidShow
      );
      keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        keyboardDidHide
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, [])
  );

  useEffect(() => {
    if (
      Object.keys(updatePaymentMethodState?.data).length &&
      prevUpdatePaymentMethodState &&
      !Object.keys(prevUpdatePaymentMethodState?.data).length
    ) {
      switch (fetchMethod) {
        case "POST":
          if (fromScreen === "payment") {
            const updatedData = updatePaymentMethodState?.data?.data;
            dispatch(getPaymentCards({ userId: id, type: "card" }));
            dispatch(
              setPaymentDefault({
                selectedCard: updatedData,
                default: null,
                state: updatedData?.id,
                title: `${updatedData?.brand?.toUpperCase()} ${
                  updatedData?.last4
                }`,
                icon: "credit-card",
              })
            );
            if (boost === true) {
              navigation.navigate("Dashboard", {
                boost: "true",
                boostItem,
              });
            } else {
              navigation.goBack();
            }
            return;
          } else if (fromScreen === "returnLabel") {
            const updatedData = updatePaymentMethodState.data.data;
            dispatch(getPaymentCards({ userId: id, type: "card" }));
            dispatch(
              setPaymentDefault({
                selectedCard: updatedData,
                default: null,
                state: updatedData.id,
                title: `${updatedData.brand.toUpperCase()} ${
                  updatedData.last4
                }`,
                icon: "credit-card",
              })
            );
            navigation.navigate("ReturnConfirmation");
          } else {
            dispatch(getPaymentCards({ userId: id, type: "card" }));
            navigation.navigate("AddPaymentConfirm", {
              headerTitle: "Add Credit/Debit Card",
              titleMessage: "Add payment complete!",
              subtitleMessage: "You’ve successfully added your credit card.",
            });
          }
          break;
        case "PATCH":
          dispatch(getPaymentCards({ userId: id, type: "card" }));
          navigation.navigate("PaymentManagement");
          break;
        case "DELETE":
          dispatch(getPaymentCards({ userId: id, type: "card" }));
          navigation.navigate("PaymentManagement");
          break;
        default:
          break;
      }
    }
  }, [updatePaymentMethodState]);

  useEffect(() => {
    if (cardDetail) {
      setCardState({
        fullName: cardDetail.name,
        cardNumber: `xxxx xxx xxxx ${cardDetail.last4}`,
        expDate: `${cardDetail.exp_month}/${cardDetail.exp_year}`,
        securityCode: "xxx",
        zipCode: cardDetail.address_zip,
      });
    }
  }, [cardDetail]);

  useEffect(() => {
    if (
      updatePaymentMethodState.failure &&
      !prevUpdatePaymentMethodState?.failure
    ) {
      setToastError({
        isVisible: true,
        message: JSON.stringify(
          updatePaymentMethodState?.failure?.raw?.message
            ? updatePaymentMethodState?.failure?.raw?.message
            : updatePaymentMethodState?.failure
        ),
      });
    }
  }, [prevUpdatePaymentMethodState, updatePaymentMethodState.failure]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Toast message={toastError.message} isVisible={toastError.isVisible} />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {!isFromProfileDashboard && (
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                This is where you'll be charged for purchase made on Homitag.
              </Text>
            </View>
          )}
          <View style={styles.cardInputContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ marginTop: 30, flex: 1, marginRight: 10 }}>
                <Text
                  type="bold"
                  style={{
                    fontSize: 13,
                    textAlign: "left",
                    color: "#313334",
                    fontFamily: fonts.family.semiBold,
                  }}
                >
                  FIRST NAME
                </Text>
                <TextInput
                  placeholderTextColor={"#999999"}
                  style={styles.input}
                  placeholder="FIRST NAME"
                  underlineColorAndroid="transparent"
                  value={cardState.fullName.split(" ")[0]}
                  onChangeText={(value) =>
                    handleCardOnChange("firstName", value)
                  }
                  returnKeyType={"done"}
                />
              </View>
              <View style={{ marginTop: 30, flex: 1, marginLeft: 10 }}>
                <Text
                  type="bold"
                  style={{
                    fontSize: 13,
                    textAlign: "left",
                    color: "#313334",
                    fontFamily: fonts.family.semiBold,
                  }}
                >
                  LAST NAME
                </Text>
                <TextInput
                  placeholderTextColor={"#999999"}
                  style={styles.input}
                  placeholder="LAST NAME"
                  underlineColorAndroid="transparent"
                  value={cardState.fullName.split(" ")[1]}
                  onChangeText={(value) =>
                    handleCardOnChange("lastName", value)
                  }
                  returnKeyType={"done"}
                />
              </View>
            </View>
            {errFullName && (
              <Text style={styles.redText}>Enter valid full name</Text>
            )}
            {!cardDetail ? (
              <View style={{ marginTop: 30, flex: 1 }}>
                <Text
                  type="bold"
                  style={{
                    fontSize: 13,
                    textAlign: "left",
                    color: "#313334",
                    fontFamily: fonts.family.semiBold,
                  }}
                >
                  CARD NUMBER
                </Text>
                <TextInputMask
                  style={styles.input}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  type="credit-card"
                  underlineColorAndroid="transparent"
                  value={cardState.cardNumber}
                  options={cardOption}
                  onChangeText={(value) =>
                    handleCardOnChange("cardNumber", value)
                  }
                />
              </View>
            ) : (
              <View style={{ marginTop: 30, flex: 1 }}>
                <Text
                  type="bold"
                  style={{
                    fontSize: 13,
                    textAlign: "left",
                    color: "#313334",
                    fontFamily: fonts.family.semiBold,
                  }}
                >
                  CARD NUMBER
                </Text>
                <TextInput
                  placeholderTextColor={"#999999"}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  value={cardState.cardNumber}
                  onChangeText={(value) =>
                    handleCardOnChange("cardNumber", value)
                  }
                  editable={false}
                />
              </View>
            )}
            {errCardNumber && (
              <Text style={styles.redText}>Enter valid card number</Text>
            )}
            <View style={styles.inputsContainer}>
              <View style={{ marginTop: 30, flex: 1, marginRight: 10 }}>
                <Text
                  type="bold"
                  style={{
                    fontSize: 13,
                    textAlign: "left",
                    color: "#313334",
                    fontFamily: fonts.family.semiBold,
                  }}
                >
                  EXPIRATION
                </Text>
                <TextInputMask
                  type="datetime"
                  style={styles.input1}
                  placeholder="MM/YYYY"
                  underlineColorAndroid="transparent"
                  options={{
                    format: "MM/YYYY",
                  }}
                  value={cardState.expDate}
                  onChangeText={(value) => handleCardOnChange("expDate", value)}
                />
              </View>
              <View style={{ marginTop: 30, flex: 1, marginLeft: 10 }}>
                <Text
                  type="bold"
                  style={{
                    fontSize: 13,
                    textAlign: "left",
                    color: "#313334",
                    fontFamily: fonts.family.semiBold,
                  }}
                >
                  CVV
                </Text>
                <TextInput
                  placeholderTextColor={"#999999"}
                  style={styles.input1}
                  placeholder="XXX"
                  underlineColorAndroid="transparent"
                  value={cardState.securityCode}
                  onChangeText={(value) =>
                    handleCardOnChange("securityCode", value)
                  }
                  keyboardType="numeric"
                  maxLength={3}
                  editable={!cardDetail}
                />
              </View>
            </View>
            {(errExpDate || errSecurityCode) && (
              <View style={styles.inputsContainer}>
                <Text style={styles.redTextRow}>
                  {errExpDate && "Enter valid exp date"}
                </Text>
                <View style={styles.space} />
                <Text style={styles.redTextRow}>
                  {errSecurityCode && "Enter valid sec code"}
                </Text>
              </View>
            )}
            <View style={{ marginTop: 30, flex: 1 }}>
              <Text
                type="bold"
                style={{
                  fontSize: 13,
                  textAlign: "left",
                  color: "#313334",
                  fontFamily: fonts.family.semiBold,
                }}
              >
                ZIP CODE
              </Text>

              <TextInput
                placeholderTextColor={"#999999"}
                style={styles.input}
                placeholder="XXXXX"
                underlineColorAndroid="transparent"
                // value={zipCode.length !== 0 ? `Zip Code: ${zipCode}` : ''}
                value={cardState.zipCode}
                onChangeText={(value) => handleCardOnChange("zipCode", value)}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            {errZipCode && (
              <Text style={styles.redText}>Enter valid billing zip</Text>
            )}
          </View>
          {showDefult && (
            <TouchableOpacity
              style={styles.checkContainer}
              onPress={onSetDefault}
            >
              <View style={isDefault ? styles.check1 : styles.check} />
              <Text style={styles.blackBoldText}>Set as default</Text>
            </TouchableOpacity>
          )}
          <View style={styles.bottomDescriptionContainer}>
            <Icon icon="padlock" color="red" style={styles.lockIcon} />
            <Text style={styles.blackText}>
              Card information is never shared with anyone.
            </Text>
          </View>
          <Image source={Imgs.img_stripe} style={styles.imgStripe} />
          {!buttonVisibility &&
            (!cardDetail ? (
              fromScreen === "payment" ? (
                <FooterAction
                  mainButtonProperties={{
                    label: "Next",
                    sublabel: "CONFIRMATION",
                    disabled: false,
                    onPress: () => {
                      onSave();
                    },
                  }}
                />
              ) : (
                <FooterAction
                  mainButtonProperties={{
                    label: "Save",
                    onPress: () => {
                      onSave();
                    },
                  }}
                />
              )
            ) : (
              <View style={styles.buttonContainer}>
                <Button
                  label="Delete"
                  theme="secondary"
                  size="large"
                  style={{ ...margins["mr-3"], ...flex.grow1 }}
                  onPress={() => setDialogVisible(true)}
                />
                <Button
                  label="Save"
                  size="large"
                  style={flex.grow1}
                  onPress={onSave}
                />
              </View>
            ))}
        </ScrollView>
        {buttonVisibility &&
          (!cardDetail ? (
            fromScreen === "payment" ? (
              <FooterAction
                mainButtonProperties={{
                  label: "Next",
                  sublabel: "CONFIRMATION",
                  disabled: false,
                  onPress: () => {
                    onSave();
                  },
                }}
              />
            ) : (
              <FooterAction
                mainButtonProperties={{
                  label: "Save",
                  onPress: () => {
                    onSave();
                  },
                }}
              />
            )
          ) : isDefault ? (
            <View style={styles.buttonContainer}>
              <Button
                label="Delete"
                theme="secondary"
                size="large"
                style={{ ...margins["mr-3"], ...flex.grow1 }}
                onPress={() => setDialogVisible(true)}
                disabled={true}
              />
              <Button
                label="Save"
                size="large"
                style={flex.grow1}
                onPress={onSave}
              />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <Button
                label="Delete"
                theme="secondary"
                size="large"
                style={{ ...margins["mr-3"], ...flex.grow1 }}
                onPress={() => setDialogVisible(true)}
              />
              <Button
                label="Save"
                size="large"
                style={flex.grow1}
                onPress={onSave}
              />
            </View>
          ))}

        <SweetDialog
          title={exitDialogData.title}
          message={exitDialogData.message}
          type="two"
          mainBtTitle={exitDialogData.mainBtTitle}
          secondaryBtTitle={exitDialogData.secondaryBtTitle}
          dialogVisible={dialogVisible}
          onTouchOutside={onModalTouchOutside}
          onMainButtonPressed={onMainButtonPressed}
          onSecondaryButtonPressed={onSecondaryButtonPressed}
        />

        {(loading || updatePaymentMethodState.isFetching) && (
          <View style={Utilities.style.activityContainer}>
            <BallIndicator size={30} color={Colors.active} />
          </View>
        )}
      </SafeAreaView>

      <SafeAreaView
        forceInset={{ bottom: "never" }}
        style={Utilities.safeAreaNotchHelper}
      />
    </>
  );
};

export default CardScreen;
