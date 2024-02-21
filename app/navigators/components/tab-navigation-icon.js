import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { selectChatData } from "#modules/Chat/selectors";

import Icons from "#assets/icons/bottom-navigation";

import { Fonts } from "#themes";
import { useNavigation } from "@react-navigation/native";
import { LocalStorage } from "#services";
import { MainAuthStackNavigation } from "../MainAuthStackNavigation";

const tabNavigationIcon = ({ icon, active, routeName }) => {
  const navigation = useNavigation();

  const handleTabPress = async () => {
    const user = await LocalStorage.getUserInformation();
    if (user && user.id) {
      navigation.navigate(routeName);
    } else {
      MainAuthStackNavigation(navigation);
    }
  };
  const [badgeCount, setBadgeCount] = useState(0);
  const { chatInfo } = useSelector(selectChatData());

  useEffect(() => {
    if (chatInfo != null) {
      const arrayObj = Object.entries(chatInfo);

      let count = 0;
      for (let i = 0; i < arrayObj.length; i++) {
        count += arrayObj[i][1].badgeCount;
      }
      setBadgeCount(count);
    }
  }, [chatInfo]);

  return (
    <>
      {icon !== "sellmain" && icon !== "chatmain" && (
        <TouchableOpacity
          onPress={handleTabPress}
          hitSlop={{ top: 10, bottom: 30, left: 30, right: 30 }}
        >
          <Image
            source={Icons[`${icon}${active ? "_active" : ""}`]}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
      {icon === "sellmain" && (
        <TouchableOpacity
          style={styles.mainIcon}
          onPress={handleTabPress}
          hitSlop={{ top: 10, bottom: 30, left: 30, right: 30 }}
        >
          <Image
            source={Icons[`${icon}${active ? "_active" : ""}`]}
            style={styles.iconActive}
          />
        </TouchableOpacity>
      )}
      {icon === "chatmain" && (
        <TouchableOpacity
          onPress={handleTabPress}
          hitSlop={{ top: 10, bottom: 30, left: 30, right: 30 }}
        >
          <View
            style={
              badgeCount > 0
                ? styles.badgeContainer
                : styles.badgeContainerEmpty
            }
          >
            {badgeCount > 0 && badgeCount < 100 && (
              <Text numberOfLines={1} style={styles.badgeText}>
                {badgeCount}
              </Text>
            )}
            {badgeCount >= 100 && (
              <Text numberOfLines={1} style={styles.badgeText}>
                +99
              </Text>
            )}
          </View>
          <Image
            source={Icons[`${icon}${active ? "_active" : ""}`]}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 31,
    height: 28,
  },
  iconActive: {
    width: 31,
    height: 28,
    tintColor: "#ffffff",
  },
  mainIcon: {
    backgroundColor: "#00BDAA",
    height: 56,
    width: 56,
    borderRadius: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  badgeContainer: {
    position: "absolute",
    top: -15,
    left: 20,
    zIndex: 3,
    height: 20,
    minWidth: 20,
    backgroundColor: "#00BDAA",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: 7,
  },
  badgeContainerEmpty: {
    position: "absolute",
    height: 20,
    minWidth: 20,
    backgroundColor: "transparent",
    marginTop: 7,
  },
  badgeText: {
    textAlign: "center",
    color: "white",
    fontSize: 13,
    fontFamily: Fonts.family.regular,
    fontWeight: "500",
    marginHorizontal: 5,
  },
});

export default tabNavigationIcon;
