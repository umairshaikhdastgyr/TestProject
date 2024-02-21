import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  Image,
  Text,
  SafeAreaView,
} from "react-native";
import CodeInput from "react-native-confirmation-code-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BallIndicator } from "react-native-indicators";
import _ from "lodash";
import Images from "#assets/images";
import { NormalButton, Icon, SweetAlert } from "#components";
import {
  validateCode as validateCodeApi,
  forgotPassword as forgotPasswordApi,
} from "#services/api";
import { ResendButton } from "../VerificationScreen/Buttons";
import { Colors } from "#themes";
import { Utilities } from "#styles";
import { styles } from "./styles";

const ForgotVerificationScreen = ({ navigation, route }) => {
  const [enabledVerifyBtn, setEnableVerifyBtn] = useState(false);
  const [code, setCode] = useState("");
  const [showIndicator, setIndicator] = useState(false);
  const [isShowAlert, setShowAlert] = useState(false);
  const [hidePass, setHidePass] = useState(true);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    if (code.length === 6) {
      setEnableVerifyBtn(true);
    } else {
      setEnableVerifyBtn(false);
    }
  }, [code]);

  const inputRef = useRef(null);

  const onFocusInput = () => {
    inputRef.current.clear();
    setEnableVerifyBtn(false);
    setCode("");
  };
  const onCodeChange = (str) => {
    setCode(str);
  };

  const showSweetAlert = (title, message, type) => {
    setAlertTitle(title);
    setAlertMsg(message);
    setAlertType(type);
    setDialogVisible(true);
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onResendEmail = async () => {
    const email = route?.params?.email ?? "";
    setIndicator(true);
    const res = await forgotPasswordApi({ params: { email, isMobile: true } });
    setIndicator(false);
    if (res && res.success) {
      // setShowAlert(true);
      showSweetAlert(
        "Password reset sent!",
        `An email with a new verification code sent to ${email}.`,
        "success"
      );
    } else if (_.get(res, "result.content.message", null)) {
      inputRef.current.clear();
      showSweetAlert("Oops", res.result.content.message, "error");
      // showAlert('Homitag', res.result.content.message);
    }
  };

  const onDismiss = () => {
    setShowAlert(false);
  };

  const onVerify = async () => {
    try {
      setIndicator(true);
      const params = {
        email: route?.params?.email ?? "",
        token: code,
        type: "mobile",
      };
      const res = await validateCodeApi(params);
      setIndicator(false);
      if (res && res.sucess) {
        navigation.navigate("ResetPassword", {
          token: _.get(res, "token", null),
          userId: _.get(res, "userId", null),
        });
      } else if (_.get(res, "result.content.message", null)) {
        inputRef.current.clear();
        showSweetAlert("Oops", res.result.content.message, "error");
        // showAlert('Homitag', res.result.content.message);
      }
    } catch (e) {
      inputRef.current.clear();
      setIndicator(false);
      console.info("e onVerify", e);
    }
  };

  const goBack = () => navigation.goBack();

  const renderAlert = () => {
    const email = route?.params?.email ?? "";
    return (
      <TouchableOpacity
        style={Utilities.style.activityContainer}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <View style={styles.alertContainer}>
          <Icon icon="check_marked" style={styles.checkIcon} />
          <Text style={styles.alertBoldText}>Password Reset Sent!</Text>
          <Text style={styles.alertText}>
            {`Email with verification code  and resent instructions  sent to  ${email}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} forceInset={{ bottom: "always" }}>
      <View style={styles.statusContainer} />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backBtnContainer} onPress={goBack}>
          {Platform.OS === "ios" && (
            <Image
              source={require("../../../assets/icons/icon_white_back_ios.png")}
              style={styles.backIcon}
            />
          )}
          {Platform.OS === "android" && (
            <Image
              source={require("../../../assets/icons/icon_white_back.png")}
              style={styles.backIcon}
            />
          )}
        </TouchableOpacity>
        <Image source={Images.logo} style={styles.logoImg} />
      </View>
      <KeyboardAwareScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainr}>
          <Text style={styles.titleText}>Verification Code</Text>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {"Enter the Verification Code to reset your\npassword"}
          </Text>
          <View style={styles.verificationCodeContainer}>
            <TouchableOpacity
              style={styles.codeInput}
              activeOpacity={1}
              onPress={onFocusInput}
            >
              <CodeInput
                ref={inputRef}
                secureTextEntry={hidePass ? true : false}
                className="border-circle"
                activeColor={Colors.inactiveText}
                inactiveColor={Colors.inactiveText}
                autoFocus={false}
                ignoreCase
                inputPosition="center"
                size={20}
                space={14}
                onFulfill={(isValid) => console.info("isValid", isValid)}
                containerStyle={styles.codeInputContainer}
                codeLength={6}
                keyboardType="decimal-pad"
                onCodeChange={onCodeChange}
              />
            </TouchableOpacity>
            <Text style={styles.smsLabel}>
              Enter the code{" "}
              <Text
                style={{ textDecorationLine: "underline", color: "green" }}
                onPress={() => setHidePass(!hidePass)}
              >
                {hidePass ? "Show" : "Hide"}
              </Text>
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <ResendButton onPress={onResendEmail} />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.bottomBtnContainer}>
        <NormalButton
          label="Verify"
          onPress={onVerify}
          buttonStyle={enabledVerifyBtn ? styles.activeBtn : styles.inactiveBtn}
          disabled={!enabledVerifyBtn}
        />
      </View>
      {showIndicator && (
        <View style={Utilities.style.activityContainer}>
          <BallIndicator size={30} color={Colors.active} />
        </View>
      )}
      {/* isShowAlert && renderAlert() */}
      <SweetAlert
        title={alertTitle}
        message={alertMsg}
        type={alertType}
        dialogVisible={dialogVisible}
        onTouchOutside={onModalTouchOutside}
      />
    </SafeAreaView>
  );
};

export default ForgotVerificationScreen;
