import React, { Component } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import CodeInput from "react-native-confirmation-code-input";
import { BallIndicator } from "react-native-indicators";
import { authSelector } from "#modules/Auth/selectors";
import { userSelector } from "#modules/User/selectors";
import Ionicons from "react-native-vector-icons/Ionicons";
import fonts from "#themes/fonts";
import { Fonts } from "#themes";
import {
  verifyCode,
  requestCode,
  requestPhoneCode,
} from "#modules/Auth/actions";
import { SuccessAlert } from "#constants";
import { NormalButton, SweetAlert } from "#components";

import { loginWithToken, loginWithOauth } from "#modules/Auth/actions";
import { Utilities } from "#styles";
import { styles } from "./styles";
import { ResendButton } from "./Buttons";
import { Colors } from "#themes";
import { LocalStorage } from "#services";
import colors from "#themes/colors";
import { setToken } from "#services/httpclient/clientHelper";

class VerificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGuest: false,
      code: "",
      enabledVerifyBtn: false,
      showSuccessModal: false,
      dialogVisible: false,
      alertTitle: "",
      alertMsg: "",
      alertType: "success",
      sendTo: "email",
      warningText: "",
      hidePass: true,
    };
  }

  componentDidMount() {
    this.onInitial();

    if (this.props.route?.params?.isGuest) {
      this.setState({ isGuest: true });
    }
    if (this.props.route?.params?.type == "skip")
      if (this.props.user.information.justSignUp) {
        this.onResendEmail();
      }
  }

  onInitial = async () => {
    const user = await LocalStorage.getUserInformation();
    const tokens = await LocalStorage.getTokens();
    setToken(tokens?.token);
    if (user && tokens) {
      this.props.loginWithToken();
    }
  };

  showSweetAlert = (title, message, type) => {
    this.setState({
      dialogVisible: true,
      alertTitle: title,
      alertMsg: message,
      alertType: type,
    });
  };

  setWarningText = (warningText) => {
    this.setState({ warningText });
  };

  setSendTo = (sendTo) => {
    this.setState({ sendTo });
  };

  onModalTouchOutside = () => {
    this.setState({ dialogVisible: false }, () => {
      if (
        this.props.user.information.emailvalidated == true ||
        this.props.user.information.phonenumbervalidated == true
      ) {
        this.props.navigation.navigate("App");
      } else {
        this.props.navigation.navigate("App");
      }
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.navigation.isFocused() === true) {
      if (
        this.props.auth.isFetchingVerify === 0 &&
        prevProps.auth.isFetchingVerify !== 0 &&
        this.props.auth.failure
      ) {
        this.field.clear();
        this.setWarningText(JSON.stringify(this.props.auth.failure));
      } else if (
        this.props.auth.isFetchingVerify === 0 &&
        prevProps.auth.isFetchingVerify === 1 &&
        !this.props.auth.failure
      ) {
        this.showSweetAlert(
          "Success!",
          "Verification ran successfully.\n Start buying or selling!",
          "success"
        );
      } else if (
        this.props.auth.isFetchingVerify === 0 &&
        prevProps.auth.isFetchingVerify === 2 &&
        !this.props.auth.failure
      ) {
        this.setWarningText(SuccessAlert.sentEmail);
        this.setSendTo("email");
      } else if (
        this.props.auth.isFetchingVerify === 0 &&
        prevProps.auth.isFetchingVerify === 3 &&
        !this.props.auth.failure
      ) {
        this.setWarningText(SuccessAlert.sentPhone);
        this.setSendTo("phonenumber");
      }
    }
  }

  onBack = () => {
    this.props.navigation.goBack();
  };

  onVerify = () => {
    const { code, sendTo } = this.state;
    const userId = this.props.user?.information?.id ?? "";
    this.props.verifyCode(userId, sendTo, { token: code });
  };

  onFocusInput = () => {
    this.field.clear();
    this.setState({ enabledVerifyBtn: false, code: "" });
  };

  onCodeChange = (code) => {
    this.setState({ code }, this.validate);
  };

  onResendEmail = () => {
    this.field.clear();
    const param = { email: this.props.user.information.email };
    this.setSendTo("email");
    this.props.requestCode(param, this.props.user.information.id, "email");
  };

  onSendPhone = () => {
    this.field.clear();
    const param = { phonenumber: this.props.user.information.phonenumber };
    this.setSendTo("phonenumber");
    this.props.requestPhoneCode(
      param,
      this.props.user.information.id,
      "phonenumber"
    );
  };

  onContinueGuest = () => {
    if (
      this.props.user.information.emailvalidated == true ||
      this.props.user.information.phonenumbervalidated == true
    ) {
      this.props.navigation.navigate("App");
    } else {
      this.props.navigation.navigate("App");
    }
  };

  validate = () => {
    const { code } = this.state;
    if (code.length === 6) {
      this.setState({ enabledVerifyBtn: true });
    } else {
      this.setState({ enabledVerifyBtn: false });
    }
  };

  onDismiss = () => {
    this.setState({ showSuccessModal: false }, () => {
      if (
        this.props.user.information.emailvalidated == true ||
        this.props.user.information.phonenumbervalidated == true
      ) {
        this.props.navigation.navigate("App");
      } else {
        this.props.navigation.navigate("App");
      }
    });
  };

  renderBottomButton = () => {
    const { enabledVerifyBtn } = this.state;
    return (
      <View style={styles.bottomButtonContainer}>
        {this.props.user.information.justSignUp ? null : (
          <View style={styles.buttonSubContainer}>
            <NormalButton
              label="Send code"
              onPress={this.onResendEmail}
              buttonStyle={styles.activeBtn}
            />
          </View>
        )}
        <View style={styles.buttonSubContainer}>
          <NormalButton
            label="Verify"
            onPress={this.onVerify}
            buttonStyle={
              enabledVerifyBtn ? styles.activeBtn : styles.inactiveBtn
            }
            disabled={!enabledVerifyBtn}
          />
        </View>
      </View>
    );
  };

  render() {
    const user = this.props.user.information;

    const { auth } = this.props;
    const {
      alertTitle,
      alertMsg,
      alertType,
      dialogVisible,
      warningText,
      sendTo,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {/*Header Start*/}
        <View
          style={{
            elevation: 3,
            backgroundColor: "#ffffff",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 15,
            flexDirection: "row",
          }}
        >
          <Ionicons
            onPress={() => {
              this.onBack();
            }}
            name="arrow-back-outline"
            size={25}
            color="#969696"
          />
          <Text></Text>
          <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
            Verification Code
          </Text>
          <Text></Text>
          {this.props.user.information.emailvalidated == true ||
          this.props.user.information.phonenumbervalidated == true ? (
            <Text
              style={{
                color: Colors.active,
                fontFamily: Fonts.family.regular,
                fontWeight: "600",
                fontSize: Fonts.size.medium,
              }}
              onPress={() => {
                this.props.navigation.navigate("App");
              }}
            >
              SKIP
            </Text>
          ) : (
            <Text
              style={{
                color: Colors.active,
                fontFamily: Fonts.family.regular,
                fontWeight: "600",
                fontSize: Fonts.size.medium,
              }}
              onPress={() => {
                this.props.navigation.navigate("App");
              }}
            >
              SKIP
            </Text>
          )}
        </View>
        {/*Header End*/}
        {/* <SubHeader title="Verification Code" hasShadow onBack={this.onBack} /> */}
        <Text style={styles.descriptionText}>
          Verify your email to get access to all features {"\n"}
          <Text style={{ color: colors.primary }}>
            {this.props.user.information.email}
          </Text>
        </Text>
        <View style={styles.verificationCodeContainer}>
          <TouchableOpacity
            style={styles.codeInput}
            activeOpacity={1}
            onPress={this.onFocusInput}
          >
            <CodeInput
              ref={(ref) => (this.field = ref)}
              secureTextEntry={this.state.hidePass ? true : false}
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
              onCodeChange={this.onCodeChange}
              returnKeyType="done"
            />
          </TouchableOpacity>
          <Text style={styles.smsLabel}>
            Enter the code{" "}
            <Text
              style={{
                textDecorationLine: "underline",
                textDecorationStyle: "solid",
                color: "green",
              }}
              onPress={() =>
                this.setState({
                  hidePass: !this.state.hidePass,
                })
              }
            >
              {this.state.hidePass ? "Show" : "Hide"}
            </Text>
          </Text>
        </View>
        {warningText !== "" && (
          <Text style={styles.warningText}>{warningText}</Text>
        )}
        <View style={styles.buttonsContainer}>
          {this.props.user.information.justSignUp ? (
            <ResendButton onPress={this.onResendEmail} />
          ) : null}
        </View>
        {this.renderBottomButton()}
        {auth.isFetchingVerify !== 0 && (
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

const mapStateToProps = (state) => ({
  ...authSelector(state),
  ...userSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  verifyCode: (userID, sendTo, param) =>
    dispatch(verifyCode(userID, sendTo, param)),
  requestCode: (param, userID, verificationType) =>
    dispatch(requestCode(param, userID, verificationType)),
  requestPhoneCode: (param, userID, verificationType) =>
    dispatch(requestPhoneCode(param, userID, verificationType)),
  loginWithToken: () => dispatch(loginWithToken()),
  loginWithOauth: (params, authID) => dispatch(loginWithOauth(params, authID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerificationScreen);
