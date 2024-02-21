import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from './styles';

const NormalButton = ({ label, onPress, buttonStyle, textStyle, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[ disabled ? styles.containerDisabled : styles.container, buttonStyle]}
      disabled={disabled}
    >
      <Text style={[styles.whiteBtnText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default NormalButton;
