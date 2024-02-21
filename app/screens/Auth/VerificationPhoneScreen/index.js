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
import { Utilities } from "#styles";
import { styles } from "../VerificationScreen/styles";
import { SendPhoneButton } from "../VerificationScreen/Buttons";
import { Colors } from "#themes";

class VerificationPhoneScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      enabledVerifyBtn: false,
      showSuccessModal: false,
      dialogVisible: false,
      alertTitle: "",
      alertMsg: "",
      phone: "",
      alertType: "success",
      sendTo: "email",
      warningText: "",
      hidePass: true,
    };
  }

  componentDidMount() {
    if (this.props.user.information.phonenumber != null) {
      this.formatPhone(this.props.user.information.phonenumber);
    } else {
      this.formatPhone(this.props.route?.params?.phoneNumberString);
    }
  }

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
      this.props.navigation.navigate("Verification");
      if (this.props.user.information.justSignUp) {
        this.onNext();
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

  formatPhone = (phoneNumberStringInput) => {
    const phoneNumberStringStr = phoneNumberStringInput;
    const phoneNumberString = phoneNumberStringStr?.substring(2);
    let newText = "";
    let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    for (var i = 0; i < cleaned.length; i++) {
      if (i == 0) {
        newText = "(";
      } else if (i == 3) {
        newText = newText + ") ";
      } else if (i == 6) {
        newText = newText + "-";
      }
      newText = newText + cleaned[i];
    }
    this.setState({
      phone: "+1 " + newText,
    });
    //setPhone("+1 "+newText)
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
      this.props.navigation.navigate("Verification");
      this.onNext();
    });
  };

  onNext = () => {
    const param = { email: this.props.user.information.email };
    this.props.requestCode(param, this.props.user.information.id, "email");
  };

  onSkip = async () => {
    this.props.navigation.navigate("Verification");
    this.onNext();
  };

  renderBottomButton = () => {
    const { enabledVerifyBtn } = this.state;
    return (
      <View style={styles.bottomButtonContainer}>
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
            onPress={this.onBack}
            name="arrow-back-outline"
            size={25}
            color="#969696"
          />
          <Text></Text>
          <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
            Verification Code
          </Text>
          <Text></Text>
          <Text
            style={{
              color: Colors.active,
              fontFamily: Fonts.family.regular,
              fontWeight: "600",
              fontSize: Fonts.size.medium,
            }}
            onPress={this.onSkip}
          >
            SKIP
          </Text>
        </View>
        {/*Header End*/}
        {/* <SubHeader title="Verification Code" hasShadow onBack={this.onBack} /> */}
        <Text style={styles.descriptionText}>
          We have sent a verification code to{"\n"}
          {this.state.phone}
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
              style={{ textDecorationLine: "underline", color: "green" }}
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
          {this.props.user.information.phonenumber && (
            <SendPhoneButton onPress={this.onSendPhone} />
          )}
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerificationPhoneScreen);
