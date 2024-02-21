import React from "react";
import { TouchableOpacity, View, Image, StyleSheet, Text } from "react-native";
import { Metrics, Colors, Fonts } from "#themes";
import Icons from "#assets/icons";
import { Icon } from "#components";

const styles = StyleSheet.create({
  fbContainer: {
    height: Metrics.buttonHeight,
    flexDirection: "row",
    backgroundColor: Colors.darkBlue,
    width: Metrics.width - 100,
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  googleContainer: {
    height: Metrics.buttonHeight,
    flexDirection: "row",
    backgroundColor: Colors.white,
    width: Metrics.width - 100,
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  whiteText: {
    ...Fonts.style.buttonText,
    color: Colors.white,
    marginLeft: 10,
  },
  darkText: {
    ...Fonts.style.buttonText,
    color: Colors.black,
    marginLeft: 10,
  },
  fbIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  googleIcon: {
    width: 17,
    height: 17,
    resizeMode: "contain",
  },
});

export const FacebookButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.fbContainer} onPress={onPress}>
      <Image source={Icons.facebook} style={styles.fbIcon} />
      <Text style={styles.whiteText}>Continue with Facebook</Text>
    </TouchableOpacity>
  );
};

export const GoogleButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.googleContainer} onPress={onPress}>
      <Image source={Icons.google} style={styles.googleIcon} />
      <Text style={styles.darkText}>Continue with Google</Text>
    </TouchableOpacity>
  );
};
