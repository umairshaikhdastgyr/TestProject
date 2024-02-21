import React from 'react';

import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Fonts, Colors } from '#themes';

const TypeTag = ({
  label,
  style,
  active,
  icon,
  iconActive,
  onPress,
  theme,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.typeTag, style, styles[`typeTag-${theme}`]]}
      onPress={onPress}
    >
      <Image
        source={{
          uri: icon,
        }}
        resizeMode="contain"
        style={[styles.icon, {tintColor: active ? '#01BDAA' : '#969696'}]}
      />
      <Text
        style={[
          styles.typeTag__text,
          active && styles.textActive,
          styles[`typeTag__text-${theme}`],
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  typeTag: {
    backgroundColor: 'white',
    paddingBottom: 18,
    paddingTop: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: '42%',
    minWidth: 135,
    elevation: 2,
  },
  typeTag__text: {
    fontFamily: Fonts.family.regular,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 13,
    color: Colors.inactiveText,
    paddingHorizontal: 8,
  },
  textActive: {
    fontFamily: Fonts.family.semiBold,
    color: Colors.black,
  },
  icon: {
    width: 66,
    height: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 14,
  },
  'typeTag-wild': {
    width: 'auto',
    minWidth: 80,
  },
  'typeTag__text-wild': {
    fontFamily: Fonts.family.semiBold,
    fontSize: 13,
  },
});

export default TypeTag;
