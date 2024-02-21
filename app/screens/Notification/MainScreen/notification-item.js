import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import * as Progress from "react-native-progress";
import { CachedImage, Icon } from "#components";
import { Colors } from "#themes";

import { getTimeAgo } from "#utils/parseDateToTimeAgo";
import images from "#assets/images";
import moment from "moment";
import colors from "#themes/colors";
const { width } = Dimensions.get("window");
const photoURI =
  "https://homitag-catalogs.s3.amazonaws.com/profile/female91.jpg";

const NOTIFY_TYPE = {
  message: {
    message: "sent a message",
    screen: "ChatScreen",
  },
  review_request: {
    message: "Leave a review for",
    screen: "review_request",
  },
  offer_accepted: {
    message: "accepted your offer",
    screen: "ChatScreen",
  },
  offer_counter: {
    message: "sent a message",
    screen: "ChatScreen",
  },
  offer_denied: {
    message: "denied your offer",
    screen: "ChatScreen",
  },
  exchange_accepted: {
    message: "accepted your exchange",
    screen: "ChatScreen",
  },
  exchange_cancelled: {
    message: "cancelled your exchange",
    screen: "ChatScreen",
  },
  cancellation_requested: {
    message: "requested your cancellation",
    screen: "cancellation_requested",
  },
  cancellation_accepted: {
    message: "accepted your cancellation",
    screen: "cancellation_accepted",
  },
  cancellation_denied: {
    message: "denied your cancellation",
    screen: "cancellation_denied",
  },
  return_requested: {
    message: "requested return",
    screen: "ReturnRequest",
  },
  return_accepted: {
    message: "accepted your return",
    screen: "return_accepted",
  },
  return_denied: {
    message: "denied your return",
    screen: "return_denied",
  },
  return_help: {
    message: "Need help with your return?",
    screen: "return_help",
  },
  offer: {
    message: "Sent a offer",
    screen: "ChatScreen",
  },
  meetup_requested: {
    message: "Sent a request for meetup",
    screen: "ChatScreen",
  },
  cancelled: {
    message: "Cancelled your request",
    screen: "ChatScreen",
  },
};

// const GetNotificationType = ({
//   type,
//   setMessageType,
//   sender,
//   setNotificationMessage,
// }) => {
//   for (const key in type) {
//     switch (key) {
//       case 'review_request':
//         if (type[key] == true) {
//           setMessageType(NOTIFY_TYPE[key].screen);
//           return setNotificationMessage(
//             <Text style={styles.message_item}>
//               {NOTIFY_TYPE[key].message}{' '}
//               <Text style={styles.message_item_name}>
//                 {`${sender.name} ${sender.last_name}`}
//               </Text>
//             </Text>,
//           );
//         }
//         break;
//       case 'return_help':
//         if (type[key] == true) {
//           setMessageType(NOTIFY_TYPE[key].screen);
//           return setNotificationMessage(
//             <Text style={styles.message_item}>{NOTIFY_TYPE[key].message}</Text>,
//           );
//         }
//         break;
//       default:
//         if (type[key] == true) {
//           setMessageType(NOTIFY_TYPE[key].screen);
//           return setNotificationMessage(
//             <Text style={styles.message_item}>
//               <Text style={styles.message_item_name}>
//                 {`${sender.name} ${sender.last_name}`}
//               </Text>{' '}
//               {NOTIFY_TYPE[key].message}
//             </Text>,
//           );
//         }
//         break;
//     }
//   }
// };

const NotificationItem = ({
  type,
  sender,
  navigation,
  chatItem,
  openDate,
  conversationId,
  createdAt,
  message,
  views,
  id,
  onPressNotification,
  data,
}) => {
  useEffect(() => {
    // GetNotificationType({
    //   type,
    //   sender,
    //   setMessageType,
    //   setNotificationMessage,
    // });
  }, [sender, type]);

  return (
    <TouchableOpacity
      style={styles.notification_container}
      onPress={() => onPressNotification()}
    >
      <View style={styles.image_container}>
        <CachedImage
          source={
            data?.pictureUrl
              ? data?.pictureUrl == ""
                ? images.logo
                : typeof data?.pictureUrl == "string"
                ? { uri: data?.pictureUrl }
                : typeof data?.pictureUrl == "object"
                ? { uri: data?.pictureUrl?.urlImage }
                : images.logo
              : images.logo
          }
          resizeMode={
            data?.pictureUrl == "" &&
            typeof data?.pictureUrl == "string" &&
            typeof data?.pictureUrl == "object"
              ? "contain"
              : !data?.pictureUrl
              ? "contain"
              : "cover"
          }
          tintColor={
            !data?.pictureUrl
              ? Colors.primary
              : data?.pictureUrl == "" &&
                typeof data?.pictureUrl == "string" &&
                typeof data?.pictureUrl == "object" &&
                Colors.primary
          }
          style={styles.image_item}
          indicator={Progress.Pie}
          indicatorProps={{
            size: 30,
            borderWidth: 0,
            color: Colors.primary,
            unfilledColor: Colors.white,
          }}
        />
      </View>
      <View style={styles.message_container}>
        <Text style={styles.message}>{message || ""}</Text>
        {/* <Text style={styles.message}>{""+data?.conversationId}</Text> */}
      </View>
      <View style={styles.status_container}>
        {!views && <Icon icon="online" size="xx-small" />}
      </View>
      <Text
        style={{
          fontFamily: "Montserrat-LightItalic",
          fontSize: 11,
          textAlign: "right",
          color: "#6e6e6e",
          position: "absolute",
          bottom: 5,
          right: 10,
        }}
      >
        {moment(createdAt).format("MM-DD-yyyy") == moment().format("MM-DD-yyyy")
          ? moment(createdAt).format("hh:mm a")
          : moment(createdAt).fromNow()}
      </Text>
    </TouchableOpacity>
  );
};
export default NotificationItem;
const styles = StyleSheet.create({
  notification_container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 20,
    width,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  image_container: {
    // alignSelf: 'flex-start',
    justifyContent: "center",
    overflow: "hidden",
    width: 35,
    height: 35,
    borderRadius: 22.5,
    borderWidth: 0.5,
    borderColor: "#ffffff",
  },
  message_container: {
    justifyContent: "center",
    marginLeft: 8,
    flex: 1,
  },
  status_container: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: 50,
    width: 20,
    paddingBottom: 20,
  },
  image_item: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    borderRadius: 22.5,
    overflow: "hidden",
  },
  message_item: {
    fontFamily: "Montserrat-Regular",
    fontStyle: "normal",
    fontSize: 13,
    lineHeight: 18,
    marginHorizontal: 17,
    width: width - 160,
  },

  message: {
    fontFamily: "Montserrat-Regular",
    fontStyle: "normal",
    fontSize: 11,
    lineHeight: 18,
  },
  message_item_name: {
    fontFamily: "Montserrat-Regular",
    fontStyle: "normal",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "bold",
  },
});
