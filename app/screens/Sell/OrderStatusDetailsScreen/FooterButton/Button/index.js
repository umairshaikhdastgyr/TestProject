import React from 'react';

import { TouchableOpacity, Text, View } from 'react-native';
import { Icon } from '#components';
import styles from './styles';

const Button = ({
  label,
  size,
  theme,
  icon,
  fullWidth,
  style,
  onPress,
  iconSize,
  subLabel,
  disabled,
  numberOfLine,
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      styles[theme],
      styles.fullWidth,
      subLabel && styles.subLabel,
      disabled && styles.disabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text
      numberOfLines={2}
      style={[
        styles.button__text,
        styles['button__text-large'],
        styles[`button__text-${theme}`],
        { textAlign: 'center', lineHeight: 20 },
      ]}
    >
      {label}
    </Text>

  </TouchableOpacity>
);

Button.defaultProps = {
  theme: 'primary',
  iconSize: 'medium',
  subLabel: '',
};

export default Button;
