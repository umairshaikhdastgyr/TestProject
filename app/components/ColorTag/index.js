import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Fonts, Colors } from '#themes';
import Icon from 'react-native-vector-icons/Feather';
const ColorTag = ({ label, value, active, width, margin, jump, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width,
          marginBottom: margin,
          marginRight: margin,
          ...(jump && styles.killInJump),
        },
        active && styles.containerActive,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.color,
          {
            backgroundColor: `#${value}`,
            ...(value === 'FFFFFF' && styles.whiteFix),
          },
        ]}
      >
        {active && (
          <Icon
            name="check"
            size={26}
            color={value === 'FFFFFF' ? '#000' : '#fff'}
            style={styles.icon}
          />
        )}
      </View>
      <Text style={[styles.text, active && styles['text-active']]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 8,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 2,
  },
  containerActive: {
    shadowOpacity: 0.15,
    shadowOffset: { width: 4, height: 8 },
    shadowRadius: 17,
    elevation: 4,
  },
  killInJump: {
    marginRight: 0,
  },
  color: {
    height: 36,
    width: 36,
    borderRadius: 36,
    marginBottom: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
  },
  whiteFix: {
    borderWidth: 1,
    borderColor: '#B4B4B4',
  },
  text: {
    fontFamily: Fonts.family.semiBold,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.inactiveText,
    textAlign: 'center',
  },
  'text-active': {
    color: Colors.black,
  },
  icon: {
    alignSelf: 'center',
    marginTop: 3,
  },
});

export default ColorTag;
