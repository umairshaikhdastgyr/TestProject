import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Icon } from "#components";
import { Colors, Fonts } from "#themes";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonText: {
    ...Fonts.size.medium,
    fontWeight: "600",
    color: Colors.active,
    marginLeft: 10,
    textDecorationLine: "underline",
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});

export const ResendButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon icon="return" color="active" />
      </View>
      <Text style={styles.buttonText}>Resend the code</Text>
    </TouchableOpacity>
  );
};

export const SendPhoneButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon icon="mobile" color="active" style={styles.mobileIcon} />
      </View>
      <Text style={styles.buttonText}>Resend to my phone</Text>
    </TouchableOpacity>
  );
};
