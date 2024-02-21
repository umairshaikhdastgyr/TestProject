import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  Platform,
  Linking,
} from "react-native";
import StarRating from "react-native-star-rating";
import ImagePicker from "react-native-image-crop-picker";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "#modules/User/selectors";
import SmallLoader from "#components/Loader/SmallLoader";

import { Icon } from "#components";
import Icons from "#assets/icons";

import { getAccountBalance, getUserInfo } from "../../../modules/User/actions";
import { Colors } from "#themes";
import { styles } from "./styles";
import { uploadPhoto } from "#services/api";
import icons from "#assets/icons";
import { getMapObjectFromGoogleObj } from "#utils";
import { currencyFormatter } from "#utils";
import { PERMISSIONS, request } from "react-native-permissions";
import { useFocusEffect } from "@react-navigation/native";

const UserInfos = [
  { name: "Followers" },
  { name: "Balance" },
  { name: "Following" },
];

const VerifiedIcons = [
  { type: "id", active: "id_blue", inactive: "id_grey" },
  { type: "email", active: "envelope_active", inactive: "envelope_grey" },
  { type: "phone", active: "mobile_active", inactive: "mobile_grey" },
  { type: "cards", active: "credit-card_active", inactive: "credit-card_grey" },
  { type: "facebook", active: "facebook_blue", inactive: "facebook_grey" },
];

export const UserInfo = ({ navigation }) => {
  const { user } = useSelector(userSelector);
  const [formattedLocation, setFormattedLocation] = useState("");

  const defaultProfileImage = _.get(
    user.information,
    "profilepictureurl",
    null
  );

  const name = _.get(user.information, "name", "");
  const location = _.get(user.information, "location", null);
  const rating = parseFloat(_.get(user.information, "rating", 0));
  const reviews = _.get(user.information, "reviews", 0);
  const followersCount = _.get(user.information, "followersCount", 0);
  const followingCount = _.get(user.information, "followingCount", 0);

  useEffect(() => {
    if (!location) {
      return;
    }

    const findLocation = getMapObjectFromGoogleObj(location);

    const city = findLocation?.city ?? "";
    const state = findLocation?.state ?? "";

    const currentLocationText = `${city} ${city ? "," : ""} ${state}`;

    setFormattedLocation(currentLocationText);
  }, [location]);

  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(defaultProfileImage);

  const {
    information: { id },
    accountBalanceState,
  } = user;

  useEffect(() => {
    dispatch(getAccountBalance({ userId: id }));
  }, [dispatch, id]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserInfo({ userId: id }));
    }, [dispatch, id])
  );

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
        setProfileImage(image.path);
        const uploadResponse = await uploadPhoto(
          image.data,
          user?.information?.id,
          { email: user?.information?.email }
        );
        dispatch(getUserInfo({ userId: user?.information?.id }));
      })
      .catch((e) => {
        console.log("-=-=-=-", e);
      });

  const onReview = () => {
    navigation.navigate("Review", {
      id: user.information.id,
      reviews,
      rating,
      name: "My Review's",
    });
  };

  const onPress = (index) => {
    switch (index) {
      case 0:
        navigation.navigate("Followers", {
          title: `Followers(${_.get(user.information, "followersCount", 0)})`,
          id: user.information.id,
        });
        break;
      case 1:
        navigation.navigate("PaymentManagement");
        break;
      case 2:
        navigation.navigate("Following", {
          title: `Following(${_.get(user.information, "followingCount", 0)})`,
          id: user.information.id,
        });
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.infoContainer}>
      <View style={styles.userPhotoContainer}>
        {!profileImage && (
          <>
            <View style={styles.subPhotoContainer}>
              <Image
                source={Icons["in-person_grey"]}
                style={styles.userPhotoTempImg}
              />
            </View>
            <TouchableOpacity onPress={openCamera} style={styles.addImg}>
              <Image source={icons.add_in_background} style={styles.addImg} />
            </TouchableOpacity>
          </>
        )}
        {profileImage && (
          <>
            <Image source={{ uri: profileImage }} style={styles.userPhotoImg} />
            <TouchableOpacity onPress={openCamera} style={styles.addImg}>
              <Image source={Icons.edit_in_background} style={styles.addImg} />
            </TouchableOpacity>
          </>
        )}
      </View>
      <Text style={styles.titleText}>{name}</Text>
      {location && <Text style={styles.greyText}>{formattedLocation}</Text>}
      {reviews > 0 ? (
        <TouchableOpacity style={styles.starContainer} onPress={onReview}>
          <StarRating
            iconSet={"Ionicons"}
            maxStars={5}
            rating={rating}
            fullStarColor={Colors.active}
            disabled
            starSize={20}
            fullStar={Icons.star_active}
            emptyStar={Icons.star_grey}
            halfStar={Icons["half-star"]}
          />
          <Text style={styles.graySmallText}>{`(${reviews})`}</Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.userProductContainer}>
        {!accountBalanceState.isFetching && (
          <>
            {UserInfos.map((infoItem, index) => (
              <TouchableOpacity
                style={styles.itemContainer}
                key={`key-${index}`}
                onPress={() => onPress(index)}
              >
                <Text style={styles.activeBoldText}>
                  {index === 0 && followersCount}
                  {index === 2 && followingCount}
                  {index === 1 &&
                    (accountBalanceState.data
                      ? currencyFormatter.format(
                          accountBalanceState?.data?.instant_available[0]
                            .amount /
                            100 +
                            parseFloat(accountBalanceState?.data?.localBalance)
                        )
                      : 0)}
                </Text>
                <Text style={styles.greyText}>{infoItem.name}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {accountBalanceState.isFetching && <SmallLoader style={{ flex: 1 }} />}
      </View>
      <View style={styles.separator} />
      <View style={styles.verifyStatusContainer}>
        <Text style={styles.blackText}>{"Verified with:"}</Text>
        {VerifiedIcons.map((iconItem) => {
          let isValidated = false;
          let route = "";
          switch (iconItem.type) {
            case "id":
              isValidated = Boolean(user?.information?.idvalidated);
              route = "IDVerification";
              break;
            case "email":
              isValidated = Boolean(user?.information?.emailvalidated);
              route = "EditPersonalInfo";
              break;
            case "phone":
              isValidated = Boolean(user?.information?.phonenumbervalidated);
              route = "EditPersonalInfo";
              break;
            case "facebook":
              isValidated = Boolean(user?.information?.allowFacebookShare);
              route = "SocialMedia";
              break;
            case "cards":
              isValidated = Boolean(user?.information?.validCards);
              route = "PaymentCard";
              break;
          }

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(route, { isFromProfileDashboard: true })
              }
              key={`${iconItem.active} - ${iconItem.inactive}`}
            >
              <Icon
                icon={isValidated ? iconItem.active : iconItem.inactive}
                style={styles.verifyIcon}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
