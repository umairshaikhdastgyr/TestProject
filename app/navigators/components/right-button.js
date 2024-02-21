import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Fonts, Colors } from "#themes";

const RightButton = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: "600",
    fontSize: 16,
    color: Colors.active,
  },
});

export default RightButton;
