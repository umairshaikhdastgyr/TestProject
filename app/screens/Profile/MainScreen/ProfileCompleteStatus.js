import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { BallIndicator } from "react-native-indicators";
import _ from "lodash";
import Images from "#assets/images";
import { NormalButton } from "#components";
import { Metrics, Colors } from "#themes";
import { Utilities } from "#styles";
import { styles } from "./styles";
import { getMapObjectFromGoogleObj } from "#utils";
import fonts from "#themes/fonts";
import { checkIfFirstOrderPosted } from "#services/apiOrders";
import { getPaymentMethods } from "#services/apiUsers";

export const ProfileCompleteStatus = ({
  percent,
  onPress,
  info,
  paymentCardList,
}) => {
  const profileImg = _.get(info, "profilepictureurl", null);
  const [formattedLocation, setFormattedLocation] = useState("");
  const [chargeDepositMethodPopup, setChargeDepositMethodPopup] =
    useState(false);

  useEffect(() => {
    if (!info.location) {
      return;
    }

    const findLocation = getMapObjectFromGoogleObj(info.location);

    const city = findLocation?.city ?? "";
    const state = findLocation?.state ?? "";

    const currentLocationText = `${city} ${city ? "," : ""} ${state}`;

    setFormattedLocation(currentLocationText);
  }, [info.location]);

  const checkFirstOrder = async () => {
    const paymentCardResp = await getPaymentMethods({
      userId: info.id,
      type: "card",
    });
    if (!paymentCardResp?.data?.length && info.id) {
      const resp = await checkIfFirstOrderPosted(info.id);
      if (resp?.sold) {
        setChargeDepositMethodPopup(true);
      }
    } else {
      setChargeDepositMethodPopup(false);
    }
  };
  useEffect(() => {
    checkFirstOrder();
  }, []);

  useEffect(() => {
    checkFirstOrder();
  }, [paymentCardList]);

  return (
    <View style={styles.profileInfoContainer}>
      {!info.isFetching && (
        <>
          {/* {chargeDepositMethodPopup? <Text style={styles.accountDeactivatedText}>
        Please add charge method or contact homitag seller support!.
            </Text>:null} */}
          {info?.status == "deactivated" ? (
            <Text style={styles.accountDeactivatedText}>
              Please repay your negative balance and add charge method to reactivate your account.
            </Text>
          ) : null}
          <View style={styles.profileHeaderContainer}>
            {profileImg && (
              <Image source={{ uri: profileImg }} style={styles.avatarImg} />
            )}
            {!profileImg && (
              <Image source={Images.userPlaceholder} style={styles.avatarImg} />
            )}
            <View style={styles.profileSubHeaderContainer}>
              <Text
                style={[styles.blackBoldText, { fontSize: 15 }]}
                numberOfLines={2}
              >
                {info.name ?? ""}
              </Text>
              <Text
                style={[styles.graySmallText, { fontSize: 11 }]}
                numberOfLines={1}
              >
                {formattedLocation}
              </Text>
            </View>
          </View>
          <Text style={[styles.blackSmallText]}>
            {`Your profile is ${percent}% completed.`}
          </Text>
          <View style={styles.profileCompleteContainer}>
            <View style={styles.profileBarInactive} />
            <View
              style={[
                styles.profileBarActive,
                { width: ((Metrics.width - 100) / 100) * percent },
              ]}
            />
            <Text
              style={[
                styles.completePercentText,
                { left: ((Metrics.width - 100) / 100) * percent - 14 },
              ]}
            >
              {`${percent}%`}
            </Text>
          </View>
          <NormalButton
            label="Complete Profile"
            buttonStyle={styles.profileCompleteBtn}
            onPress={onPress}
          />
        </>
      )}
      {info.isFetching && (
        <View style={Utilities.style.activityContainer1}>
          <BallIndicator size={30} color={Colors.active} />
        </View>
      )}
    </View>
  );
};
