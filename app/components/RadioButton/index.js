import React from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Colors, Fonts } from '#themes';

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginRight: 10,
  },
  activeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.active,
    backgroundColor: Colors.active,
    marginRight: 10,
  },
  label: {
    color: '#313334',
    ...Fonts.style.homiBodyText,
  },
  activeLabel: {
    color: Colors.black,
    ...Fonts.style.headerText,
  },
});

const RadioButton = ({
  isActive, label, onPress, type,
}) => (
  <TouchableOpacity
    style={[styles.radioButton, type === 'decline' && { marginVertical: 10 }]}
    onPress={onPress}
  >
    <View style={isActive ? styles.activeCircle : styles.circle} />
    <Text style={isActive ? styles.activeLabel : styles.label}>{label}</Text>
  </TouchableOpacity>
);
export default RadioButton ;
