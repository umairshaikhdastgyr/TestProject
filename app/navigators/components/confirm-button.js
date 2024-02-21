import React from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '#components';

const ConfirmButton = ({ navigation, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.closeButton, style]} onPress={onPress}>
      <Icon icon="confirm" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    padding: 10,
    marginRight: 5,
  },
});

export default ConfirmButton;
