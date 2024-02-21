import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BallIndicator } from "react-native-indicators";
import { InputText, NormalButton } from "#components";
import { connect } from "react-redux";
import Images from "#assets/images";
import { authSelector } from "#modules/Auth/selectors";
import { signUp } from "#modules/Auth/actions";
import { InvalidAlerts } from "#constants";
import { showAlert, checkEmail, checkPass } from "#utils";
import { Colors } from "#themes";
import { Utilities } from "#styles";
import { styles } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      confirmPass: "",
      passwordHint: "",
      passwordConfirmHint: "",
      emailHint: "",
      auth: {},
      dialogVisible: false,
      disabledBt: true,
      warningText: "",
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isFetchingSignUp !== prevState.auth.isFetchingSignUp) {
      return {
        auth: { ...nextProps.auth },
      };
    }
    return null;
  }

  setWarningText = (warningText) => {
    this.setState({ warningText });
  };

  setDisabledButton = (disabledBt) => {
    this.setState({ disabledBt });
  };

  componentDidUpdate(prevProps, prevState) {
    const { auth } = this.state;
    if (auth.failure && auth.failure !== prevState.auth.failure) {
      this.setWarningText(auth.failure);
    } else if (auth.token && auth.token !== prevState.auth.token) {
      this.props.navigation.navigate("ProfileSetup");
    }

    if (
      this.state.firstName.length === 0 ||
      this.state.lastName.length === 0 ||
      this.state.email.length === 0 ||
      this.state.password.length === 0 ||
      this.state.confirmPass.length === 0 ||
      checkPass(this.state.password) === false ||
      checkEmail(this.state.email) === false ||
      this.state.confirmPass !== this.state.password
    ) {
      if (this.state.disabledBt === false) {
        this.setDisabledButton(true);
      }
    } else {
      if (this.state.disabledBt === true) {
        this.setDisabledButton(false);
      }
    }
  }

  validate = () => {
    const { firstName, lastName, email, password, confirmPass } = this.state;
    if (firstName.length === 0) {
      showAlert("Homitag", InvalidAlerts.emptyFirstName);
      return false;
    } else if (lastName.length === 0) {
      showAlert("Homitag", InvalidAlerts.emptyLastName);
      return false;
    } else if (email.length === 0) {
      showAlert("Homitag", InvalidAlerts.emptyEmail);
      return false;
    } else if (password.length === 0) {
      showAlert("Homitag", InvalidAlerts.emptyPassword);
      return false;
    } else if (confirmPass.length === 0) {
      showAlert("Homitag", InvalidAlerts.emptyConfirmPassword);
      return false;
    } else if (confirmPass !== password) {
      showAlert("Homitag", InvalidAlerts.matchPassword);
      return false;
    } else if (!checkPass(password)) {
      showAlert("Homitag", InvalidAlerts.password);
      return false;
    } else if (!checkEmail(email)) {
      showAlert("Homitag", InvalidAlerts.email);
      return false;
    }
    return true;
  };

  onCreate = async () => {
    const { firstName, lastName, email, password } = this.state;
    if (this.validate()) {
      const params = {
        firstName,
        lastName,
        email,
        password,
        onboarding: false,
      };
      this.props.signUp({ params });
      try {
        await AsyncStorage.setItem("@is_add_address", JSON.stringify(false));
      } catch (error) {
        console.log({ error });
      }
    }
  };

  onChangeText = (stateName, value) => {
    this.setWarningText("");
    switch (stateName) {
      case "email":
        if (value !== "") {
          if (!checkEmail(value)) {
            this.setState({ emailHint: "Must be a valid email" });
          } else {
            this.setState({ emailHint: "" });
          }
        } else {
          this.setState({ emailHint: "" });
        }
        break;
      case "password":
        if (value !== "") {
          if (!checkPass(value)) {
            this.setState({
              passwordHint:
                "Password must contain at least seven digits, one uppercase letter, one number and one special character",
            });
          } else {
            this.setState({ passwordHint: "" });
          }
        } else {
          this.setState({ passwordHint: "" });
        }
        break;
      case "confirmPass":
        if (value !== "") {
          if (value !== this.state.password) {
            this.setState({ passwordConfirmHint: "Passwords must match" });
          } else {
            this.setState({ passwordConfirmHint: "" });
          }
        } else {
          this.setState({ passwordConfirmHint: "" });
        }
        break;
    }
    this.setState({ [stateName]: value });
  };

  onTermsAndCond = () => this.props.navigation.navigate("TermsAndConditionScreen");

  onPrivacy = () => this.props.navigation.navigate("Privacy");

  onLogin = () => this.props.navigation.navigate("SignIn");

  onHelp = () => this.props.navigation.navigate("HelpFeedback",{isAuth: true});

  goBack = () => this.props.navigation.goBack();

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

  renderMainContent = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPass,
      passwordHint,
      passwordConfirmHint,
      emailHint,
      warningText,
    } = this.state;
    return (
      <View style={styles.mainContentContainer}>
        <Text style={styles.titleText}>Create an account</Text>
        <InputText
          style={styles.input}
          placeholder="First Name"
          autoCapitalize="words"
          value={firstName}
          onChangeText={(text) => this.onChangeText("firstName", text)}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          returnKeyType="done"
        />
        <InputText
          style={styles.input}
          placeholder="Last Name"
          autoCapitalize="words"
          value={lastName}
          onChangeText={(text) => this.onChangeText("lastName", text)}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          returnKeyType="done"
        />
        <InputText
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => this.onChangeText("email", text)}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          returnKeyType="done"
        />
        {emailHint !== "" && (
          <Text style={styles.hintText}>{emailHint.toUpperCase()}</Text>
        )}
        <InputText
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => this.onChangeText("password", text)}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          returnKeyType="done"
        />
        {passwordHint !== "" && (
          <Text style={styles.hintText}>{passwordHint.toUpperCase()}</Text>
        )}
        <InputText
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPass}
          onChangeText={(text) => this.onChangeText("confirmPass", text)}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          returnKeyType="done"
        />
        {passwordConfirmHint !== "" && (
          <Text style={styles.hintText}>
            {passwordConfirmHint.toUpperCase()}
          </Text>
        )}
        {warningText !== "" && (
          <Text style={styles.warningText}>{warningText}</Text>
        )}
        <NormalButton
          disabled={this.state.disabledBt}
          label="Create an account"
          onPress={this.onCreate}
          buttonStyle={styles.button}
        />
        <TouchableOpacity style={styles.btnContainer} onPress={this.onLogin}>
          <Text style={styles.underlineText}>Trying to login?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnContainer} onPress={this.onHelp}>
          <Text style={styles.underlineText}>Need Help?</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderBottom = () => {
    return (
      <View style={styles.bottomContainer}>
        <Text style={styles.grayText} numberOfLines={2}>
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
        <View style={styles.statusContainer} />
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {this.renderHeader()}
          {this.renderMainContent()}
          {this.renderBottom()}
        </KeyboardAwareScrollView>
        {auth.isFetchingSignUp && (
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
  signUp: (param) => dispatch(signUp(param)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
