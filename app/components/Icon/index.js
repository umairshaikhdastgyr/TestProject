import React from "react";
import { string } from "prop-types";

import { StyleSheet, Animated } from "react-native";
import Icons from "#assets/icons";

const Icon = ({ icon, size, color, style, tintColor }) => {
  return (
    <>
      {tintColor ? (
        <Animated.Image
          source={Icons[`${icon}`]}
          style={[styles[size], style, { tintColor: tintColor ? tintColor : "" }]}
          resizeMode="contain"
        />
      ) : (
        <Animated.Image
          source={Icons[`${icon}${color ? `_${color}` : ""}`]}
          style={[styles[size], style]}
          resizeMode="contain"
        />
      )}
    </>
  );
};

Icon.propTypes = {
  color: string,
  size: string,
};

Icon.defaultProps = {
  color: "",
  icon: string.isRequired,
  size: "medium",
};

const styles = StyleSheet.create({
  "xx-small": {
    width: 9,
    height: 9,
  },
  "x-small": {
    width: 13,
    height: 13,
  },

  small: {
    width: 18,
    height: 18,
  },
  "medium-small": {
    width: 21,
    height: 21,
  },
  medium: {
    width: 25,
    height: 25,
  },
  "medium-large": {
    width: 35,
    height: 35,
  },
  large: {
    width: 50,
    height: 50,
  },
});

export default Icon;
