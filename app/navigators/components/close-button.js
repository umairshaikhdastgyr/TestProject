import React from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '#components';

const CloseButton = ({ onPress, style }) => {
  return (
    <TouchableOpacity style={[style]} onPress={onPress}>
      <Icon icon="close" />
    </TouchableOpacity>
  );
};

export default CloseButton;
