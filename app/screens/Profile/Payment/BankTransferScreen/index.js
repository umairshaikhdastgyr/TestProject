import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { BallIndicator } from "react-native-indicators";
import { useFocusEffect } from "@react-navigation/native";
import Images from "#assets/images";
import { TextInputMask } from "react-native-masked-text";
import CodeInput from "react-native-confirmation-code-input";
import { apiModels } from "#services/apiModels";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BirthDatePicker } from "../../../Auth/ProfileSetupScreen/BirthDatePicker";
import { Toast } from "#components";
import moment from "moment";
import DocumentPicker from "react-native-document-picker";
import Config from "#config";

const { API_URL } = Config;
import {
  FooterAction,
  Button,
  SweetDialog,
  SweetAlert,
  Icon,
} from "#components";
import { Utilities } from "#styles";
import { InvalidAlerts } from "#constants";
import { RadioButton } from "./RadioButton";
import Input from "./Input";
import { styles } from "./styles";
import { userSelector } from "#modules/User/selectors";
import AddressForm from "./add-address";
import {
  updatePaymentMethod,
  getPaymentBanks,
  getPaymentCards,
} from "../../../../modules/User/actions";
import Imgs from "#assets/images";
import { LocalStorage } from "#services";

import usePrevious from "#utils/usePrevious";
import { flex, margins } from "#styles/utilities";
import { Colors, Fonts } from "#themes";
import BankAccountValid from "../../../../utils/bank-account-validator";
import colors from "#themes/colors";
import fonts from "#themes/fonts";
import { createTokenWithBankOrCard } from "#services/Stripe";

const BankTransferScreen = ({ navigation, route }) => {
  const [isShowDatePicker, setShowDatePicker] = useState(false);
  const cardDetail = route?.params?.detail ?? null;
  const [loader, setLoader] = useState(false);
  const [isShowTost, setIsShowTost] = useState(false);
  const [payStatus, setPayStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });
  const onAlertModalTouchOutside = () => {
    setPayStatus({
      title: "",
      visible: false,
      message: "",
      type: "",
    });
    //  navigation.navigate('PaymentManagement');
  };
  const {
    user: {
      information: { id, email, phonenumber },
      updatePaymentMethodState,
    },
  } = useSelector(userSelector);

  const dispatch = useDispatch();

  const prevUpdatePaymentMethodState = usePrevious(updatePaymentMethodState);

  const [cardOption, setCardOption] = useState({
    obfuscated: false,
    issuer: "visa-or-mastercard",
  });

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

  const validForm = () => {
    let isValid = true;
    const validName = cardState.fullName;

    const validCard = valid.number(cardState.cardNumber);
    const validExpDate = valid.expirationDate(cardState.expDate);
    const validSecCode =
      cardState.securityCode.length > 2 && cardState.securityCode.length <= 4;
    const validBillingZip = valid.postalCode(cardState.zipCode);

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

  useEffect(() => {
    if (
      Object.keys(updatePaymentMethodState.data).length &&
      prevUpdatePaymentMethodState &&
      !Object.keys(prevUpdatePaymentMethodState.data).length
    ) {
      switch (fetchMethod) {
        case "PATCH":
          dispatch(getPaymentBanks({ userId: id, type: "bank" }));
          navigation.navigate("PaymentManagement");
          break;
        case "DELETE":
          dispatch(getPaymentBanks({ userId: id, type: "bank" }));
          navigation.navigate("PaymentManagement");
          break;
      }
    }
  }, [updatePaymentMethodState]);

  useEffect(() => {
    if (
      updatePaymentMethodState.failure &&
      !prevUpdatePaymentMethodState?.failure
    ) {
      setPayStatus({
        title: "Oops!",
        visible: true,
        message: JSON.stringify(
          updatePaymentMethodState?.failure?.raw?.message
            ? updatePaymentMethodState?.failure?.raw?.message
            : updatePaymentMethodState?.failure
        ),
        type: "error",
      });
    }
  }, [prevUpdatePaymentMethodState, updatePaymentMethodState.failure]);

  const bankDetail = route?.params?.detail ?? null;
  const showBankDetailPage = route?.params?.skipPaymentOptionStep ?? null;
  const createStripeAccount = route?.params?.createStripeAccount ?? true;

  const isDefaultFromData = _.get(bankDetail, "metadata.isDefault", false);

  const [dateTimeVisible, setDateTimeVisible] = useState(false);
  const [dateMeetUp, setDateMeetUp] = useState(
    moment()
      // .startOf('hour')
      // .add(1, 'hour')
      .toDate()
  );

  const onCancel = () => {
    setDateTimeVisible(false);
  };

  const onConfirmPicker = (date) => {
    setShowDatePicker(false);
    setBirthdate(moment(date).format("MM-DD-YYYY"));
  };

  const onChangeDate = (event, date) => {
    if (event.type === "dismissed") {
      return;
    }
    setBirthdate(moment(new Date(date)).format("MM-DD-YYYY"));
  };

  const [accountType, setAccountType] = useState("individual");
  const [aHolderName, setAHolderName] = useState(
    bankDetail ? bankDetail.account_holder_name : ""
  );
  const [cardNumber, setCardNumber] = useState(
    bankDetail ? bankDetail.card_number : ""
  );
  const [expDate, setExpdate] = useState(bankDetail ? bankDetail.exp_date : "");
  const [securityCode, setSecurityCode] = useState(
    bankDetail ? bankDetail.security_code : ""
  );
  const [zipCode, setZipCode] = useState(bankDetail ? bankDetail.zip_code : "");
  const [routingNumber, setRoutingNumber] = useState(
    bankDetail ? bankDetail.routing_number : ""
  );

  const [confirmroutingNumber, setconfirmRoutingNumber] = useState(
    bankDetail ? bankDetail.routing_number : ""
  );

  const [accountNumber, setAccountNumber] = useState(
    bankDetail ? `xxxxxxxxx${bankDetail.last4}` : ""
  );
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(
    bankDetail ? `xxxxxxxxx${bankDetail.last4}` : ""
  );

  const [bankName, setBankName] = useState(
    bankDetail ? bankDetail.bank_name : ""
  );

  const [ssn, setSSN] = useState("");

  const [verifyFile, setVerifyFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  const [hidePass, setHidePass] = useState(true);

  const [firstName, setFirstName] = useState(
    bankDetail ? bankDetail.account_holder_name : ""
  );
  const [lastName, setLastName] = useState(
    bankDetail ? bankDetail.account_holder_name : ""
  );
  const [birthDate, setBirthdate] = useState("");

  const [currentStep, setCurrentStep] = useState(
    bankDetail ? 2 : showBankDetailPage ? 1 : 0
  );
  const [selectedMethod, setSelectedMethod] = useState(null);

  const [isDefault, setDefault] = useState(
    bankDetail ? isDefaultFromData === "true" : false
  );
  const [isDisabledBtn, setDisableBtn] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [fetchMethod, setFetchMethod] = useState("");
  const [address, setAddress] = useState(null);

  const [errAccNum, setErrAccNum] = useState("");
  const [errRoutNum, setErrRoutNum] = useState("");
  useEffect(() => {
    if (currentStep == 1) {
      if (
        firstName !== "" &&
        lastName !== "" &&
        birthDate !== "" &&
        address != null
      ) {
        setDisableBtn(false);
      } else {
        setDisableBtn(true);
      }
    } else if (currentStep == 2) {
      if (selectedMethod == "Debit Card") {
        if (
          cardNumber !== "" &&
          expDate !== "" &&
          securityCode !== "" &&
          zipCode.length === 5
        ) {
          setDisableBtn(false);
        } else {
          setDisableBtn(true);
        }
      } else {
        if (
          bankName?.length > 0 &&
          routingNumber?.length === 9 &&
          routingNumber?.length === 9 &&
          accountNumber?.length === 12 &&
          accountNumber?.length === 12 &&
          confirmAccountNumber?.length === 12 &&
          confirmAccountNumber?.length === 12 &&
          confirmroutingNumber?.length === 9 &&
          confirmroutingNumber?.length === 9
        ) {
          setDisableBtn(false);
        } else {
          setDisableBtn(true);
        }
      }
    } else if (currentStep == 3) {
      if (ssn && ssn.length == 9) {
        setDisableBtn(false);
      } else {
        setDisableBtn(true);
      }
    } else {
      if (verifyFile) {
        setDisableBtn(false);
      } else {
        setDisableBtn(true);
      }
    }
  }, [
    accountType,
    aHolderName,
    cardNumber,
    expDate,
    securityCode,
    zipCode,
    routingNumber,
    accountNumber,
    confirmAccountNumber,
    firstName,
    lastName,
    ssn,
    currentStep,
    confirmroutingNumber,
    bankName,
    birthDate,
    verifyFile,
    address,
  ]);

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    if (
      sizes[i] == "MB" &&
      `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}` >= "5.00"
    ) {
      return 0;
    }
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  useEffect(() => {
    if (
      Object.keys(updatePaymentMethodState.data).length &&
      prevUpdatePaymentMethodState &&
      !Object.keys(prevUpdatePaymentMethodState.data).length
    ) {
      dispatch(getPaymentCards({ userId: id, type: "card" }));
      dispatch(getPaymentBanks({ userId: id, type: "bank" }));
      navigation.navigate("AddPaymentConfirm", {
        headerTitle: "Bank Transfer",
        titleMessage: "Set up complete!",
        subtitleMessage: "You’ve successfully added your deposit account.",
      });
    }
  }, [updatePaymentMethodState]);

  const onBack = () => {
    if (currentStep == 0) {
      navigation.goBack();
    } else if (currentStep == 1) {
      setCurrentStep(0);
    } else if (currentStep == 2) {
      setCurrentStep(1);
    } else if (currentStep == 3) {
      setCurrentStep(2);
    } else if (currentStep == 4) {
      setCurrentStep(3);
    }
  };

  const onContinue = async () => {
    const splitedExp = expDate ? expDate.split("/") : ["00", "0000"];
    if (bankDetail) {
      const params = {
        account_holder_name: bankDetail.account_holder_name,
        account_holder_type: bankDetail.account_holder_type,
        metadata: {
          isDefault,
        },
      };
      dispatch(
        updatePaymentMethod({
          userId: id,
          body: { params },
          bankAccountId: bankDetail.id,
          type: "bank",
          method: "PATCH",
        })
      );
      return;
    }
    if (currentStep == 1) {
      setCurrentStep(2);
      return;
    } else if (currentStep == 2) {
      if (selectedMethod == "Debit Card") {
        setCurrentStep(3);
      } else {
        const validAcc = BankAccountValid.accountNumber(accountNumber);
        const validRout = BankAccountValid.routingNumber(routingNumber);
        if (!validAcc.isPotentiallyValid || !validRout.isValid) {
          let validMessage = null;
          if (!validAcc.isPotentiallyValid) {
            validMessage =
              "- Account number is invalid. Please \n   verify and try again";
          }

          if (!validRout.isValid) {
            if (validMessage) {
              validMessage = `${validMessage}\n- ${validRout.errorMsg}`;
            } else {
              validMessage = `${validRout.errorMsg}`;
            }
            setErrRoutNum(validMessage);
          }
          if (accountNumber !== confirmAccountNumber) {
            validMessage = "";
            if (validMessage) {
              validMessage = `${validMessage}\n- Confirm your account number`;
            } else {
              validMessage = "Confirm your account number";
            }
            setErrAccNum(validMessage);
          }

          // setPayStatus({
          //   title: "Oops!",
          //   visible: true,
          //   message: validMessage,
          //   type: "error",
          // });
          return;
        }
        if (routingNumber !== confirmroutingNumber) {
          //  showAlert('Homitag', InvalidAlerts.matchAccountNumber);
          // setPayStatus({
          //   title: "Oops!",
          //   visible: true,
          //   message: InvalidAlerts.matchRoutingNumber,
          //   type: "error",
          setErrRoutNum(InvalidAlerts.matchRoutingNumber);
          // });
          return;
        }
        if (accountNumber !== confirmAccountNumber) {
          //  showAlert('Homitag', InvalidAlerts.matchAccountNumber);
          // setPayStatus({
          //   title: "Oops!",
          //   visible: true,
          //   message: InvalidAlerts.matchAccountNumber,
          //   type: "error",
          // });
          setErrAccNum(InvalidAlerts.matchAccountNumber);
          return;
        }
        setCurrentStep(3);
      }
    } else if (currentStep == 3) {
      if (ssn) {
        setCurrentStep(4);
      } else {
        Alert.alert("Please add ssn number");
      }
    } else if (currentStep == 4) {
      if (selectedMethod == "Debit Card") {
        let params = {
          number: cardNumber,
          expMonth: parseInt(splitedExp[0], 10),
          expYear: parseInt(splitedExp[1], 10),
          cvc: securityCode,
          name: firstName + " " + lastName,
          addressZip: zipCode,
          funding: "debit",
        };

        const data = await createTokenWithBankOrCard({ type: "card", params });
        if (data.success) {
          params = {
            tokenId: data.token.tokenId,
            isDefault,
            isDepositCard: true,
          };

          dispatch(
            updatePaymentMethod({
              userId: id,
              body: { params },
              type: "card",
              method: "POST",
            })
          );
        } else {
          setPayStatus({
            title: "Oops!",
            visible: true,
            message: data?.errMsg?.raw?.message
              ? data?.errMsg?.raw?.message
              : data?.errMsg,
            type: "error",
          });
        }
      } else {
        let params = {
          accountNumber: accountNumber,
          countryCode: "us",
          currency: "usd",
          routingNumber: routingNumber, // 9 digits
          accountHolderName: firstName + " " + lastName,
          accountHolderType: "individual", // "company" or "individual"
        };
        const data = await createTokenWithBankOrCard({ type: "bank", params });
        if (data.success) {
          params = {
            userId: id,
            email: email,
            country: "US",
            business_type: "individual",
            default_currency: "usd",
            individual: {
              first_name: firstName,
              last_name: lastName,
              id_number: ssn,
              phone: phonenumber,
              dob: {
                day: birthDate.split("-")[1],
                month: birthDate.split("-")[0],
                year: birthDate.split("-")[2],
              },
              address: {
                city: address.city,
                line1: address.address_line_1,
                line2: address.address_line_2,
                postal_code: address.zipcode,
                state: address.state,
              },
              ssn_last_4: ssn.substr(-4),
              // verification: {
              //   document: {
              //     front: verifyFile?.id,
              //     back: verifyBackFile?.id,
              //   }
              // },
            },
            documents: {
              bank_account_ownership_verification: {
                files: [verifyFile?.id],
              },
            },
            external_account: `${data.token.tokenId}`,
            metadata: { isDefault },
          };
          dispatch(
            updatePaymentMethod({
              userId: id,
              body: { params },
              createStripeAccount: createStripeAccount,
              type: "bank",
              method: "POST",
            })
          );
        } else {
          setPayStatus({
            title: "Oops!",
            visible: true,
            message: data?.errMsg?.raw?.message
              ? data?.errMsg?.raw?.message
              : data?.errMsg,
            type: "error",
          });
        }
      }
    }
  };

  const exitDialogData = {
    code: "draft_available",
    title: "Delete Confirmation",
    message: "Want to delete?",
    mainBtTitle: "Yes",
    secondaryBtTitle: "No",
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
        bankAccountId: bankDetail.id,
        type: "bank",
        method: "DELETE",
      })
    );
  };
  const onMainButtonPressed = () => {
    deletePaymentMethod();
    setDialogVisible(false);
  };
  const onSetDefault = () => {
    setDefault(!isDefault);
  };

  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;

  const [buttonVisibility, setButtonVisibility] = useState(true);
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

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/*Header start*/}

        <View
          style={{
            elevation: 3,
            backgroundColor: "#ffffff",
            alignItems: "center",
            paddingVertical: 15,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{ width: "13%", alignItems: "center" }}
            onPress={() => {
              onBack();
            }}
          >
            <Ionicons name="arrow-back-outline" size={25} color="#969696" />
          </TouchableOpacity>
          <View style={{ width: "74%", alignItems: "center" }}>
            <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
              Set up Deposit Account
            </Text>
          </View>
          <View style={{ width: "13%", alignItems: "center" }}></View>
        </View>
        {/*Header end*/}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Toast
            isVisible={isShowTost}
            message="Maximum allowed file size is 5 MB."
          />
          <View style={styles.mainContentContainer}>
            {currentStep == 0 ? (
              <View style={{ marginHorizontal: 20 }}>
                <View style={styles.bankTypeContainer}>
                  <Text style={styles.blackText}>
                    This is where your funds will be deposited. Shortly after
                    each sale
                  </Text>
                </View>
                {/* <TouchableOpacity
                  onPress={() => {
                    setCurrentStep(1);
                    setSelectedMethod("Debit Card");
                  }}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 25,
                  }}
                >
                  <Text style={styles.blackBoldText}>Debit Card</Text>
                  <Icon
                    icon={"chevron-right"}
                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    setCurrentStep(1);
                    setSelectedMethod("Bank Account");
                  }}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.blackBoldText}>
                    Bank Account and Routing
                  </Text>
                  <Icon
                    icon={"chevron-right"}
                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
              </View>
            ) : currentStep == 1 ? (
              <View style={{ marginHorizontal: 20 }}>
                <View style={styles.bankTypeContainer}>
                  <Text style={styles.blackText}>
                    This is where your funds will be deposited. Shortly after
                    each sale
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <Text style={{ fontFamily: Fonts.family.semiBold }}>
                      {"First Name"}
                    </Text>
                    <Input
                      label={null}
                      placeholder="First Name"
                      onChangeText={(text) => {
                        setFirstName(text);
                      }}
                      style={{ fontSize: 18, paddingLeft: 0, paddingBottom: 0 }}
                      value={firstName}
                      keyboardType={"default"}
                      editable={true}
                    />
                    {false ? (
                      <Text style={styles.redText}>{"item.err"}</Text>
                    ) : null}
                  </View>
                  <View style={{ flex: 1, marginLeft: 5 }}>
                    <Text style={{ fontFamily: Fonts.family.semiBold }}>
                      {"Last Name"}
                    </Text>
                    <Input
                      label={null}
                      placeholder="Last Name"
                      onChangeText={(text) => {
                        setLastName(text);
                      }}
                      style={{ fontSize: 18, paddingLeft: 0, paddingBottom: 0 }}
                      value={lastName}
                      keyboardType={"default"}
                      editable={true}
                    />
                    {false ? (
                      <Text style={styles.redText}>{"item.err"}</Text>
                    ) : null}
                  </View>
                </View>
                {/* <CustomDateTimePicker
                    visible={dateTimeVisible}
                    value={birthDate}
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                  /> */}

                {isShowDatePicker && (
                  <BirthDatePicker
                    isShowDatePicker={isShowDatePicker}
                    subtract18Years
                    value={new Date(moment(new Date()).subtract(18, "years"))}
                    onChangeDate={onChangeDate}
                    onConfirm={onConfirmPicker}
                    onCancel={() => setShowDatePicker(false)}
                  />
                )}
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <View style={{ flex: 1, marginTop: 20 }}>
                    <Text style={{ fontFamily: Fonts.family.semiBold }}>
                      {"Birthdate"}
                      {/* {"Birthdate"}{moment(birthDate).format("MM-DD-YYYY").split("-")[1]} */}
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        paddingBottom: 8,
                        marginTop: 10,
                        borderBottomColor: colors.grey,
                      }}
                    >
                      <View style={{ width: "90%", justifyContent: "center" }}>
                        <Text
                          style={{
                            fontSize: 12,
                            paddingLeft: 0,
                            paddingBottom: 0,
                            fontFamily: fonts.family.Regular,
                            color: birthDate ? Colors.black : Colors.gray,
                          }}
                        >
                          {birthDate || "MM-DD-YYYY"}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "10%",
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="calendar-month-outline"
                          size={22}
                          color="red"
                          style={{ marginTop: 2 }}
                        />
                      </View>
                    </View>
                    {/* <TextInputMask
                    type="datetime"
                    style={{
                      fontSize: 16,
                      paddingLeft: 0,
                      paddingBottom: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.grey,
                      fontFamily: fonts.family.Regular,
                    }}
                    placeholder="MM-DD-YYYY"
                    options={{
                      format: "MM-DD-YYYY",
                    }}
                    value={birthDate}
                    onChangeText={(value) => setBirthDate(value)}
                  />
                  
                  <MaterialCommunityIcons name="calendar-month-outline" size={22} color="red" style={styles.lockIconn} /> */}

                    {/* <Icon icon="date" color="red" style={styles.lockIcon} /> */}
                    {false ? (
                      <Text style={styles.redText}>{"item.err"}</Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
                <View style={{ flex: 1, marginTop: 20 }}>
                  <AddressForm setAddress={(item) => setAddress(item)} />
                </View>
              </View>
            ) : currentStep == 2 ? (
              <>
                {selectedMethod == "Debit Card" ? (
                  <View style={{ marginHorizontal: 20 }}>
                    <View style={styles.bankTypeContainer}>
                      <Text style={styles.blackText}>
                        This is where your funds will be deposited.
                      </Text>
                    </View>
                    <View style={{ flex: 1, marginRight: 5 }}>
                      <Text style={{ fontFamily: Fonts.family.semiBold }}>
                        {"CARD NUMBER"}
                      </Text>

                      <TextInputMask
                        style={styles.input}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        type="credit-card"
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => {
                          setCardNumber(text);
                        }}
                        value={cardNumber}
                      />
                      {false ? (
                        <Text style={styles.redText}>{"item.err"}</Text>
                      ) : null}
                    </View>
                    <View style={styles.inputsContainer}>
                      <View style={{ marginTop: 30, flex: 1, marginRight: 10 }}>
                        <Text style={{ fontFamily: Fonts.family.semiBold }}>
                          {"EXPIRATION"}
                        </Text>

                        <TextInputMask
                          type="datetime"
                          style={styles.input1}
                          placeholder="MM/YYYY"
                          underlineColorAndroid="transparent"
                          options={{
                            format: "MM/YYYY",
                          }}
                          onChangeText={(text) => {
                            setExpdate(text);
                          }}
                          value={expDate}
                        />
                      </View>
                      <View style={{ marginTop: 30, flex: 1, marginLeft: 10 }}>
                        <Text style={{ fontFamily: Fonts.family.semiBold }}>
                          {"CVV"}
                        </Text>

                        <TextInput
                          placeholderTextColor={"#999999"}
                          style={styles.input1}
                          placeholder="XXX"
                          underlineColorAndroid="transparent"
                          onChangeText={(text) => {
                            setSecurityCode(text);
                          }}
                          value={securityCode}
                          keyboardType="numeric"
                          maxLength={3}
                          editable={!cardDetail}
                        />
                      </View>
                    </View>
                    <View style={{ marginTop: 30, flex: 1 }}>
                      <Text style={{ fontFamily: Fonts.family.semiBold }}>
                        {"ZIP CODE"}
                      </Text>
                      <TextInput
                        placeholderTextColor={"#999999"}
                        style={styles.input}
                        placeholder="XXXXX"
                        underlineColorAndroid="transparent"
                        // value={zipCode.length !== 0 ? `Zip Code: ${zipCode}` : ''}
                        onChangeText={(text) => {
                          setZipCode(text);
                        }}
                        value={zipCode}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={{ marginHorizontal: 20 }}>
                    <View style={styles.bankTypeContainer}>
                      <Text style={styles.blackText}>
                        This is where your funds will be deposited. Shortly
                        after each sale
                      </Text>
                    </View>
                    <View style={{ flex: 1, marginRight: 5 }}>
                      <Text style={{ fontFamily: Fonts.family.semiBold }}>
                        {"Bank Name"}
                      </Text>
                      <Input
                        label={null}
                        placeholder="First Name"
                        onChangeText={(text) => {
                          setBankName(text);
                        }}
                        style={{
                          fontSize: 18,
                          paddingLeft: 0,
                          paddingBottom: 0,
                        }}
                        value={bankName}
                        keyboardType={"default"}
                        editable={true}
                      />
                      {false ? (
                        <Text style={styles.redText}>{"item.err"}</Text>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        marginTop: 20,
                      }}
                    >
                      <View style={{ flex: 1, marginRight: 5 }}>
                        <Text style={{ fontFamily: Fonts.family.semiBold }}>
                          {"Routing Number"}
                        </Text>
                        <Input
                          label={null}
                          placeholder="123456789"
                          style={{
                            fontSize: 18,
                            paddingLeft: 0,
                            paddingBottom: 0,
                          }}
                          onChangeText={(text) => {
                            setErrAccNum("");
                            setErrRoutNum("");
                            setRoutingNumber(text);
                          }}
                          value={routingNumber}
                          maxLength
                          length={9}
                          keyboardType={"default"}
                          editable={true}
                        />
                        {false ? (
                          <Text style={styles.redText}>{"item.err"}</Text>
                        ) : null}
                      </View>
                      <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text style={{ fontFamily: Fonts.family.semiBold }}>
                          {"Account Number"}
                        </Text>
                        <Input
                          label={null}
                          placeholder="123456789123"
                          onChangeText={(text) => {
                            setErrAccNum("");
                            setErrRoutNum("");
                            setAccountNumber(text);
                          }}
                          style={{
                            fontSize: 18,
                            paddingLeft: 0,
                            paddingBottom: 0,
                          }}
                          value={accountNumber}
                          keyboardType={"default"}
                          maxLength
                          length={12}
                          editable={true}
                        />
                        {false ? (
                          <Text style={styles.redText}>{"item.err"}</Text>
                        ) : null}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        marginTop: 20,
                      }}
                    >
                      <View style={{ flex: 1, marginRight: 5 }}>
                        <Text style={{ fontFamily: Fonts.family.semiBold }}>
                          {"Confirm Routing Number"}
                        </Text>
                        <Input
                          label={null}
                          placeholder="123456789"
                          maxLength
                          length={9}
                          onChangeText={(text) => {
                            setErrAccNum("");
                            setErrRoutNum("");
                            setconfirmRoutingNumber(text);
                          }}
                          style={{
                            fontSize: 18,
                            paddingLeft: 0,
                            paddingBottom: 0,
                          }}
                          value={confirmroutingNumber}
                          keyboardType={"default"}
                          editable={true}
                        />
                        {errRoutNum ? (
                          <Text style={styles.redText}>{errRoutNum}</Text>
                        ) : null}
                      </View>
                      <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text style={{ fontFamily: Fonts.family.semiBold }}>
                          {"Confirm Account Number"}
                        </Text>
                        <Input
                          label={null}
                          placeholder="123456789123"
                          onChangeText={(text) => {
                            setErrAccNum("");
                            setErrRoutNum("");
                            setConfirmAccountNumber(text);
                          }}
                          style={{
                            fontSize: 18,
                            paddingLeft: 0,
                            paddingBottom: 0,
                          }}
                          value={confirmAccountNumber}
                          maxLength
                          length={12}
                          keyboardType={"default"}
                          editable={true}
                        />
                        {errAccNum ? (
                          <Text style={styles.redText}>{errAccNum}</Text>
                        ) : null}
                      </View>
                    </View>
                    <Image
                      source={Imgs.confirmbankinfo}
                      resizeMode="contain"
                      style={{ width: "100%" }}
                    />
                  </View>
                )}
              </>
            ) : currentStep == 3 ? (
              <View style={{ marginTop: 30 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: fonts.family.Regular,
                    marginHorizontal: 20,
                  }}
                >
                  You’ve successfully added your deposit account. To transfer
                  funds into your account, please enter the following
                  information to comfirm your identity:
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: fonts.family.semiBold,
                    marginHorizontal: 20,
                    marginTop: 10,
                  }}
                >
                  - Social Security Number
                </Text>
                <View
                  style={{
                    backgroundColor: "#F5F5F5",
                    marginTop: 35,
                    padding: 30,
                    width: "100%",
                  }}
                >
                  <CodeInput
                    ref={(ref) => {}}
                    secureTextEntry={hidePass ? true : false}
                    className={"border-circle"}
                    activeColor={Colors.inactiveText}
                    inactiveColor={Colors.inactiveText}
                    autoFocus={false}
                    ignoreCase
                    inputPosition="center"
                    size={18}
                    space={10}
                    onFulfill={(isValid) => console.info("isValid", isValid)}
                    containerStyle={{}}
                    codeLength={9}
                    keyboardType={"numeric"}
                    textContentType={"username"}
                    autoCompleteType={"off"}
                    autoCorrect={false}
                    onCodeChange={(ssn) => {
                      setSSN(ssn);
                    }}
                    returnKeyType={"done"}
                  />
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.darkGrey2,
                      height: 1,
                      marginTop: 20,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 10,
                      textAlign: "center",
                      fontFamily: fonts.family.Regular,
                      marginHorizontal: 20,
                    }}
                  >
                    Social Security Number{" "}
                    <Text
                      style={{
                        textDecorationLine: "underline",
                        color: "green",
                      }}
                      onPress={() => setHidePass(!hidePass)}
                    >
                      {hidePass ? "Show" : "Hide"}
                    </Text>
                  </Text>
                </View>
              </View>
            ) : currentStep == 4 ? (
              <View style={{ marginTop: 30 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: fonts.family.Regular,
                    marginHorizontal: 20,
                  }}
                >
                  {`Please upload one or more documents so that we can verify your banking information.\n\nAcceptable documents include a bank statement that displays the bank’s official letterhead and full account number or voided check that displays the last 4 digits of the bank account number.\n\n Allow only pdf document. Maximum allowed file size is 5 MB.`}
                </Text>
                <View
                  style={{
                    backgroundColor: "#F5F5F5",
                    marginTop: 20,
                    padding: 30,
                    width: "100%",
                  }}
                >
                  {/* <Text style={{
                    fontSize: 16,
                    fontWeight:'500',
                    fontFamily: fonts.family.Regular,
                    marginHorizontal: 20, 
                    alignSelf:'center'}}
                  >
                    Front
                  </Text> */}
                  <TouchableOpacity
                    onPress={async () => {
                      const res = await DocumentPicker.pick({
                        type: [DocumentPicker.types.pdf],
                      });
                      if (formatBytes(res?.size) == 0) {
                        setIsShowTost(true);
                        setTimeout(() => {
                          setIsShowTost(false);
                        }, 4000);
                        return;
                      } else {
                        const data = new FormData();
                        data.append("document", res);
                        data.append("purpose", "account_requirement");
                        setFileLoading(true);
                        fetch(API_URL + `/banking/files`, {
                          method: "POST",
                          headers: {
                            "x-api-key": Config.ApiKey,
                            "Content-Type": "multipart/form-data; ",
                          },
                          body: data,
                        })
                          .then(async (response) => {
                            const p = await response.json();
                            if (p && p?.data && p?.data?.id) {
                              setVerifyFile(p.data);
                            } else {
                              Alert.alert(
                                "Unable to confirm information",
                                "Please verify your information and try again."
                              );
                            }
                          })
                          .catch((err) => {
                            Alert.alert("Unable to confirm information", err);
                          })
                          .finally(() => {
                            setFileLoading(false);
                          });
                      }
                    }}
                    style={{
                      backgroundColor: Colors.white,
                      borderWidth: 0.5,
                      borderRadius: 10,
                      marginTop: 20,
                      borderColor: "#C4C4C4",
                      padding: 10,
                      paddingHorizontal: 20,
                      flexDirection: "row",
                      justifyContent: verifyFile?.filename
                        ? "space-between"
                        : "center",
                      alignItems: "center",
                    }}
                  >
                    {fileLoading ? (
                      <ActivityIndicator color={"#000"} size="small" />
                    ) : verifyFile?.filename ? (
                      <>
                        <View style={{ flexDirection: "column" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              textAlign: "left",
                              fontFamily: fonts.family.semiBold,
                            }}
                          >
                            {verifyFile?.filename}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              textAlign: "left",
                              fontFamily: fonts.family.Regular,
                              color: colors.blacktoolight,
                            }}
                          >
                            {formatBytes(verifyFile?.size)}
                          </Text>
                        </View>
                        <Ionicons
                          onPress={() => {
                            setVerifyFile(null);
                          }}
                          name="ios-close-circle-outline"
                          size={22}
                          color={"red"}
                        />
                      </>
                    ) : (
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: "center",
                          fontFamily: fonts.family.semiBold,
                        }}
                      >
                        {"Upload a file"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
          {currentStep ? (
            <>
              <View style={styles.bottomDescriptionContainer}>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <Icon icon="padlock" color="red" style={styles.lockIcon2} />
                  <Text style={styles.blackText}>
                    Bank information is never shared with anyone.
                  </Text>
                </View>
              </View>
              <Image source={Imgs.img_stripe} style={styles.imgStripe} />
            </>
          ) : null}

          {!buttonVisibility &&
            (!bankDetail ? (
              <FooterAction
                mainButtonProperties={{
                  label: "Continue",
                  disabled: isDisabledBtn,
                  onPress: () => {
                    onContinue();
                  },
                }}
              />
            ) : (
              <View style={styles.buttonContainer}>
                <Button
                  label="Delete"
                  theme="secondary"
                  size="large"
                  style={
                    bankDetail.default_for_currency
                      ? [flex.grow1, styles.btnContainer1, margins["mr-3"]]
                      : { ...margins["mr-3"], ...flex.grow1 }
                  }
                  onPress={() => setDialogVisible(true)}
                  disabled={bankDetail.default_for_currency}
                />

                <Button
                  label="Continue"
                  size="large"
                  style={
                    isDisabledBtn
                      ? [flex.grow1, styles.btnContainer1]
                      : flex.grow1
                  }
                  onPress={onContinue}
                  disabled={isDisabledBtn}
                />
              </View>
            ))}
        </ScrollView>

        {buttonVisibility && currentStep ? (
          !bankDetail ? (
            currentStep == 5 && loader ? (
              <FooterAction
                mainButtonProperties={{
                  label: <ActivityIndicator size="small" color="#fff" />,
                  disabled: isDisabledBtn,
                  onPress: () => {
                    setLoader(true);
                    onContinue();
                  },
                }}
              />
            ) : (
              <FooterAction
                mainButtonProperties={{
                  label: "Continue",
                  disabled: isDisabledBtn,
                  onPress: () => {
                    setLoader(true);
                    onContinue();
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
                style={
                  bankDetail.default_for_currency
                    ? [flex.grow1, styles.btnContainer1, margins["mr-3"]]
                    : { ...margins["mr-3"], ...flex.grow1 }
                }
                onPress={() => setDialogVisible(true)}
                disabled={bankDetail.default_for_currency}
              />

              <Button
                label="Continue"
                size="large"
                style={
                  isDisabledBtn
                    ? [flex.grow1, styles.btnContainer1]
                    : flex.grow1
                }
                onPress={onContinue}
                disabled={isDisabledBtn}
              />
            </View>
          )
        ) : null}

        {updatePaymentMethodState.isFetching && (
          <View style={Utilities.style.activityContainer}>
            <BallIndicator size={30} color={Colors.active} />
          </View>
        )}
      </SafeAreaView>
      <SweetAlert
        title={payStatus.title}
        message={payStatus.message}
        type={payStatus.type}
        dialogVisible={payStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
        messageStyle={{
          justifyContent: "flex-start",
          color: Colors.red,
          lineHeight: 25,
          textAlign: "left",
        }}
      />
      <SafeAreaView
        forceInset={{ bottom: "never" }}
        style={Utilities.safeAreaNotchHelper}
      />
    </>
  );
};

export default BankTransferScreen;
