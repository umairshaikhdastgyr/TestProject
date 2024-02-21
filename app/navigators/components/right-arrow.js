import React from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {Icon} from '#components';

const RightArrowButton = ({onPress, style}) => {
  return (
    <TouchableOpacity
      style={[style]}
      onPress={onPress}>
      <Icon icon="back" />
    </TouchableOpacity>
  );
};

export default RightArrowButton;
