import React from 'react';

import { TouchableOpacity, Text, View } from 'react-native';
import { Icon } from '#components';
import styles from './styles';

const ChatBubble = ({
  data: {}
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        styles[theme],
        fullWidth && styles.fullWidth,
        subLabel && styles.subLabel,
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.mainLabelContainer}>
        {icon && (
          <Icon
            icon={icon}
            color="active"
            size={iconSize}
            style={[styles.button__icon, styles[`button__icon-${theme}`]]}
          />
        )}
        <Text
          style={[
            styles.button__text,
            styles[`button__text-${size}`],
            styles[`button__text-${theme}`],
          ]}
        >
          {label}
        </Text>
      </View>
      {subLabel && <Text style={styles.subLabelText}>{subLabel}</Text>}
    </TouchableOpacity>
  );
};

ChatBubble.defaultProps = {
  theme: 'primary',
  iconSize: 'medium',
};

export default ChatBubble;
