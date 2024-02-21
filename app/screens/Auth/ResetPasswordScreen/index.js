import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  Text,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { InputText, NormalButton, Icon, SweetAlert } from "#components";
import { resetPassword as resetPasswordApi } from "#services/api";
import { BallIndicator } from "react-native-indicators";
import _ from "lodash";
import { Utilities } from "#styles";
import { Colors } from "#themes";
import { InvalidAlerts } from "#constants";
import { checkPass, showAlert } from "#utils";
import Images from "#assets/images";
import { styles } from "./styles";

const ResetPasswordScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isShowAlert, setShowAlert] = useState(false);
  const [isEnableBtn, setEnableBtn] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [passwordHint, setPasswordHint] = useState("");
  const [passwordConfirmHint, setPasswordConfirmHint] = useState("");

  const [dialogVisible, setDialogVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    if (password === confirmPass) {
      if (checkPass(password)) {
        setEnableBtn(true);
      } else {
        setEnableBtn(false);
      }
    } else {
      setEnableBtn(false);
    }

    if (checkPass(password) === true || password === "") {
      setPasswordHint("");
    } else {
      setPasswordHint(
        "Password must contain at least seven digits, one uppercase letter, one number and one special character"
      );
    }

    if (password === confirmPass || confirmPass === "") {
      setPasswordConfirmHint("");
    } else {
      setPasswordConfirmHint("Passwords must match");
    }
  }, [password, confirmPass]);

  const showSweetAlert = (title, message, type) => {
    setAlertTitle(title);
    setAlertMsg(message);
    setAlertType(type);
    setDialogVisible(true);
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
    if (isShowAlert === true) {
      setTimeout(() => {
        navigation.navigate("SignIn", { fromReset: true });
      }, 500);
    }
  };

  const goBack = () => navigation.goBack();

  const onReset = async () => {
    setShowIndicator(true);
    const userId = route?.params?.userId ?? "";
    const token = route?.params?.token ?? "";
    const res = await resetPasswordApi(userId, token, { params: { password } });
    setShowIndicator(false);
    if (res && res.sucess) {
      setShowAlert(true);
      showSweetAlert(
        "Password reseted!",
        "Your password has been successfully reseted.",
        "success"
      );
    } else if (_.get(res, "result.content.message", null)) {
      //showAlert('Homitag', res.result.content.message);
      showSweetAlert("Oops!", res.result.content.message, "error");
    }
  };

  const onDismiss = () => {
    setShowAlert(false);
    navigation.navigate("SignIn");
  };

  const onShowHint = () => {
    showAlert("Homitag", InvalidAlerts.password);
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <KeyboardAwareScrollView>
        <View style={styles.contentContainr}>
          <Text style={styles.titleText}>Reset Password</Text>
        </View>
        <InputText
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          returnKeyType="done"
        />
        <Text style={styles.activeColorText}>{passwordHint.toUpperCase()}</Text>
        <InputText
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPass}
          onChangeText={setConfirmPass}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          returnKeyType="done"
        />
        <Text style={styles.activeColorText}>
          {passwordConfirmHint.toUpperCase()}
        </Text>
        <NormalButton
          label="Reset Password"
          onPress={onReset}
          buttonStyle={isEnableBtn ? styles.button : styles.button1}
          disabled={!isEnableBtn}
        />
      </KeyboardAwareScrollView>
      {/* isShowAlert && (
        <TouchableOpacity
          style={Utilities.style.activityContainer}
          activeOpacity={1}
          onPress={onDismiss}
        >
          <View style={styles.alertContainer}>
            <Icon icon="check_marked" style={styles.checkIcon} />
            <Text style={styles.alertBoldText}>Password Reseted</Text>
            <Text style={styles.alertText}>
              {'Your password has been\nsuccessfully reseted!'}
            </Text>
          </View>
        </TouchableOpacity>
      )*/}
      {showIndicator && (
        <View style={Utilities.style.activityContainer}>
          <BallIndicator size={30} color={Colors.active} />
        </View>
      )}
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

export default ResetPasswordScreen;
