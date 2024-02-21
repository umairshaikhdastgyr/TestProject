import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import { connect } from "react-redux";
import { BallIndicator } from "react-native-indicators";
import Images from "#assets/images";
import { authSelector } from "#modules/Auth/selectors";
import { loginWithToken, loginWithOauth } from "#modules/Auth/actions";
import { NormalButton, SweetAlert } from "#components";
import { LocalStorage } from "#services";
import { FacebookAuth, GoogleAuth } from "#services";
import { Utilities } from "#styles";
import { styles } from "./styles";
import { Colors, Metrics } from "#themes";
import { FacebookButton, GoogleButton } from "./Buttons";
import {
  AppleButton,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import firestore from "@react-native-firebase/firestore";

import { useSelector } from "react-redux";
import { selectUserData, userSelector } from "#modules/User/selectors";
import { saveAppleDataToFirebase } from "#utils";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { reactiveUserAccount } from "#services/apiUsers";
import { setToken } from "#services/httpclient/clientHelper";

class MainAuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGuest: false,
      alertTitle: "",
      alertMsg: "",
      alertType: "",
      dialogVisible: false,
      email: "",
      loader: false,
      isGoogle: false,
      isFacebook: false,
      isApple: false,
    };
  }

  onModalTouchOutside = () => {
    this.setState({ dialogVisible: false });
  };

  componentDidMount() {
    this.onInitial();
    if (this.props.route?.params?.isGuest) {
      this.setState({ isGuest: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.auth.isFetchingAuth &&
      prevProps.auth.isFetchingAuth &&
      this.props.auth.token &&
      !prevProps.auth.token
    ) {
      this.onCheck();
      //this.props.navigation.navigate('App');
    }
    if (
      this.props.auth.failure &&
      this.props.auth.failure !== prevProps.auth.failure
    ) {
      if (
        (this.props.auth.failure == "Your account is deleted!" ||
          this.props.auth.failure == "User is deleted!") &&
        (this.state.isGoogle || this.state.isFacebook || this.state.isApple)
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
      } else {
        this.showSweetAlert("Oops...", this.props.auth.failure, "error");
      }
    }
  }

  onReactivateAccount = async () => {
    const { email } = this.state;
    const params = { email };
    this.setState({ loader: true });
    try {
      const response = await reactiveUserAccount(params);
      if (response?.status == 200) {
        if (this.state.isGoogle) {
          this.onContinueGoogle();
        }
        if (this.state.isFacebook) {
          this.onContinueFB();
        }
        if (this.state.isApple) {
          this.onAppleSignin();
        }
        this.setState({ loader: false });
      } else {
        this.setState({ loader: false });
      }
    } catch (error) {
      this.setState({ loader: false });
    }
  };

  onCheck = async () => {
    //temp bypass
    // this.props.navigation.navigate('App');
    // return;

    const user = this.props.user.information;
    if (
      user.emailvalidated == true ||
      user.phonenumbervalidated == true ||
      user.googleaccount != null ||
      user.facebookaccount != null ||
      user.appleaccount != null
    ) {
      this.props.navigation.navigate("App");
      //alert('Done')
    } else {
      this.props.navigation.navigate("ProfileSetup");
      //alert('Not Done')
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

  onInitial = async () => {
    const user = await LocalStorage.getUserInformation();
    const tokens = await LocalStorage.getTokens();
    setToken(tokens?.token);
    if (user && tokens) {
      this.props.loginWithToken();
    }
  };

  onContinueGuest = () => {
    this.props.navigation.navigate("AppAuth");
  };

  onContinueFB = async () => {
    try {
      const { user } = await FacebookAuth.login();

      if (user) {
        this.setState({ isFacebook: true });
        this.setState({
          email:
            user?.first_name?.toLowerCase() +
            user?.last_name?.toLowerCase() +
            "@gmail.com",
        });
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
        this.setState({ isGoogle: true });
        this.setState({ email: userInfo?.user?.email });
        this.props.loginWithOauth(userInfo.user, 1);
      }
      console.info("google login", userInfo.user);
    } catch (e) {
      console.info("unable to login", e);
    }
  };

  onLogin = () =>
    this.props.navigation.navigate("SignIn", {
      fromReset: false,
      isLoginEmail:
        this.state.isGoogle || this.state.isFacebook || this.state.isApple,
    });

  onTermsAndCond = () =>
    this.props.navigation.navigate("TermsAndConditionScreen");

  onPrivacy = () => this.props.navigation.navigate("Privacy");

  onSignup = () => this.props.navigation.navigate("Signup");

  onBack = () => this.props.navigation.goBack();

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
            this.setState({ isApple: true });
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
                  this.setState({ email: userData?.email });
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
                this.setState({ email: userData?.email });
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

  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        {this.state.isGuest && (
          <TouchableOpacity
            style={[styles.backBtnContainer1]}
            onPress={this.onBack}
          >
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
        )}
        {!this.state.isGuest && (
          <TouchableOpacity
            style={[styles.backBtnContainer]}
            onPress={this.onContinueGuest}
          >
            <Text style={styles.whiteText}>SKIP</Text>
          </TouchableOpacity>
        )}
        <Image source={Images.logo} style={styles.logoImg} />
      </View>
    );
  };

  renderButtons = () => {
    return (
      <View style={styles.mainContainer}>
        <FacebookButton onPress={this.onContinueFB} />
        <View style={styles.space} />
        <GoogleButton onPress={this.onContinueGoogle} />
        <View style={styles.space} />
        {Platform.OS === "ios" && (
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
              onPress={this.onAppleSignin}
            />
            <View style={styles.space} />
          </>
        )}
        <Text style={styles.underlineText}>or</Text>
        <View style={styles.space} />
        <NormalButton label="Create an account" onPress={this.onSignup} />
        <View style={styles.textBtnContainer}>
          <Text style={styles.grayText}>
            {"Already have an account? "}
            <Text style={styles.underlineText} onPress={this.onLogin}>
              Login
            </Text>
          </Text>
          <View style={styles.bottomSubContainer}>
            <Text style={styles.grayText1}>
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
            {/* <Text style={styles.grayText1}>
              {'Version beta JUNE 10 v2 Vivek'}
            </Text> */}
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { auth } = this.props;
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors.backgroundGrey }]}
        forceInset={{ bottom: "never" }}
      >
        {this.state.loader && <ScreenLoader />}
        {this.renderHeader()}
        {this.renderButtons()}
        {auth.isFetchingAuth && (
          <View style={Utilities.style.activityContainer}>
            <BallIndicator size={30} color={Colors.active} />
          </View>
        )}

        <SweetAlert
          title={this.state.alertTitle}
          message={this.state.alertMsg}
          type={this.state.alertType}
          dialogVisible={this.state.dialogVisible}
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
  loginWithToken: () => dispatch(loginWithToken()),
  loginWithOauth: (params, authID, appleId) =>
    dispatch(loginWithOauth(params, authID, appleId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainAuthScreen);
