import React, { useState } from "react";
import { View, TouchableOpacity, Image, Text, Modal } from "react-native";
import StarRating from "react-native-star-rating";
import _ from "lodash";
import * as Progress from "react-native-progress";
import { Icon, NormalButton, CachedImage, Button, Label } from "#components";
import Icons from "#assets/icons";
import Images from "#assets/images";
import { Colors } from "#themes";
import { styles } from "./styles";

import SmallLoader from "#components/Loader/SmallLoader";
import { margins } from "#styles/utilities";
import { MainAuthStackNavigation } from "../../../navigators/MainAuthStackNavigation";

const UserInfos = [{ name: "Followers" }, { name: "Following" }];

const VerifiedIcons = [
  { active: "id_blue", inactive: "id_grey" },
  { active: "envelope_active", inactive: "envelope_grey" },
  { active: "mobile_active", inactive: "mobile_grey" },
  { active: "credit-card_active", inactive: "credit-card_grey" },
  { active: "facebook_blue", inactive: "facebook_grey" },
];

export const UserInfo = ({
  navigation,
  info,
  userInfoData,
  followerData,
  unfollowAction,
  followAction,
  isFollowVisible,
  currentUserId,
}) => {
  const [showModal, setShowModal] = useState(false);
  const userInfo = userInfoData.data;

  const onPress = (index) => {
    switch (index) {
      case 0:
        navigation.push("Followers", {
          title: `Followers(${_.get(userInfo, "followersCount", 0)})`,
          id: userInfo.id,
        });
        break;
      case 1:
        navigation.push("Following", {
          title: `Following(${_.get(userInfo, "followingCount", 0)})`,
          id: userInfo.id,
        });
        break;
      default:
        break;
    }
  };

  const isFollowing = _.get(followerData, "data.isFollowing", "0") !== "0";
  const profileImg = _.get(info, "profilepictureurl", null);
  const firstName = _.get(info, "firstName", "Undefined");
  const lastName = _.get(info, "lastName", "Undefined");
  const rating = parseFloat(_.get(userInfo, "rating", 0));
  const reviews = _.get(userInfo, "reviews", 0);
  const followersCount = _.get(userInfo, "followersCount", 0);
  const followingCount = _.get(userInfo, "followingCount", 0);

  const onReview = () => {
    navigation.navigate("Review", {
      id: userInfo.id,
      reviews,
      rating,
      name: `${firstName} Review's`,
    });
  };

  return (
    <View style={styles.infoContainer}>
      <TouchableOpacity style={styles.userImgContainer}>
        {profileImg && (
          <CachedImage
            source={{ uri: profileImg }}
            style={styles.userImg}
            indicator={Progress.Pie}
            indicatorProps={{
              size: 30,
              borderWidth: 0,
              color: Colors.primary,
              unfilledColor: Colors.white,
            }}
          />
        )}
        {!profileImg && (
          <Image source={Images.userPlaceholder} style={styles.userImg} />
        )}
      </TouchableOpacity>
      <Text style={styles.titleText}>{`${firstName} ${lastName}`}</Text>

      {!followerData.isFetching && !userInfoData.isFetching && (
        <>
          <TouchableOpacity style={styles.starContainer} onPress={onReview}>
            <StarRating
              iconSet="Ionicons"
              maxStars={5}
              rating={rating}
              fullStarColor={Colors.active}
              disabled
              starSize={20}
              fullStar={Icons.star_active}
              emptyStar={Icons.star_grey}
              halfStar={Icons["half-star"]}
            />
            <Text style={styles.graySmallText}>
              {reviews == 0 ? "" : `(${reviews})`}
            </Text>
          </TouchableOpacity>
          <View style={styles.userProductContainer}>
            {UserInfos.map((infoItem, index) => (
              <TouchableOpacity
                style={styles.itemContainer}
                key={`key-${index}`}
                onPress={() => {
                  if (!currentUserId) {
                    setShowModal(true);
                    return;
                  }
                  onPress(index);
                }}
              >
                <Text style={styles.activeBoldText}>
                  {index === 0 && followersCount}
                  {index === 1 && followingCount}
                </Text>
                <Text style={styles.greyText}>{infoItem.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {isFollowVisible &&
            (isFollowing ? (
              <Button
                label="Following"
                style={styles.followBtn}
                theme="secondary"
                size="large"
                onPress={unfollowAction}
              />
            ) : (
              <NormalButton
                label="Follow"
                buttonStyle={styles.followBtn}
                onPress={() => {
                  if (!currentUserId) {
                    setShowModal(true);
                    return;
                  }
                  followAction();
                }}
              />
            ))}
          <View style={styles.verifyStatusContainer}>
            <Text style={styles.blackText}>{"Verified with:"}</Text>
            {VerifiedIcons.map((iconItem, index) => {
              let isValidated = false;
              switch (index) {
                case 0:
                  isValidated = Boolean(userInfo?.idvalidated);
                  break;
                case 1:
                  isValidated = Boolean(userInfo?.emailvalidated);
                  break;
                case 2:
                  isValidated = Boolean(userInfo?.phonenumbervalidated);
                  break;
                case 4:
                  isValidated = Boolean(userInfo?.allowFacebookShare);
                  break;
                case 5:
                  isValidated = Boolean(userInfo?.validCards);
                  break;
              }
              return (
                <Icon
                  icon={isValidated ? iconItem.active : iconItem.inactive}
                  style={styles.verifyIcon}
                  key={`key-icon-${index}`}
                />
              );
            })}
          </View>
          <Modal
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                backgroundColor: "#00000060",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  width: "90%",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <View style={[margins["mb-3"]]}>
                  <Label size="large" style={{ textAlign: "center" }}>
                    You need to login first. Do you want to login?
                  </Label>
                </View>
                <Button
                  label="Yes"
                  style={[margins["mb-3"]]}
                  onPress={async () => {
                    await setShowModal((prevState) => !prevState);
                    MainAuthStackNavigation(navigation);
                  }}
                />
                <Button
                  label="No"
                  theme="secondary"
                  onPress={() => setShowModal(false)}
                />
              </View>
            </View>
          </Modal>
        </>
      )}

      {(followerData?.isFetching || userInfoData?.isFetching) && (
        <SmallLoader />
      )}
    </View>
  );
};
