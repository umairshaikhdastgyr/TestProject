import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Fonts, Colors } from '#themes';

const Link = ({ children, theme, onPress }) => {
  return <Text style={[styles.text, styles[theme]]}>{children}</Text>
  
  // (
  // <TouchableOpacity style={styles.button} onPress={onPress}>
  // {/* </TouchableOpacity>) */}
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '500',
    fontSize: 13,
    textDecorationLine: 'underline',
    color: Colors.black,
  },
  active: {
    color: Colors.active,
    fontWeight: '600',
  },
  bold: {
    fontWeight: '600',
  },
});

export default Link;
