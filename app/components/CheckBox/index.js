import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Fonts, Colors } from '#themes';

const CheckBox = ({ label, selected, onChange, theme }) => {
  return (
    <View style={styles.checkBox}>
      <Text style={[styles.text, styles[`text-${theme}`]]}>{label}</Text>
      <TouchableOpacity
        style={[styles.switchBody, selected && styles.bodyActive]}
        onPress={() => onChange(!selected)}
      >
        <View
          style={[styles.switchHandler, selected && styles.handlerActive]}
        />
      </TouchableOpacity>
    </View>
  );
};

CheckBox.defaultProps = {
  selected: false,
};

const styles = StyleSheet.create({
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  text: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '500',
    color: Colors.black,
    flex: 1,
  },
  switchBody: {
    width: 40,
    height: 13,
    backgroundColor: Colors.grey,
    borderRadius: 6,
  },
  switchHandler: {
    height: 22,
    width: 22,
    borderRadius: 22,
    backgroundColor: Colors.gray,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    top: -5,
    left: 0,
    position: 'absolute',
    elevation: 3,
  },
  bodyActive: {
    backgroundColor: Colors.lightActive,
  },
  handlerActive: {
    left: 18,
    backgroundColor: Colors.active,
  },
  'text-alter': {
    fontFamily: Fonts.family.bold,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CheckBox;
