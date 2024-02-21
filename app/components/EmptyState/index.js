import React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { Icon } from '#components';
import { Fonts, Colors } from '#themes';

const EmptyState = ({ icon, text, style, iconStyle }) => {
  return (
    <View style={[styles.container, style]}>
      <Icon
        icon={icon}
        color="active"
        size="large"
        style={[styles.icon, iconStyle]}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  text: {
    fontFamily: Fonts.family.regular,
    fontSize: 13,
    textAlign: 'center',
    color: Colors.black,
  },
});

export default EmptyState;
