
import React from 'react';
import {

  Text,
  TouchableOpacity, StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderColor: '#081344',
    fontSize: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: '#081344',
    margin: 10,
    fontFamily: 'Montserrat-Light',
  },
});
export const ModalPickerItem = ({ onPress, label }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[styles.input, { borderColor: '#999999', color: '#081344' }]}>
      {label}
    </Text>
  </TouchableOpacity>
);
