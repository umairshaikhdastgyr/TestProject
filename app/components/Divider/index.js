import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Colors } from '#themes';

const Divider = ({ style }) => {
  return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    borderColor: Colors.grey,
  },
});

export default Divider;
