import React from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { styles } from './styles';
import { Colors } from '#themes';

const InputText = ({
  style,
  keyboardType,
  autoCapitalize,
  placeholderTextColor,
  placeholder,
  editable,
  value,
  onChangeText,
  underlineColorAndroid,
  secureTextEntry,
  multiline,
  multilineTextVerticalAlign,
  error,
  fullWidth,
  textAlign,
  autoFocus,
  numberOfLines,
  returnKeyType,
  onSubmitEditing,
  maxLength,
  bottomLine,
  bottomLineColor,
}) => (
  <View
    style={[
      bottomLine ? styles.container : styles.containerNoLine,
      fullWidth && styles.fullWidth,
      bottomLineColor &&{
        borderBottomColor:bottomLineColor
      },
    ]}
  >
    <TextInput
      style={[
        styles.inputText,
        error && styles.error,
        styles[textAlign],
        fullWidth && styles.fullWidth,
        style,
        multiline && styles.multiline,
        // multiline && { height: (numberOfLines ?? 1) * 15 },
      ]}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      value={value}
      onChangeText={onChangeText}
      underlineColorAndroid={underlineColorAndroid || 'transparent'}
      secureTextEntry={secureTextEntry}
      autoFocus={autoFocus}
      multiline={multiline}
      numberOfLines={numberOfLines}
      returnKeyType={returnKeyType ||'done'}
      onSubmitEditing={()=> onSubmitEditing?onSubmitEditing():Keyboard.dismiss()}
      maxLength={maxLength}
      editable={editable}
      textAlignVertical={multilineTextVerticalAlign ?? 'top'}
      blurOnSubmit
    />
  </View>
);

InputText.defaultProps = {
  error: false,
  textAlign: 'center',
  autoFocus: false,
  editable: true,
  onSubmitEditing: () => {},
  placeholderTextColor: Colors.inactiveText,
  bottomLine: true,
};

export default InputText;
