import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import moment from "moment";
import StarRating from "react-native-star-rating";
import { CachedImage, Icon, StarsRate, DetailText } from "#components";
import { Colors } from "#themes";
import Icons from "#assets/icons";
import styles from "./styles";
import { margins, flex } from "#styles/utilities";
import images from "#assets/images";
const ConversationTile = ({
  onPressItem,
  type,
  data: { receiver, datetime, badgeCount, reviews, rating },
}) => {
  let dateText = "Here";
  let timeText = "Here";

  const momentDate = moment(datetime);
  timeText = momentDate.format("HH:mm");
  dateText = momentDate.format("MM/DD/YYYY");

  const errorVal = [undefined, null, "null"];
  return receiver ? (
    <View style={[styles.tileContainer]}>
      <View style={styles.tileBaseElement}>
        <View style={[styles.leftContainer, { justifyContent: "center" }]}>
          <CachedImage
            source={
              errorVal.includes(receiver?.pictureUrl)
                ? images.userPlaceholder
                : { uri: receiver.pictureUrl }
            }
            style={styles.listImg}
            indicator={Progress.Pie}
            resizeMode="contain"
            indicatorProps={{
              size: 30,
              borderRadius: 15,
              borderWidth: 0,
              color: Colors.primary,
              unfilledColor: Colors.white,
            }}
          />
        </View>
        <View style={styles.centerContainer}>
          <Text
            numberOfLines={1}
            style={badgeCount > 0 ? styles.titleTextBadge : styles.titleText}
          >
            {receiver.firstName} {receiver.lastName}
          </Text>
          {type === "interest" ? (
            <Text
              numberOfLines={1}
              style={badgeCount > 0 ? styles.msgTextBadge : styles.msgText}
            >
              {`${dateText} - ${timeText}`}
            </Text>
          ) : (
            <View
              style={{
                ...flex.directionRow,
                ...flex.alignItemsCenter,
              }}
            >
              <StarsRate value={rating} style={margins["mr-1"]} />
              {reviews > 0 && (
                <DetailText
                  style={{
                    color: Colors.inactiveText,
                    fontSize: 13,
                    lineHeight: 14,
                  }}
                >
                  ({reviews})
                </DetailText>
              )}
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.rightContainer} onPress={onPressItem}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 30,
              borderColor: "#00BDAA",
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon icon="chat_active" size="medium-large" />
          </View>
          {badgeCount > 0 && (
            <View style={styles.badgeContainer}>
              {badgeCount > 0 && (
                <Text style={styles.badgeText}>{badgeCount}</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  ) : null;
};

ConversationTile.defaultProps = {
  onPressItem: () => {},
};

export default ConversationTile;
