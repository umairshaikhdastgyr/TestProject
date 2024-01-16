import React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../theme/Colors';
import Styless from '../constants/Styless';
import { WP } from '../theme/Dimensions';

export const Pressable = ({ onPress, children, style, props }) => {
  return (
    <TouchableOpacity
      style={[styles.pressableContainer, style]}
      {...props}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

export const PButton = ({ onPress, props, text, style, icon, textStyle, imageStyle, leftIcon, leftImageStyle }) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        props?.disabled ? styles.disabledButton : null,
        style,
      ]}
      {...props}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {leftIcon ? (
        <Image
          style={[Styless.imageStyle(3.5), styles.leftIcon, leftImageStyle]}
          source={leftIcon}
        />
      ) : null}
      {text ? (
        <Text style={[Styless.semiBold(4, Colors.white), styles.buttonText, textStyle]}>
          {text}
        </Text>
      ) : null}
      {icon ? (
        <Image style={[Styless.imageStyle(3.5), styles.icon, imageStyle]} source={icon} />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: WP(11),
    flexDirection: 'row',
    borderRadius: WP(2),
  },
  disabledButton: {
    opacity: 0.6,
  },
  leftIcon: {
    marginRight: WP(1),
  },
  buttonText: {
    color: Colors.white,
  },
  icon: {
    marginLeft: WP(1),
  },
});
