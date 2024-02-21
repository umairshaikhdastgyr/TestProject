import React from 'react';

import {
  View, TextInput, StyleSheet, Text,
} from 'react-native';
import { Colors, Fonts } from '#themes';

const CurrencyInput = ({
  style,
  value,
  onChangeText,
  autoFocus,
  returnKeyType,
  onEndEditing,
  onSubmitEditing,
  bottomLine,
}) => (
  <View style={[styles.container, style]}>
    <Text style={styles['dollar-sign']}>$</Text>
    <TextInput
      style={[bottomLine ? styles['text-input'] : styles['text-input-no-line']]}
      placeholderTextColor={'#999999'}
      keyboardType="decimal-pad"
      placeholder="XX.XX"
      value={value}
      onChangeText={onChangeText}
      underlineColorAndroid="transparent"
      autoFocus={autoFocus}
     // returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      onEndEditing={onEndEditing}
      returnKeyType="done"
      blurOnSubmit
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  'dollar-sign': {
    position: 'absolute',
    top: 6,
    fontFamily: Fonts.family.regular,
    fontWeight: '400',
    fontSize: 24,
    color: Colors.black,
  },
  'text-input': {
    fontFamily: Fonts.family.regular,
    fontWeight: '400',
    fontSize: 24,
    color: Colors.black,
    borderBottomWidth: 1,
    borderColor: Colors.gray,
    paddingBottom: 4,
    paddingTop: 8,
    paddingLeft: 24,
  },
  'text-input-no-line': {
    fontFamily: Fonts.family.regular,
    fontWeight: '400',
    fontSize: 24,
    color: Colors.black,
    paddingBottom: 4,
    paddingTop: 8,
    paddingLeft: 24,
  },
});

CurrencyInput.defaultProps = {
  bottomLine: true,
};

export default CurrencyInput;
