import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  SafeAreaView,
  AppState,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { connect } from "react-redux";
import moment from "moment";
import { BallIndicator } from "react-native-indicators";
import { Header, NormalButton } from "#components";
import { authSelector } from "#modules/Auth/selectors";
import {
  profileSetup,
  requestCode,
  requestPhoneCode,
} from "#modules/Auth/actions";
import { userSelector } from "#modules/User/selectors";
import Icons from "#assets/icons";
import { Colors } from "#themes";
import { Utilities } from "#styles";
import { styles } from "./styles";
import { BirthdayInput, LocationInput } from "./Inputs";
import { LocationModal } from "./LocationModal";
import { BirthDatePicker } from "./BirthDatePicker";
import Geolocation from "react-native-geolocation-service";
import { uploadPhoto } from "#services/api";
import { Fonts } from "#themes";
import { PERMISSIONS, request, check, RESULTS } from "react-native-permissions";
import { LocationPermissionModal } from "#components/LocationPermissionModal";

class ProfileSetupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phonenumber: "",
      phone: "",
      birthdate: null,
      userPhoto: null,
      modalVisible: false,
      location: null,
      isEnabled: false,
      auth: {},
      isShowDatePicker: false,
      dialogVisible: false,
      message: "",
      phoneRef: null,
      isLocationVisible: false,
      appState: AppState.currentState,
    };
    this.tempDate = null;
    this.ActionSheet = null;
  }

  componentDidMount() {
    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization("whenInUse");
    }
  }

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.setState({ isLocationVisible: false });
    }
    this.setState({ appState: nextAppState });
  };

  handleLocation = () => {
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      })
    ).then((permissionResult) => {
      if (permissionResult !== RESULTS.GRANTED) {
        this.setState({ isLocationVisible: true });
      }

      if (permissionResult === RESULTS.GRANTED) {
        this.setState({ isLocationVisible: false });
        this.setModalVisible(true);
      }
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const { auth } = this.props;

    if (this.props.navigation.isFocused() === true) {
      if (auth?.failure !== prevProps.auth.failure) {
        this.setMessage(auth.failure);
      } else if (
        !auth.isFetchingProfile &&
        auth.isFetchingProfile !== prevProps.auth.isFetchingProfile
      ) {
        this.onSendPhone();
      } else if (
        auth.isFetchingVerify === 0 &&
        prevProps.auth.isFetchingVerify !== 0 &&
        !auth.failure
      ) {
        this.props.navigation.navigate("VerificationPhone", {
          phoneNumberString: this.state.phonenumber,
        });
      }
    }
  }

  setMessage = (message) => {
    this.setState({ message });
  };

  onModalTouchOutside = () => {
    this.setState({ dialogVisible: false });
  };

  onNext = () => {
    //const param = { email: this.props.user.information.email };
    //this.props.requestCode(param, this.props.user.information.id, 'email');
  };

  onSendPhone = () => {
    const param = { phonenumber: this.state.phonenumber };
    //this.setSendTo('phonenumber');
    this.props.requestPhoneCode(
      param,
      this.props.user.information.id,
      "phonenumber"
    );
  };

  onSkip = async () => {
    //this.onNext();
    const user = this.props.user;

    console.log(user.phonenumber);

    if (user.phonenumber == null) {
      this.props.navigation.navigate("Verification", { type: "skip" });
      this.onNext();
    } else {
      this.props.navigation.navigate("VerificationPhone");
      //this.onNext();
    }
  };

  setPhoneRef = (ref) => {
    this.setState({ phoneRef: ref });
  };

  openCamera = () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      })
    ).then(async (result) => {
      if (result === "granted") {
        this.openCameraView();
        return;
      } else {
        Alert.alert(
          "Permission Denied",
          "You must allow the app for using camera.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Go to Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    });
  };

  openCameraView = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
    })
      .then(async (image) => {
        this.setState({ userPhoto: image.path }, this.validate);
        await uploadPhoto(image.data, this.props.user.information.id, {
          email: this.props?.user?.information?.email,
        });
      })
      .catch((e) => {
        console.log("-=-=-=-", e);
      });
  };

  setLocation = (location) => {
    this.setState(
      { location, formattedLocation: location?.formatted_address },
      this.validate
    );
    this.setModalVisible(false);
  };

  onChangeText = (stateName, value) => {
    this.setState({ [stateName]: value }, this.validate);
  };

  onChangeDate = (event, date) => {
    if (Platform.OS === "ios") {
      this.tempDate = date;
    } else {
      this.setState(
        {
          birthdate: moment(new Date(date)).format("YYYY-MM-DD"),
          isShowDatePicker: false,
        },
        this.validate
      );
    }
  };

  onDismissPicker = () => {
    this.setState({ isShowDatePicker: false });
    this.tempDate = this.state.birthdate
      ? new Date(this.state.birthdate)
      : null;
  };

  onConfirmPicker = () => {
    this.setState(
      {
        isShowDatePicker: false,
        birthdate: this.tempDate
          ? moment(this.tempDate).format("YYYY-MM-DD")
          : moment(new Date()).format("YYYY-MM-DD"),
      },
      this.validate
    );
  };

  onShowDatePicker = () => {
    this.setState({ isShowDatePicker: true });
  };

  onShowGoogleLocation = () => {
    this.setModalVisible(true);
  };

  onSend = () => {
    this.onContinueImage();
    this.onContinue();
  };

  onContinueImage = () => {
    const { userPhoto, location, birthdate, phonenumber } = this.state;
    const data = new FormData();
    const body = {
      profilePicture: userPhoto ? userPhoto : undefined,
    };
    data.append({ profilePicture: userPhoto ? userPhoto : undefined });

    const userprofileData = {
      data,
      userId: this.props.user.information.id,
    };
    this.props.profileSetup(userprofileData);
  };

  onContinue = () => {
    const { userPhoto, location, birthdate, phonenumber } = this.state;

    const body = {
      //profilePicture: userPhoto ? userPhoto : undefined,
      params: {
        location,
        birthdate: birthdate,
        phonenumber,
        userId: this.props.user.information.id,
        email: this.props.user.information.email,
      },
    };
    const userprofileData = {
      body: body,
      userId: this.props.user.information.id,
    };
    this.props.profileSetup(userprofileData);
  };

  // phone =>
  // phoneNumber =>

  formatPhone = (phoneNumberString) => {
    this.setState({
      phonenumber: "+1" + phoneNumberString,
    });
    this.setState({ phoneRef: "+1" + phoneNumberString });
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
      phone: newText,
    });
    if (newText.length == 14) {
      this.setState({ isEnabled: true });
    } else {
      this.setState({ isEnabled: false });
    }
    //setPhone("+1 "+newText)
  };

  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  };

  validatePhone = (value) => {
    if (value) {
      this.onChangeText("phonenumber", value);
    } else {
      this.onChangeText("phonenumber", "+1");
    }
  };

  validate = () => {
    const { userPhoto, phoneRef, location, birthdate } = this.state;

    // if (phoneRef.length==7 && location ) {
    //   this.setState({ isEnabled: true });
    // } else {
    //   this.setState({ isEnabled: false });
    // }
  };

  renderHeaderRight = () => (
    <View style={styles.headerRightContainer}>
      <Text style={styles.activeText}>SKIP</Text>
      <Image source={Icons.icon_active_next} style={styles.headerIcon} />
    </View>
  );

  renderUserPhoto = () => {
    const { userPhoto } = this.state;
    return (
      <View style={styles.userPhotoContainer}>
        {!userPhoto && (
          <View style={styles.subPhotoContainer}>
            <Image
              source={Icons["in-person_grey"]}
              style={styles.userPhotoTempImg}
            />
          </View>
        )}
        {userPhoto && (
          <Image source={{ uri: userPhoto }} style={styles.userPhotoImg} />
        )}
        <TouchableOpacity onPress={this.openCamera} style={styles.addImg}>
          {!userPhoto && (
            <Image source={Icons.add_in_background} style={styles.addImg} />
          )}
          {userPhoto && (
            <Image source={Icons.edit_in_background} style={styles.addImg} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  renderPhoneNumber = () => {
    const { phonenumber } = this.state;
    return (
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          height: 42,
          justifyContent: "flex-end",
          borderBottomColor: "black",
          width: "90%",
          alignSelf: "center",
          borderBottomColor: "#eee",
          marginTop: 30,
        }}
      >
        <View
          style={{
            width: "10%",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../../assets/icons/usFlagIcon.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
          />
        </View>
        <View
          style={{
            width: "10%",
            alignItems: "center",
            justifyContent: "center",
            marginTop: Platform.OS === "ios" ? 2 : 0,
          }}
        >
          <Text style={{ fontFamily: Fonts.family.bold }}>+1</Text>
        </View>
        <View
          style={{ width: "80%", marginTop: Platform.OS === "ios" ? 12 : 0 }}
        >
          <TextInput
            placeholder="(###) ###-####"
            maxLength={14}
            style={{
              width: "100%",
              textAlign: "left",
              fontFamily: Fonts.family.bold,
            }}
            keyboardType="phone-pad"
            value={this.state.phone}
            onChangeText={(number) => {
              this.formatPhone(number);
            }}
          />
        </View>
      </View>
      // <PhoneNumberInput
      //   value={phonenumber}
      //   setPhoneRef={this.setPhoneRef}
      //   onChangeText={value => this.validatePhone(value)}
      // />
    );
  };

  renderLocation = () => (
    <LocationInput
      onPress={this.handleLocation}
      value={this.state?.formattedLocation}
    />
  );

  renderBirthDayInput = () => {
    const { birthdate } = this.state;
    return (
      <BirthdayInput
        value={birthdate}
        onShowDatePicker={this.onShowDatePicker}
      />
    );
  };

  renderBottomButton = () => {
    const { isEnabled } = this.state;
    return (
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={styles.bottomButtonContainer}>
          <NormalButton
            label="Continue"
            onPress={this.onContinue}
            buttonStyle={
              isEnabled && this.state?.location != null
                ? styles.activeBtn
                : styles.inactiveBtn
            }
            disabled={!isEnabled || this.state?.formattedLocation == null}
          />
        </View>
      </View>
    );
  };

  render() {
    const { modalVisible, isShowDatePicker, birthdate, message } = this.state;
    const { auth } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Header
            containerStyle={styles.headerContainer}
            rightComponent={this.renderHeaderRight()}
            onRightPress={this.onSkip}
            hasShadow
            title="Profile Setup"
          />
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.container}>
            {this.renderUserPhoto()}
            {this.renderPhoneNumber()}
            {this.renderLocation()}
            {/* {this.renderBirthDayInput()} */}
          </View>
        </ScrollView>
        {modalVisible && (
          <LocationModal
            modalVisible={modalVisible}
            setVisible={this.setModalVisible}
            setLocation={this.setLocation}
          />
        )}
        <Text style={styles.warningText}>{message}</Text>
        <View style={styles.bottomContainer}>{this.renderBottomButton()}</View>
        {(auth.isFetchingProfile || auth.isFetchingVerify !== 0) && (
          <View style={Utilities.style.activityContainer}>
            <BallIndicator size={30} color={Colors.active} />
          </View>
        )}
        {isShowDatePicker && (
          <BirthDatePicker
            isShowDatePicker={isShowDatePicker}
            value={birthdate ? new Date(birthdate) : null}
            onChangeDate={this.onChangeDate}
            onCancel={this.onDismissPicker}
            onConfirm={this.onConfirmPicker}
          />
        )}
        {this.state.isLocationVisible && (
          <LocationPermissionModal
            isModalVisible={this.state.isLocationVisible}
          />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  ...authSelector(state),
  ...userSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  profileSetup: (param) => dispatch(profileSetup(param)),
  requestCode: (param, userID, verificationType) =>
    dispatch(requestCode(param, userID, verificationType)),
  requestPhoneCode: (param, userID, verificationType) =>
    dispatch(requestPhoneCode(param, userID, verificationType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSetupScreen);
