import React from 'react';

import { StyleSheet, Text } from 'react-native';
import { Fonts, Colors } from '#themes';

const Heading = ({ children, style, type, bold, theme, numberLines }) => {
  return (
    <Text
      numberOfLines={numberLines}
      style={[styles[type], bold && styles.bold, style, styles[theme]]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h4: {
    ...Fonts.style.h4,
  },
  h6: {
    ...Fonts.style.h6,
    fontFamily: Fonts.family.semiBold,
  },
  bodyText: {
    fontFamily: Fonts.family.semiBold,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: Colors.black,
  },
  bold: {
    fontFamily: Fonts.family.bold,
    fontWeight: '600',
  },
  inactive: {
    fontFamily: Fonts.family.regular,
    fontWeight: '400',
    color: Colors.inactiveShape,
  },
  regular: {
    fontFamily: Fonts.family.regular,
    fontWeight: '400',
    color: '#313334',
  },
});

export default Heading;
