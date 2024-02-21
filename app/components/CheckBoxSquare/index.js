import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '#themes';

const CheckBoxSquare = ({
  label,
  disabled,
  active,
  onChange,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={!disabled ? onChange : () => {}}>
      <View
        style={[
          styles.square,
          disabled && styles.squareDisabled,
          active && styles.squareActive,
        ]}
      />
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop:10
  },
  square: {
    height: 15,
    width: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.inactiveText,
  },
  squareDisabled: {
    backgroundColor: Colors.inactiveText,
  },
  squareActive: {
    borderColor: Colors.active,
    backgroundColor: Colors.active,
  },
  text: {
    fontFamily: Fonts.family.medium,
    fontSize: 15,
    color: Colors.black,
  },
  textActive: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '600',
    color: Colors.black,
  },
});

export default CheckBoxSquare;
