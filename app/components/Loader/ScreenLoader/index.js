import React from "react";
import { View } from "react-native";
import { Colors } from "#themes";
import { Utilities } from "#styles";
import { BallIndicator } from "react-native-indicators";
const ScreenLoader = () => (
  <View style={Utilities.style.activityContainer}>
    <BallIndicator size={30} color={Colors.active} />
  </View>
);
export default ScreenLoader;
