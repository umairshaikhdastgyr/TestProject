import React from "react";

import { TouchableOpacity, Text, View } from "react-native";
import { CachedImage } from "#components";
import * as Progress from "react-native-progress";
import { Colors } from "#themes";
import moment from "moment";

import styles from "./styles";
import images from "#assets/images";

const ConversationTile = ({
  onPressItem,
  data: {
    receiver,
    post,
    message,
    datetime,
    badgeCount,
    customInfo,
    senderId,
    conversation,
  },
  userId,
}) => {
  let dateText = "Here";

  let today = moment(new Date()).startOf("day");
  let yesterday = today.clone().subtract(1, "days").startOf("day");

  let momentDate = moment(datetime);

  if (momentDate.isSame(today, "d")) {
    dateText = momentDate.format("HH:mm");
  } else if (momentDate.isSame(yesterday, "d")) {
    dateText = "Yesterday";
  } else {
    dateText = momentDate.format("MM/DD/YYYY");
  }

  let resultMessage = message;

  if (customInfo && senderId === userId) {
    const { type } = customInfo;
    switch (type) {
      case "attachment_message":
        resultMessage = `Attachment Message ${customInfo?.metadata?.key}`;
        break;
      case "offer":
        resultMessage = `You purchased ${post.title} for $${customInfo.value}`;
        break;
      case "countered":
        resultMessage = `You countered $${customInfo.value} for ${post.title}`;
        break;
      case "meetup":
        const { data } = customInfo;
        resultMessage = `You proposed a meeting at ${data.address}`;
        break;
      case "offer_accepted":
        resultMessage = "The offer was accepted";
        break;
      case "offer_declined":
        resultMessage = "The offer was declined";
        break;
      case "offer_cancelled":
        resultMessage = "The offer was cancelled";
        break;
      case "complete_exchange":
        resultMessage = "The exchange was completed";
        break;
      default:
        resultMessage = message;
        break;
    }
  } else if (customInfo?.type == "attachment_message") {
    resultMessage = message
      ? message
      : `Received ${customInfo?.metadata?.key}`;
  }
  const errorVal = [undefined, null, "null"];
  return (
    <TouchableOpacity style={[styles.tileContainer]} onPress={onPressItem}>
      <View style={styles.tileBaseElement}>
        <View style={styles.leftContainer}>
          <CachedImage
            source={
              receiver.pictureUrl
                ? { uri: receiver.pictureUrl }
                : images.userPlaceholder
            }
            style={styles.listImg}
            indicator={Progress.Pie}
            indicatorProps={{
              size: 30,
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
            {post?.title
              ? `${post?.title} `
              : `${receiver.firstName} ${receiver.lastName}`}
            {post?.title ? (
              <Text
                style={
                  badgeCount > 0
                    ? [styles.titleTextBadge, { fontSize: 10 }]
                    : [styles.titleText, { fontSize: 10 }]
                }
              >
                {`(${receiver.firstName} ${receiver.lastName})`}
              </Text>
            ) : null}
            {/* {`${receiver.firstName} ${receiver.lastName} ${
              post?.title ? `(${post?.title})` : ""
            }`} */}
          </Text>
          <Text
            numberOfLines={1}
            style={badgeCount > 0 ? styles.msgTextBadge : styles.msgText}
          >
            {resultMessage}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={badgeCount > 0 ? styles.timeTextBadge : styles.timeText}>
            {dateText}
          </Text>
          {/* {conversation?.sections[0]?.data[0]?.datetimeSeen == null ? ( */}
          {badgeCount ? (
            <View
              style={
                badgeCount > 0
                  ? styles.badgeContainer
                  : styles.badgeContainerEmpty
              }
            >
              {badgeCount > 0 && (
                <Text style={styles.badgeText}>{badgeCount}</Text>
              )}
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

ConversationTile.defaultProps = {
  onPressItem: () => { },
};

export default ConversationTile;
