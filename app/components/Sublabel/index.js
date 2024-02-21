import React from 'react';

import { StyleSheet, Text } from 'react-native';

const Sublabel = ({ children, style }) => {
  return <Text style={{ ...styles.subLabel, ...style }}>{children}</Text>;
};

const styles = StyleSheet.create({
  subLabel: {
    fontSize: 9,
    fontWeight: 'normal',
    lineHeight: 11,
  },
});

export default Sublabel;
