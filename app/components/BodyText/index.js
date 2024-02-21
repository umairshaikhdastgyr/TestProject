import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Fonts, Colors } from '#themes';

const styles = StyleSheet.create({
  bodyText: {
    ...Fonts.style.homiBodyTextMedium,
    fontSize: 13,
    fontWeight: 'normal',
    lineHeight: 18,
  },
  inactive: {
    color: Colors.inactiveText,
  },
  black: {
    color: 'black',
  },
  link: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: Colors.black,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  medium: {
    fontSize: 15,
  },
  xsmall: {
    fontSize: 11,
  },
  small: {
    fontSize: 12,
  },
  bold: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '500',
  },
  'align-left': {
    textAlign: 'left',
  },
  'align-center': {
    textAlign: 'center',
  },
  'align-right': {
    textAlign: 'right',
  },
  regular: {
    fontFamily: Fonts.family.regular,
    fontWeight: '400',
  },
});

const BodyText = ({
  children,
  theme,
  size,
  style,
  numberOfLines,
  onPress,
  bold,
  align,
}) => (
  <Text
    style={[
      styles.bodyText,
      styles[theme],
      styles[size],
      style,
      bold && styles.bold,
      styles[`align-${align}`],
    ]}
    numberOfLines={numberOfLines}
    onPress={onPress}>
    {children}
  </Text>
);

BodyText.defaultProps = {
  align: 'left',
};

export default BodyText;
