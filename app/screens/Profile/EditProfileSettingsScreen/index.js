import React, { useEffect, useState, useCallback, useRef } from "react";

import {
  View,
  Platform,
  SafeAreaView,
  Alert,
  Linking,
  AppState,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import { BallIndicator } from "react-native-indicators";
import _ from "lodash";
import moment from "moment";
import { Utilities } from "#styles";
import { userSelector } from "#modules/User/selectors";
import {
  updateProfile,
  clearUpdateProfileStatus,
  getUserInfo,
} from "#modules/User/actions";
import { Colors } from "#themes";
import { styles } from "./styles";
import { MainContent } from "./MainConent";
import { BirthDatePicker } from "../../Auth/ProfileSetupScreen/BirthDatePicker";
import { SweetAlert, FooterAction } from "#components";
import usePrevious from "#utils/usePrevious";
import { uploadPhoto } from "#services/api";
import { PERMISSIONS, request } from "react-native-permissions";
import { useFocusEffect } from "@react-navigation/native";
import { LocationPermissionModal } from "#components/LocationPermissionModal";

const EditProfileSettingsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(userSelector);
  const { information } = user;
  const prevInformation = usePrevious(information);
  const [userPhoto, setUserPhoto] = useState(
    _.get(user.information, "profilepictureurl", null)
  );
  const [firstName, setFirstName] = useState(information?.firstName ?? "");
  const [lastName, setLastName] = useState(information?.lastName ?? "");
  const [email, setEmail] = useState(information?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    information?.phonenumber ?? ""
  );
  const [errFirstName, setErrFirstName] = useState("");
  const [errLastName, setErrLastName] = useState("");
  const [errForm, setErrForm] = useState("");
  const [location, setLocation] = useState(information?.location ?? "");
  const [birthDate, setBirthdate] = useState(information?.birthdate ?? "");
  const [isShowDatePicker, setShowDatePicker] = useState(false);
  const [isLocationVisible, setLocationVisible] = useState(false);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      setLocationVisible(false);
    }

    appState.current = nextAppState;
    console.log("AppState", appState.current);
  };

  const [alertStatus, setAlertStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });

  const onAlertModalTouchOutside = () => {
    setAlertStatus({
      title: "",
      visible: false,
      message: "",
      type: "",
    });
    dispatch(clearUpdateProfileStatus());
    dispatch(getUserInfo({ userId: information.id }));
    navigation.goBack();
  };

  let tempDate = null;

  useEffect(() => {
    if (information.success && !prevInformation?.success) {
      setAlertStatus({
        title: "Success",
        visible: true,
        message: "You have updated profile successfully",
        type: "success",
      });
    }
  }, [information, prevInformation]);

  useEffect(() => {
    if (information && information.id) {
      dispatch(getUserInfo({ userId: information.id }));
    }
  }, [information.id]);

  useEffect(() => {
    if (information.failure && !prevInformation?.failure) {
      setErrForm(information.failure);
    }
  }, [information.failure, prevInformation]);

  const onChangeText = (id, text) => {
    if (id === 0) {
      setFirstName(text);
    } else if (id === 1) {
      setEmail(text);
    } else if (id === 2) {
      setPhoneNumber(text);
    } else if (id === 3) {
      setLocation(text);
    } else if (id === 4) {
      setBirthdate(text);
    } else if (id === 5) {
      setLastName(text);
    }
  };

  const openCamera = () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      })
    ).then(async (result) => {
      if (result === "granted") {
        openCameraView();
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

  const openCameraView = () =>
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
    })
      .then(async (image) => {
        setUserPhoto(image.path);
        await uploadPhoto(image.data, user?.information?.id, {
          email: user?.information?.email,
        });
      })
      .catch((e) => {
        console.log("-=-=-=-", e);
      });

  const onChangeDate = (event, date) => {
    if (!date) {
      setShowDatePicker(false);
      return;
    }
    setBirthdate(moment(date).format("YYYY-MM-DD"));
    setShowDatePicker(false);
  };

  const onConfirmPicker = (date) => {
    setShowDatePicker(false);
    setBirthdate(moment(date).format("YYYY-MM-DD"));
  };

  const validateForm = () => {
    let valid = true;
    if (!firstName) {
      valid = false;
      setErrFirstName("First name is not allowed to be empty");
    } else {
      setErrFirstName("");
    }

    if (!lastName) {
      valid = false;
      setErrLastName("Last name is not allowed to be empty");
    } else {
      setErrLastName("");
    }

    return valid;
  };

  const onSave = () => {
    setErrForm("");
    if (!validateForm()) {
      return;
    }

    let body = {
      userId: user.information.id,
    };

    // if (userPhoto !== _.get(user.information, 'profilepictureurl', null)) {
    //   body.userPhoto = userPhoto;
    // }
    if (firstName !== "") {
      body.firstName = firstName;
    }
    if (lastName !== "") {
      body.lastName = lastName;
    }
    if (phoneNumber !== "") {
      body.phonenumber = phoneNumber;
    }

    if (typeof location === "object") {
      body.location = location;
    }

    if (birthDate !== "") {
      body.birthdate = birthDate;
    }

    if (email !== "") {
      body.email = email;
    }
    dispatch(updateProfile(body));
  };

  const fetchUserInfo = useCallback(
    () => dispatch(getUserInfo({ userId: information.id })),
    [dispatch, information.id]
  );

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [fetchUserInfo])
  );

  const isUpdated =
    (firstName !== information?.firstName ?? "") ||
    lastName !== (information?.lastName ?? "") ||
    location !== (information?.location ?? "") ||
    birthDate !== (information?.birthdate ?? "") ||
    _.get(user.information, "profilepictureurl", null) !== userPhoto;

  return (
    <>
      <SafeAreaView style={styles.container} forceInset={{ bottom: "never" }}>
        <MainContent
          originalInfo={user.information}
          onChangeText={onChangeText}
          firstName={firstName}
          userPhoto={userPhoto}
          location={location}
          birthdate={birthDate}
          onSetPhoto={openCamera}
          setShowDatePicker={setShowDatePicker}
          errFirstName={errFirstName}
          errLastName={errLastName}
          lastName={lastName}
          errForm={errForm}
          setLocationVisible={setLocationVisible}
        />

        <FooterAction
          mainButtonProperties={{
            label: "Save",
            onPress: () => onSave(),
            disabled: !isUpdated,
            mainButtonStyle: !isUpdated ? {} : styles.mainButtonStyle,
          }}
        />

        {isShowDatePicker && (
          <BirthDatePicker
            isShowDatePicker={isShowDatePicker}
            value={
              birthDate ? new Date(birthDate) : new Date(moment(new Date()))
            }
            onChangeDate={onChangeDate}
            onCancel={() => setShowDatePicker(false)}
            onConfirm={onConfirmPicker}
          />
        )}
        {user.information.isFetching && (
          <View style={Utilities.style.activityContainer1}>
            <BallIndicator size={30} color={Colors.active} />
          </View>
        )}

        <SweetAlert
          title={alertStatus.title}
          message={alertStatus.message}
          type={alertStatus.type}
          dialogVisible={alertStatus.visible}
          onTouchOutside={onAlertModalTouchOutside}
          iconWidth={120}
        />
        {isLocationVisible && (
          <LocationPermissionModal isModalVisible={isLocationVisible} />
        )}
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default EditProfileSettingsScreen;
