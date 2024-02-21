import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ToastAndroid,
  Alert,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Image,
  Share,
} from "react-native";
import Clipboard from '@react-native-community/clipboard';
import { Colors, Fonts } from "#themes";
import { ShareSheet, Button } from "react-native-share";
import Icons from "../../assets/icons/share";
const ShareContainer = ({ visible, setVisibleShare, title, shareOptions }) => {
  const RenderButton = ({ type, text, icon }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onButtonPress(type)}
      >
        <View style={styles.mainItemContainer}>
          <Image
            source={Icons[`${icon}`]}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.itemText}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onButtonPress = (type) => {
    setVisibleShare(false);
    setTimeout(() => {
      switch (type) {
        case "url":
          if (typeof shareOptions["url"] !== undefined) {
            Clipboard.setString(shareOptions["url"]);
            if (Platform.OS === "android") {
              ToastAndroid.show("Link copied", ToastAndroid.SHORT);
            } else if (Platform.OS === "ios") {
              Alert.alert("Link copied");
            }
          }
          break;
        case "more":
          Share.share({
            title: shareOptions?.title || "",
            message: `${shareOptions?.message || ""} ${
              shareOptions?.url || ""
            }`,
          });
          break;
        default:
          Share.share({
            title: shareOptions?.title || "",
            message: `${shareOptions?.message || ""} ${
              shareOptions?.url || ""
            }`,
          });
          break;
      }
    }, 300);
  };

  return (
    <ShareSheet visible={visible} onCancel={() => setVisibleShare(false)}>
      <View style={styles.itemContainer}>
        <Text style={[styles.itemText, { marginLeft: 35 }]}>{title}</Text>
      </View>
      <RenderButton icon="icon_facebook" text="Facebook" type="facebook" />
      <RenderButton icon="icon_sms" text="Message" type="more" />
      <RenderButton icon="icon_url" text="Copy URL" type="url" />
      <RenderButton icon="icon_more" text="More" type="more" />
    </ShareSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  instructions: {
    marginTop: 20,
    marginBottom: 20,
  },
  itemContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 7,
  },
  mainItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  contentContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  icon: {
    height: 22,
    width: 21,
  },
  itemText: {
    ...Fonts.style.shareText,
    color: Colors.black,
    lineHeight: 18,
    marginLeft: 22,
  },
});
export default ShareContainer;
