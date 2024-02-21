import React from "react";
import { View, ScrollView, Keyboard } from "react-native";
import {
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import Images from "#assets/images";
import { InputText, NormalButton } from "#components";
import { BallIndicator } from "react-native-indicators";
import { authSelector } from "#modules/Auth/selectors";
import { loginWithEmail, loginWithOauth } from "#modules/Auth/actions";
import { connect } from "react-redux";
import { InvalidAlerts } from "#constants";
import { checkEmail, checkPass, saveAppleDataToFirebase } from "#utils";
import { Colors, Metrics } from "#themes";
import { Utilities } from "#styles";
import { styles } from "./styles";
import { FacebookButton, GoogleButton } from "../MainAuthScreen/Buttons";
import { FacebookAuth, GoogleAuth } from "#services";
import ConfirmationPopup from "./ConfirmationPopup";
import {
  AppleButton,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import firestore from "@react-native-firebase/firestore";
import { reactiveUserAccount } from "#services/apiUsers";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { CommonActions } from "@react-navigation/native";

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      auth: {},
      warningText: "",
      disabledBt: true,
      fromReset: false,
      loader: false,
      reactivateUser: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isFetchingSignIn !== prevState.auth.isFetchingSignIn) {
      return {
        auth: { ...nextProps.auth },
      };
    }
    return null;
  }

  componentDidMount() {
    if (
      this.props.route?.params !== undefined &&
      this.props.route?.params?.fromReset !== undefined
    ) {
      this.setState({
        fromReset: this.props.route?.params?.fromReset,
      });
    }
  }

  count = 0;

  componentDidUpdate(prevProps, prevState) {
    const { auth } = this.state;
    if (auth.failure && auth.failure !== prevState.auth.failure) {
      this.setWarning(auth.failure, this.count);
      this.count = 1;
    } else if (auth.token && auth.token !== prevState.auth.token) {
      this.props.navigation.dispatch((state) => {
        const routes = state.routes.filter(
          (r) => r.name !== "SignIn" && r.name !== "MainAuth"
        );
        const AppAuthRoutes = state.routes.filter((r) => r.name == "AppAuth");
        if (AppAuthRoutes?.length == 0) {
          return this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "App" }],
            })
          );
        } else {
          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        }
      });
    }
    if (
      this.state.email.length === 0 ||
      this.state.password.length === 0 ||
      checkEmail(this.state.email) === false
    ) {
      if (this.state.disabledBt === false) {
        this.setState({ disabledBt: true });
      }
    } else {
      if (this.state.disabledBt === true) {
        this.setState({ disabledBt: false });
      }
    }

    if (
      this.props.route?.params !== undefined &&
      this.props.route?.params?.fromReset !== undefined &&
      prevProps.route?.params?.fromReset !== this.props.route?.params?.fromReset
    ) {
      this.setState({
        fromReset: this.props.route?.params?.fromReset,
      });
    }
  }
  setWarning = (text, showCount) => {
    this.setState({ warningText: text });
    if (
      (text == "Your account is deleted!" || text == "User is deleted!") &&
      showCount == 0 &&
      !this.props.route?.params?.isLoginEmail
    ) {
      Alert.alert(
        "Reactivate Account!",
        "Are you certain you want to delete your account?",
        [
          {
            text: "Reactivate Account",
            onPress: () => {
              this.onReactivateAccount();
            },
          },
          { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
        ]
      );
    }
  };

  onReactivateAccount = async () => {
    const { email } = this.state;
    const params = { email };
    this.setState({ loader: true });
    try {
      const response = await reactiveUserAccount(params);
      if (response?.status == 200) {
        this.setState({ reactivateUser: true });
        this.onLogin();
        this.setState({ loader: false });
      } else {
        this.setState({ loader: false });
      }
    } catch (error) {
      this.setState({ loader: false });
    }
  };

  onLogin = () => {
    const { auth } = this.state;
    if (this.onValidate()) {
      const { email, password } = this.state;
      const params = { email, password };
      this.setState({ warningText: "" });
      this.props.loginWithEmail(params);
      if (
        (auth?.failure == "Your account is deleted!" ||
          auth?.failure == "User is deleted!") &&
        !this.props.route?.params?.isLoginEmail
      ) {
        if (!this.state.reactivateUser) {
          Alert.alert(
            "Reactivate Account!",
            "Are you certain you want to delete your account?",
            [
              {
                text: "Reactivate Account",
                onPress: () => {
                  this.onReactivateAccount();
                },
              },
              { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
            ]
          );
        }
      }
    }
  };

  onModalTouchOutside = () => {
    this.setState({ dialogVisible: false });
  };

  onValidate = () => {
    const { email, password } = this.state;
    if (email.length === 0) {
      this.setState({ warningText: InvalidAlerts.emptyEmail });
      return false;
    } else if (password.length === 0) {
      this.setState({ warningText: InvalidAlerts.emptyPassword });
      return false;
    } else if (!checkPass(password)) {
      this.setState({ warningText: InvalidAlerts.password });
      return false;
    } else if (!checkEmail(email)) {
      this.setState({ warningText: InvalidAlerts.email });
      return false;
    }
    return true;
  };

  onChangeText = (stateName, value) => {
    this.setState({ [stateName]: value });
  };

  onContinueFB = async () => {
    try {
      const { user } = await FacebookAuth.login();
      if (user) {
        this.props.loginWithOauth(user, 0);
      }
    } catch (e) {
      console.info("unable to login", e);
    }
  };

  onContinueGoogle = async () => {
    try {
      const { userInfo } = await GoogleAuth.login();
      if (userInfo.user) {
        this.props.loginWithOauth(userInfo.user, 1);
      }
      console.info("google login", userInfo.user);
    } catch (e) {
      console.info("unable to login", e);
    }
  };

  onAppleSignin = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      if (appleAuthRequestResponse && appleAuthRequestResponse.identityToken) {
        const defaultProfilePhotoURL =
          "https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg";
        const { identityToken, nonce } = appleAuthRequestResponse;
        saveAppleDataToFirebase(identityToken, nonce).then(async (response) => {
          if (response?.user) {
            if (response.additionalUserInfo.isNewUser) {
              const userData = {
                email:
                  appleAuthRequestResponse?.email !== null
                    ? appleAuthRequestResponse?.email
                    : response?.user?.email,
                id: appleAuthRequestResponse?.user,
                givenName: appleAuthRequestResponse?.fullName?.givenName,
                familyName: appleAuthRequestResponse?.fullName?.familyName,
                photo: defaultProfilePhotoURL,
              };
              firestore()
                .collection("authTokens")
                .doc(response.user.uid)
                .set(userData)
                .then(async () => {
                  this.props.loginWithOauth(userData, 1, 1);
                })
                .catch((_error) => {
                  console.log(_error + ": " + _error.code);
                });
            } else {
              const user = await firestore()
                .collection("authTokens")
                .doc(response.user.uid)
                .get();
              if (user?._data?.email !== null) {
                const userData = {
                  email: user?._data?.email,
                  id: appleAuthRequestResponse?.user,
                  givenName: user?._data?.givenName,
                  familyName: user?._data?.familyName,
                  photo: user?._data?.photo,
                };
                this.props.loginWithOauth(userData, 1, 1);
              }
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  onForgotPass = () => this.props.navigation.navigate("ForgotPassword");

  onSignup = () => this.props.navigation.navigate("Signup");

  onTermsAndCond = () =>
    this.props.navigation.navigate("TermsAndConditionScreen");

  onPrivacy = () => this.props.navigation.navigate("Privacy");

  onBack = () => this.props.navigation.goBack();

  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backBtnContainer} onPress={this.onBack}>
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

  renderMainContent = () => {
    const { email, password, warningText } = this.state;
    return (
      <View style={styles.mainContentContainer}>
        {this.state.fromReset === false && (
          <Text style={styles.titleText}>Login</Text>
        )}

        {this.state.fromReset === true && (
          <FacebookButton onPress={this.onContinueFB} />
        )}
        {this.state.fromReset === true && <View style={styles.space} />}
        {this.state.fromReset === true && (
          <GoogleButton onPress={this.onContinueGoogle} />
        )}
        {this.state.fromReset === true && <View style={styles.space} />}
        {this.state.fromReset === true && Platform.OS === "ios" && (
          <>
            <AppleButton
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.SIGN_IN}
              style={{
                height: Metrics.buttonHeight,
                width: Metrics.width - 100,
                alignSelf: "center",
                borderRadius: 10,
              }}
              onPress={() => this.onAppleSignin()}
            />
            <View style={styles.space} />
          </>
        )}
        {this.state.fromReset === true && (
          <Text style={styles.underlineText}>or</Text>
        )}

        <InputText
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => this.onChangeText("email", text)}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <InputText
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => this.onChangeText("password", text)}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <Text style={styles.warningText}>{warningText}</Text>
        <NormalButton
          disabled={this.state.disabledBt}
          label="Login"
          onPress={this.onLogin}
          buttonStyle={styles.loginBtnContainer}
        />
        {this.state.fromReset === false && (
          <TouchableOpacity style={styles.btnContainer} onPress={this.onSignup}>
            <Text style={styles.underlineText}>Create an account?</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={this.onForgotPass}
        >
          <Text style={styles.underlineText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderBottom = () => {
    return (
      <View style={styles.bottomContainer}>
        <Text style={styles.grayText}>
          {"By signing up or logging in, you agree to our\n"}
          <Text style={styles.underlineText} onPress={this.onTermsAndCond}>
            {"Term & Conditions"}
          </Text>
          {" and "}
          <Text style={styles.underlineText} onPress={this.onPrivacy}>
            {"Privacy Policy"}
          </Text>
          .
        </Text>
      </View>
    );
  };

  render() {
    const { auth } = this.state;
    return (
      <SafeAreaView style={styles.container} forceInset={{ bottom: "always" }}>
        {this.state.loader && <ScreenLoader />}
        <ConfirmationPopup
          isVisible={
            this.state.warningText &&
            this.state.warningText ==
              "The user is blocked. Please verify with the administrator."
              ? true
              : false
          }
          title="Sign in unsuccessful"
          description={this.state.warningText}
          onClose={() => this.setWarning("")}
        />
        <View style={styles.statusContainer} />
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          {this.renderHeader()}
          {this.renderMainContent()}
          {this.renderBottom()}
        </ScrollView>
        {(auth.isFetchingSignIn || auth.isFetchingAuth) && (
          <View style={Utilities.style.activityContainer}>
            <BallIndicator size={30} color={Colors.active} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  ...authSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  loginWithEmail: (param) => dispatch(loginWithEmail(param)),
  loginWithOauth: (params, authID, appleId) =>
    dispatch(loginWithOauth(params, authID, appleId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
