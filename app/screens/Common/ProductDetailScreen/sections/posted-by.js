import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import {
  StarsRate,
  BodyText,
  Picture,
  Heading,
  DetailText,
  Button,
  Loader,
} from "#components";
import { paddings, margins, flex, borders } from "#styles/utilities";
import { Colors } from "#themes";
import images from "#assets/images";

const PostedBy = ({
  userInfo,
  followAction,
  unfollowAction,
  isFetching,
  data,
  followUpdateState,
  navigation,
}) => {
  /* Selectors */

  /* Actions */

  /* Effects */

  /* Methods */
  const parseCityName = (location) => {
    if (!location) {
      return "";
    }

    const city = location?.address_components?.reduce(
      (cityParsed, component) => {
        if (
          component.types.find((type) => type === "administrative_area_level_2")
        ) {
          cityParsed = component.long_name.replace(" County", "");
        }

        if (component.types.find((type) => type === "locality")) {
          cityParsed = component.long_name;
        }
        return cityParsed;
      },
      ""
    );
    return city;
  };

  const onPressUser = () => {
    navigation.navigate("FollowerDetail", {
      data,
      from: "detail",
      isUserReview: true,
    });
  };

  return (
    <View
      style={{
        ...paddings["p-3"],
        ...paddings["pb-5"],
        ...borders.bb,
      }}
    >
      <Heading type="bodyText" style={margins["mb-4"]}>
        Posted by
      </Heading>
      {isFetching && <Loader />}
      {!isFetching && (
        <TouchableOpacity style={flex.directionRow} onPress={onPressUser}>
          {data?.profilepictureurl ? (
            <Picture
              source={data.profilepictureurl}
              type="avatar"
              style={margins["mr-3"]}
            />
          ) : (
            <Image
              source={images.userPlaceholder}
              style={[
                margins["mr-3"],
                {
                  height: 66,
                  width: 66,
                  borderRadius: 50,
                },
              ]}
            />
          )}
          <View style={{ ...margins["mr-3"], ...flex.grow1 }}>
            <Heading type="h6" style={margins["mb-1"]} numberLines={1}>
              {data?.name}
            </Heading>
            <BodyText
              theme="inactive"
              style={margins["mb-1"]}
              size="small"
              numberOfLines={1}
            >
              {data?.Addresses?.[0]?.city}
            </BodyText>
            <View
              style={{
                ...flex.directionRow,
                ...flex.alignItemsCenter,
              }}
            >
              <StarsRate value={data?.rating} style={margins["mr-1"]} />
              {data?.reviews > 0 && (
                <DetailText
                  style={{
                    color: Colors.inactiveText,
                    fontSize: 11,
                    lineHeight: 14,
                  }}
                >
                  {`(${data?.reviews.toLocaleString()})`}
                </DetailText>
              )}
            </View>
          </View>
          {userInfo.id && userInfo.id !== data?.id && (
            <View
              style={{
                ...borders.bl,
                ...paddings["pl-3"],
                ...flex.justifyContentCenter,
              }}
            >
              {data?.isFollowing === "0" && (
                <Button
                  label="FOLLOW"
                  theme="secondary-active"
                  size="small"
                  icon="add"
                  iconSize="x-small"
                  style={{ paddingLeft: 7, paddingRight: 7 }}
                  onPress={followAction}
                  disabled={followUpdateState.isFetching}
                />
              )}
              {data?.isFollowing !== "0" && (
                <Button
                  label="UNFOLLOW"
                  theme="secondary-active"
                  size="small"
                  style={{ paddingLeft: 7, paddingRight: 7 }}
                  onPress={unfollowAction}
                  disabled={followUpdateState.isFetching}
                />
              )}
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PostedBy;
