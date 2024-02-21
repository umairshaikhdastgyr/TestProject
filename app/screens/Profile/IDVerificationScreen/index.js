import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { Icon, NormalButton } from "#components";
import { userSelector } from "#modules/User/selectors";
import { setUserInformation } from "#modules/User/actions";
import { Colors } from "#themes";
import { uploadIDPhoto } from "#services/apiUsers";
import { IDPhotoView } from "./IDPhotoView";
import { UserPhotoView } from "./UserPhotoView";
import { styles } from "./styles";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { PERMISSIONS, request } from "react-native-permissions";

const IDVerificationScreen = ({ navigation, route }) => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [idPhoto, setIDPhoto] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // 0: ID photo, 1: User Photo, 2: Confirm

  useEffect(() => {
    if (_.get(user, "information.validationPicUrlId", null)) {
      if (_.get(user, "information.validationPicUrlUser", null)) {
        setActiveIndex(2);
      } else {
        setActiveIndex(1);
      }
    }
  }, []);

  const onTakePhoto = () => {
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

  const openCameraView = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
    })
      .then((image) => {
        activeIndex === 0
          ? setIDPhoto({ path: image.path, data: image.data })
          : setUserPhoto({ path: image.path, data: image.data });
      })
      .catch((e) => {
        console.log("-=-=-=-", e);
      });
  };

  const onSelectPhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
      includeBase64: true,
      compressImageQuality: 0.8,
    })
      .then((image) => {
        activeIndex === 0
          ? setIDPhoto({ path: image.path, data: image.data })
          : setUserPhoto({ path: image.path, data: image.data });
      })
      .catch((e) => {
        console.info("e openPicker", e);
      });
  };

  const onContinue = async () => {
    setLoading(true);
    if (activeIndex === 0) {
      const res = await uploadIDPhoto(
        idPhoto.data,
        _.get(user, "information.id", null),
        0
      );

      const errorMsg = _.get(res, "result.content.message", null);
      if (errorMsg) {
        alert(errorMsg);
      } else {
        dispatch(setUserInformation({ information: res }));
        setActiveIndex(1);
      }
      setLoading(false);
    } else if (activeIndex === 1) {
      const res = await uploadIDPhoto(
        userPhoto.data,
        _.get(user, "information.id", null),
        1
      );
      const errorMsg = _.get(res, "result.content.message", null);
      if (errorMsg) {
        alert(errorMsg);
      } else {
        dispatch(setUserInformation({ information: res }));
        setActiveIndex(2);
      }
      setLoading(false);
    } else {
      setLoading(false);
      navigation.goBack();
    }
  };
  let buttonBackgroundColor = !!idPhoto ? Colors.primary : Colors.inactiveShape;
  if (activeIndex === 1) {
    buttonBackgroundColor = !!userPhoto ? Colors.primary : Colors.inactiveShape;
  }
  return (
    <SafeAreaView style={styles.container} forceInset={{ bottom: "never" }}>
      <ScrollView style={styles.scrollConatiner}>
        {activeIndex === 0 && (
          <IDPhotoView
            idPhoto={idPhoto}
            onTakePhoto={onTakePhoto}
            onSelectPhoto={onSelectPhoto}
          />
        )}
        {activeIndex === 1 && (
          <UserPhotoView
            userPhoto={userPhoto}
            onTakePhoto={onTakePhoto}
            onSelectPhoto={onSelectPhoto}
          />
        )}
        {activeIndex === 2 && (
          <Text style={styles.descriptionText}>
            {
              "Your ID verification is running. You’ll receive a notification validating the process in the next few days."
            }
          </Text>
        )}
      </ScrollView>
      {activeIndex !== 2 && (
        <View style={styles.dotsContainer}>
          <View
            style={[
              styles.dot1,
              {
                backgroundColor:
                  activeIndex === 0 ? Colors.active : Colors.inactiveShape,
              },
            ]}
          />
          <View
            style={[
              styles.dot2,
              {
                backgroundColor:
                  activeIndex === 1 ? Colors.active : Colors.inactiveShape,
              },
            ]}
          />
        </View>
      )}
      <View style={styles.bottomBtnContainer}>
        <NormalButton
          label="Continue"
          onPress={onContinue}
          disabled={activeIndex === 0 ? !idPhoto : !userPhoto}
          buttonStyle={{
            backgroundColor: buttonBackgroundColor,
          }}
        />
      </View>

      {loading && <ScreenLoader />}
    </SafeAreaView>
  );
};

export default IDVerificationScreen;
