import React from 'react';

import { StyleSheet, Text } from 'react-native';
import { Fonts } from '#themes';

const DetailText = ({ children, style, numberOfLines }) => {
  return (
    <Text
      style={{ ...styles.detailText, ...style }}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  detailText: {
    ...Fonts.style.detailText,
    fontWeight: 'normal',
    lineHeight: 11,
  },
});

export default DetailText;
