import React from 'react';
import { array, func, string } from 'prop-types';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '#themes';

const RadioInputs = ({ options, onChange, name, value }) => {
  return (
    <>
      {options.map(option => (
        <TouchableOpacity
          style={styles.radioInputs}
          key={option.value}
          onPress={() => onChange(name, option.value)}>
          <View
            style={{
              ...styles.radioInputs__circle,
              ...(value === option.value && styles.circleActive),
            }}
          />
          <Text
            style={{
              ...styles.radioInputs__text,
              ...(value === option.value && styles.textActive),
            }}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </>
  );
};

RadioInputs.propTypes = {
  options: array.isRequired,
  onChange: func.isRequired,
  value: string,
  name: string,
};

const styles = StyleSheet.create({
  radioInputs: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  radioInputs__circle: {
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 40,
    marginRight: 10,
  },
  circleActive: {
    borderColor: Colors.active,
    backgroundColor: Colors.active,
  },
  radioInputs__text: {
    fontFamily: Fonts.family.regular,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.black,
  },
  textActive: {
    fontWeight: '600',
    color: Colors.black,
  },
});

export default RadioInputs;
