import React from 'react';

import {
  View, TextInput, StyleSheet, Text,
} from 'react-native';
import { Colors, Fonts } from '#themes';

const CurrencyInputSell = ({
  style,
  value,
  onChangeText,
  autoFocus,
  returnKeyType,
  onSubmitEditing,
  editable,
}) => (
  <View style={[styles.container, style]}>
    <TextInput
      editable={editable}
      style={[styles['text-input']]}
      keyboardType="decimal-pad"
      placeholder="Enter your offer"
      value={`$ ${value}`}
      onChangeText={(text) => onChangeText(text)}
      underlineColorAndroid="transparent"
      autoFocus={autoFocus}
      returnKeyType="done"
      onSubmitEditing={onSubmitEditing}
      placeholderTextColor={'#999999'}
      blurOnSubmit
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  'dollar-sign': {
    position: 'relative',
    fontFamily: Fonts.family.regular,
    fontWeight: '400',
    fontSize: 16,
    color: '#313334',
  },
  'text-input': {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '400',
    fontSize: 20,
    color: '#313334',
    borderBottomWidth: 1,
    borderColor: Colors.gray,
    paddingBottom: 4,
    paddingTop: 8,
    minWidth: 180,
    textAlign: 'center',
  },
});

export default CurrencyInputSell;
