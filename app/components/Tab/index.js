import React from 'react';

import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors, Fonts } from '#themes';

const Tab = ({
  label,
  active,
  style,
  activeStyle,
  onPress,
  theme,
  disabled,
}) => (
  <TouchableOpacity
    style={[
      styles.tab,
      active && styles.active,
      style,
      theme && styles[theme],
      active && theme && styles[`active-${theme}`],
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text
      style={[
        styles.text,
        active && { ...styles.textActive, ...activeStyle },
        theme && styles[`text-${theme}`],
        disabled && styles['text-disabled'],
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
Tab.defaultProps = {
  disabled: false,
};

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 18,
    borderBottomWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 30,
  },
  primary: {
    borderBottomWidth: 4,
  },
  active: {
    borderColor: Colors.active,
  },
  'active-primary': {
    borderColor: Colors.primary,
  },
  text: {
    fontFamily: Fonts.family.regular,
    color: Colors.black,
    fontWeight: '400',
    fontSize: 13,
  },
  'text-primary': {
    fontSize: 15,
  },
  'text-disabled': {
    color: Colors.inactiveText,
  },
  textActive: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '600',
  },
});

export default Tab;
