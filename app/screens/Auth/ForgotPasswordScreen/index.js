import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  NativeModules,
  Platform,
  Keyboard,
  SafeAreaView
} from "react-native";
import { BallIndicator } from "react-native-indicators";
import _ from "lodash";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Images from "#assets/images";
import { InputText, NormalButton, Icon, SweetAlert } from "#components";
import { checkEmail, showAlert } from "#utils";
import { Colors } from "#themes";
import { forgotPassword as forgotPasswordApi } from "#services/api";
import { Utilities } from "#styles";
import { styles } from "./styles";

class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      disabledButton: true,
      isShown: false,
      isShowAlert: false,
      showIndicator: false,
      dialogVisible: false,
      alertTitle: "",
      alertMsg: "",
      alertType: "success",
      emailHint: "",
    };
  }

  showSweetAlert = (title, message, type) => {
    this.setState({
      dialogVisible: true,
      alertTitle: title,
      alertMsg: message,
      alertType: type,
    });
  };

  onModalTouchOutside = () => {
    const { email } = this.state;

    this.setState({ dialogVisible: false }, () => {
      if (this.state.isShowAlert === true) {
        this.setState({ isShowAlert: false });
        setTimeout(() => {
          this.props.navigation.navigate("ForgotVerification", { email });
        }, 500);
      }
    });
  };

  onChangeText = (email) => this.setState({ email }, this.validate);

  validate = () => {
    if (checkEmail(this.state.email)) {
      this.setState({ emailHint: "" });
      this.setState({ disabledButton: false });
    } else {
      this.setState({ emailHint: "Must be a valid email" });
      this.setState({ disabledButton: true });
    }
  };

  onSend = async () => {
    const { email } = this.state;
    this.setState({ showIndicator: true });
    const res = await forgotPasswordApi({ params: { email, isMobile: true } });
    this.setState({ showIndicator: false });
    if (res && res.success) {
      this.setState({ isShown: true, isShowAlert: true });
      this.showSweetAlert(
        "Password reset sent!",
        `An email with verification code sent to ${email}.`,
        "success"
      );
    } else if (_.get(res, "result.content.message", null)) {
      this.showSweetAlert("Oops!", res.result.content.message, "error");
      //showAlert('Homitag', res.result.content.message);
    }
  };

  onDismiss = () => {
    const { email } = this.state;

    this.setState({ isShowAlert: false });
    this.props.navigation.navigate("ForgotVerification", { email });
  };

  openEmail = () => {
    if (Platform.OS === "android") {
      NativeModules.UIMailLauncherModule.launchMailApp();
      return;
    }
    Linking.openURL("message:0"); // iOS
    return;
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backBtnContainer} onPress={this.goBack}>
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
    );
  };

  renderAlert = () => {
    const { email } = this.state;
    return (
      <TouchableOpacity
        style={Utilities.style.activityContainer}
        activeOpacity={1}
        onPress={this.onDismiss}
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

  render() {
    const {
      email,
      disabledButton,
      isShown,
      showIndicator,
      isShowAlert,
      alertTitle,
      alertMsg,
      alertType,
      dialogVisible,
      emailHint,
    } = this.state;
    return (
      <SafeAreaView style={styles.container} forceInset={{ bottom: "always" }}>
        <View style={styles.statusContainer} />
        {this.renderHeader()}
        <KeyboardAwareScrollView>
          <View style={styles.mainContentContainer}>
            <Text style={styles.titleText}>Forgot Password</Text>
            <Text style={styles.descriptionText}>
              {
                "Enter the email associated with your\nHomitag account and we’ll send you\ninstructions on how to reset your password."
              }
            </Text>
            <InputText
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={this.onChangeText}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            {emailHint !== "" && (
              <Text style={styles.hintText}>{emailHint.toUpperCase()}</Text>
            )}
            <NormalButton
              label="Send"
              onPress={this.onSend}
              buttonStyle={
                disabledButton
                  ? styles.sendBtnContainer1
                  : styles.sendBtnContainer
              }
              disabled={disabledButton}
            />
            {isShown && (
              <TouchableOpacity
                style={styles.linkBtnContainer}
                onPress={this.openEmail}
              >
                <Text style={styles.linkText}>Go check your email</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAwareScrollView>
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
          onTouchOutside={this.onModalTouchOutside}
        />
      </SafeAreaView>
    );
  }
}

export default ForgotPasswordScreen;
