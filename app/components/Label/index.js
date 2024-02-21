import React from 'react';

import { StyleSheet, Text } from 'react-native';
import { Fonts, Colors } from '#themes';

const Label = ({ children, bold, style, size, type }) => {
  return (
    <Text
      style={{
        ...styles.label,
        ...styles[type],
        ...(bold && styles.labelBold),
        ...styles[size],
        ...style,
      }}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    ...Fonts.style.label,
    lineHeight: 12,
    color: Colors.black,
  },
  labelBold: {
    fontWeight: '600',
    fontFamily: Fonts.family.semiBold,
  },
  link: {
    color: Colors.active,
    textDecorationLine: 'underline',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  active: {
    color: Colors.active,
  },
  disabled: {
    color: Colors.inactiveText,
    textDecorationLine: 'underline',
  },
  medium: {
    fontSize: 13,
    lineHeight: 16,
  },
  large: {
    fontSize: 15,
    lineHeight: 18,
  },
});

export default Label;
