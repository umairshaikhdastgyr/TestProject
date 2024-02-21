import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, IconBadge } from "#components";
import { MainAuthStackNavigation } from "../../../../../navigators/MainAuthStackNavigation";
import { selectUserData } from "#modules/User/selectors";
import { useSelector } from "react-redux";

const NotificationBell = ({ notificationCount, navigation }) => {
  const { information: userInfo } = useSelector(selectUserData());
  let badgeWidth = 18;
  switch (notificationCount?.toString().length) {
    case 3:
      badgeWidth = 21;
      break;
  }

  return notificationCount > 0 ? (
    <TouchableOpacity
      onPress={() => {
        if (!userInfo.id) {
          MainAuthStackNavigation(navigation);
        } else {
          navigation.navigate("NotificationScreen");
        }
      }}
    >
      <IconBadge
        MainElement={
          <View style={styles.IconBadgeElementStyle}>
            <Icon icon="notification" color="active" />
          </View>
        }
        BadgeElement={
          <Text style={styles.IconTextStyle}>
            {notificationCount.toString().length == 3
              ? "99+"
              : notificationCount}
          </Text>
        }
        IconBadgeStyle={[
          styles.IconBadgeStyle,
          { width: badgeWidth, height: badgeWidth },
        ]}
      />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() => {
        if (!userInfo.id) {
          MainAuthStackNavigation(navigation);
        } else {
          navigation.navigate("NotificationScreen");
        }
      }}
      style={styles.notificationWrapper}
    >
      <Icon icon="notification" color="active" />
    </TouchableOpacity>
  );
};
export default NotificationBell;
const styles = StyleSheet.create({
  notificationWrapper: {
    marginLeft: 26,
    marginRight: 4,
  },
  IconBadgeStyle: {
    backgroundColor: "#FF5556",
    marginTop: 25,
  },
  IconTextStyle: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "Montserrat-Regular",
    fontStyle: "normal",
    fontWeight: "600",
    textAlign: "center",
  },
  IconBadgeElementStyle: {
    width: 30.5,
    height: 30.5,
    marginTop: 12,
    marginLeft: 16,
  },
});
