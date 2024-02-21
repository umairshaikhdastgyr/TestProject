import React, { useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Icon } from "#components";
import { styles } from "./styles";
import { Colors } from "#themes";

const BUTTONS = [
  { id: "profile-settings", title: "Profile Settings" },
  { id: "notification-settings", title: "Notification Settings" },
  { id: "password-setting", title: "Password" },
  { id: "about-us", title: "About Us" },
  { id: "privacy-policy", title: "Privacy Policy" },
  { id: "terms-of-use", title: "Terms of Use" },
  { id: "delete-account", title: "Delete Account" },
  { id: "logout", title: "Logout" },
];

const onPress = async (
  buttonId,
  navigation,
  onLogoutPress,
  handleDeleteAccount
) => {
  switch (buttonId) {
    case "profile-settings":
      navigation.navigate("EditProfileSettings");
      break;
    case "notification-settings":
      navigation.navigate("NotificationSettings");
      break;
    case "about-us":
      navigation.navigate("AboutUsScreen");
      break;
    case "password-setting":
      navigation.navigate("PasswordSetting");
      break;
    case "privacy-policy":
      navigation.navigate("PrivacyPolicy");
      break;
    case "terms-of-use":
      navigation.navigate("TermsAndConditionScreen");
      break;
    case "delete-account":
      handleDeleteAccount();
      break;
    case "logout":
      onLogoutPress();
      break;
    default:
      break;
  }
};

export const ButtonItems = ({
  navigation,
  onLogoutPress,
  googleValue,
  handleDeleteAccount,
}) => {
  return BUTTONS.map((buttonItem) => (
    <>
      {googleValue === true && buttonItem.id == "password-setting" ? null : (
        <TouchableOpacity
          style={styles.buttonContainer}
          key={`key-btn-${buttonItem.id}`}
          onPress={() =>
            onPress(
              buttonItem.id,
              navigation,
              onLogoutPress,
              handleDeleteAccount
            )
          }
        >
          <Text
            style={[
              styles.itemText,
              {
                color:
                  buttonItem.id !== "delete-account" ? "#000000" : Colors.red,
              },
            ]}
          >
            {buttonItem.title}
          </Text>
          {buttonItem.id !== "logout" && buttonItem.id !== "delete-account" && (
            <Icon icon="chevron-right" color="grey" style={styles.rightIcon} />
          )}
        </TouchableOpacity>
      )}
    </>
  ));
};
