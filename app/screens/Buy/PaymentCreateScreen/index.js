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
import { Icon, FooterAction, Button, SweetDialog, Toast } from "#components";
import { styles } from "./styles";
import { userSelector } from "#modules/User/selectors";
import { createTokenWithBankOrCard } from "#services/Stripe";
import { updatePaymentMethod, getPaymentCards } from "#modules/User/actions";
import { flex, margins } from "#styles/utilities";
import { setPaymentDefault } from "#modules/Orders/actions";

import { Colors } from "#themes";
import { Utilities } from "#styles";

const CardScreen = ({ navigation, route }) => {
  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;

  const exitDialogData = {
    code: "draft_available",
    title: "Delete Confirmation",
    message: "Want to delete?",
    mainBtTitle: "Yes",
    secondaryBtTitle: "No",
  };

  const cardDetail = route?.params?.cardDetail ?? null;
  const isDefaultFromData = _.get(cardDetail, "metadata.isDefault", false);

  const [cardState, setCardState] = useState({
    fullName: "",
    cardNumber: "",
    expDate: "",
    securityCode: "",
    zipCode: "",
  });

  const [dialogVisible, setDialogVisible] = useState(false);
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
    },
  } = useSelector(userSelector);

  const dispatch = useDispatch();

  /**
   * @description Modifies the state
   * @param { String } key
   * @param { String } value
   * @returns Void
   */
  const handleCardOnChange = (key = "", value = "") => {
    if (key === "fullName") {
      setCardState({
        ...cardState,
        [key]: value,
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

  const onSave = async () => {
    const splitedExp = cardState.expDate
      ? cardState.expDate.split("/")
      : ["00", "0000"];

    setLoading(true);
    Keyboard.dismiss();

    if (cardDetail) {
      const params = {
        address_zip: cardState.zipCode,
        exp_month: parseInt(splitedExp[0], 10),
        exp_year: parseInt(splitedExp[1], 10),
        name: cardState.fullName,
        metadata: {
          isDefault,
        },
      };

      await dispatch(
        updatePaymentMethod({
          userId: id,
          body: { params },
          cardId: cardDetail.id,
          type: "card",
          method: "PATCH",
        })
      );
      setLoading(false);
      navigation.goBack();
      return;
    }

    if (!validForm()) {
      setLoading(false);
      return;
    }

    let params = {
      number: cardState.cardNumber,
      expMonth: parseInt(splitedExp[0], 10),
      expYear: parseInt(splitedExp[1], 10),
      cvc: cardState.securityCode,
      name: cardState.fullName,
      addressZip: cardState.zipCode,
    };

    try {
      const data = await createTokenWithBankOrCard({ type: "card", params });

      if (data.success) {
        params = { tokenId: data.token.tokenId, isDefault };

        await dispatch(
          updatePaymentMethod({
            userId: id,
            body: { params },
            type: "card",
            method: "POST",
          })
        );
        setLoading(false);
        navigation.goBack();
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
        message: JSON.stringify(e),
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
    const validBillingZip = valid.postalCode(cardState.zipCode, {
      minLength: 5,
    });

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

  const deletePaymentMethod = async () => {
    await dispatch(
      updatePaymentMethod({
        userId: id,
        cardId: cardDetail.id,
        type: "card",
        method: "DELETE",
      })
    );
    navigation.goBack();
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

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Toast message={toastError.message} isVisible={toastError.isVisible} />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardInputContainer}>
            <View style={styles.cardInputHeaderContainer}>
              <Icon icon="credit-card" style={styles.creditIcon} />
              <Text style={styles.blackBoldText}>Add a credit/debit card</Text>
            </View>
            <TextInput
              placeholderTextColor={"#999999"}
              style={styles.input}
              placeholder="Full name"
              underlineColorAndroid="transparent"
              value={cardState.fullName}
              onChangeText={(value) => handleCardOnChange("fullName", value)}
            />
            {errFullName && (
              <Text style={styles.redText}>Enter valid full name</Text>
            )}
            {!cardDetail ? (
              <TextInputMask
                style={styles.input}
                placeholder="Card Number"
                type="credit-card"
                underlineColorAndroid="transparent"
                value={cardState.cardNumber}
                options={cardOption}
                onChangeText={(value) =>
                  handleCardOnChange("cardNumber", value)
                }
              />
            ) : (
              <TextInput
                placeholderTextColor={"#999999"}
                style={styles.input}
                underlineColorAndroid="transparent"
                value={cardState.cardNumber}
                onChangeText={(value) =>
                  handleCardOnChange("cardNumber", value)
                }
                editable={false}
              />
            )}
            {errCardNumber && (
              <Text style={styles.redText}>Enter valid card number</Text>
            )}
            <View style={styles.inputsContainer}>
              <TextInputMask
                type="datetime"
                style={styles.input1}
                placeholder="Exp Date (MM/YYYY)"
                underlineColorAndroid="transparent"
                options={{
                  format: "MM/YYYY",
                }}
                value={cardState.expDate}
                onChangeText={(value) => handleCardOnChange("expDate", value)}
              />
              <View style={styles.space} />
              <TextInput
                placeholderTextColor={"#999999"}
                style={styles.input1}
                placeholder="Sec code"
                underlineColorAndroid="transparent"
                value={cardState.securityCode}
                onChangeText={(value) =>
                  handleCardOnChange("securityCode", value)
                }
                keyboardType="numeric"
                maxLength={4}
                editable={!cardDetail}
              />
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
            <TextInput
              placeholderTextColor={"#999999"}
              style={styles.input}
              placeholder="Billing Zip"
              underlineColorAndroid="transparent"
              // value={zipCode.length !== 0 ? `Zip Code: ${zipCode}` : ''}
              value={cardState.zipCode}
              onChangeText={(value) => handleCardOnChange("zipCode", value)}
              keyboardType="numeric"
              maxLength={15}
            />
            {errZipCode && (
              <Text style={styles.redText}>Enter valid billing zip</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.checkContainer}
            onPress={onSetDefault}
          >
            <View style={isDefault ? styles.check1 : styles.check} />
            <Text style={styles.blackBoldText}>Set as default</Text>
          </TouchableOpacity>
          <View style={styles.bottomDescriptionContainer}>
            <Icon icon="padlock" color="red" style={styles.lockIcon} />
            <Text style={styles.blackText}>
              Card information is never shared with anyone.
            </Text>
          </View>
          <Image source={Imgs.img_stripe} style={styles.imgStripe} />
          {!buttonVisibility &&
            (!cardDetail ? (
              <FooterAction
                mainButtonProperties={{
                  label: "Save",
                  onPress: () => {
                    onSave();
                  },
                }}
              />
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
            <FooterAction
              mainButtonProperties={{
                label: "Save",
                onPress: () => {
                  onSave();
                },
              }}
            />
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
