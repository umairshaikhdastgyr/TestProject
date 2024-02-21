import React from 'react';

import { TouchableOpacity, Text, View } from 'react-native';
import { Icon, Heading } from '#components';
import styles from './styles';

const ButtonWithTitle = ({
  buttonPressed,
  label,
  icon,
  innerText,
  active,
  disabled,
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={
        buttonPressed
      }
  >
    <View style={styles.tile}>

      <View style={[styles.tile__body, active ? styles.tile__green : styles.tile__gray]}>
        <View style={styles.tile__icons}>
          <Heading type="bold" style={{ fontSize: 13, textAlign: 'center', color: '#ffffff' }}>
            {label}
          </Heading>
        </View>
      </View>
      <View style={styles.tile__container}>
        <Icon
          icon={icon}
          size="medium-large"
          style={[styles.icons__center, active ? styles.icons_green : styles.icons__gray]}
        />
        <Heading type="regular" style={styles.tile__innerText}>
          {innerText}
        </Heading>
      </View>
    </View>
  </TouchableOpacity>
);

ButtonWithTitle.defaultProps = {
  theme: 'primary',
  iconSize: 'medium',
};

export default ButtonWithTitle;
