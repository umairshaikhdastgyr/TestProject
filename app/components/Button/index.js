import React from "react";

import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { Icon } from "#components";
import styles from "./styles";

const Button = ({
  label,
  size,
  theme,
  icon,
  fullWidth,
  style,
  onPress,
  iconSize,
  subLabel,
  disabled,
  numberOfLine,
  redAsterisk,
  showLoading,
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      styles[size],
      styles[theme],
      fullWidth && styles.fullWidth,
      subLabel && styles.subLabel,
      disabled && styles.disabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled || showLoading}
  >
    {!showLoading ? (
      <>
        <View style={styles.mainLabelContainer}>
          {icon && (
            <Icon
              icon={icon}
              color="active"
              size={iconSize}
              style={[styles.button__icon, styles[`button__icon-${theme}`]]}
            />
          )}
          <Text
            numberOfLines={2}
            style={[
              styles.button__text,
              styles[`button__text-${size}`],
              styles[`button__text-${theme}`],
              {
                textAlign: "center",
              },
            ]}
          >
            {label}
          </Text>
          {redAsterisk && <Text style={{ color: "red" }}>*</Text>}
        </View>
        {subLabel.length > 0 && (
          <Text style={styles.subLabelText}>{subLabel}</Text>
        )}
      </>
    ) : (
      <ActivityIndicator color="#ffffff" size={"small"} />
    )}
  </TouchableOpacity>
);

Button.defaultProps = {
  theme: "primary",
  iconSize: "medium",
  subLabel: "",
};

export default Button;
