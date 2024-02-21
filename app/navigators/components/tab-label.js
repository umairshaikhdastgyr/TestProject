import React from "react";

import { StyleSheet, Text } from "react-native";
import { Fonts, Colors } from "#themes";
import { useNavigation } from "@react-navigation/native";
import { LocalStorage } from "#services";
import { MainAuthStackNavigation } from "../MainAuthStackNavigation";

const tabLabel = ({ label, active, routeName }) => {
  const navigation = useNavigation();

  const handleTabPress = async () => {
    const user = await LocalStorage.getUserInformation();
    if (user && user.id) {
      navigation.navigate(routeName);
    } else {
      MainAuthStackNavigation(navigation);
    }
  };
  return (
    <Text
      onPress={handleTabPress}
      style={[styles.label, { color: active ? Colors.active : Colors.black }]}
    >
      {label}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: "500",
    fontSize: 9,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default tabLabel;
