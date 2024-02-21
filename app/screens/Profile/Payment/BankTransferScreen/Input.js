import React, { useRef } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Fonts } from '#themes';

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  inputContainerDisable: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    backgroundColor:Colors.grey,
  },
  blackText: {
    color: Colors.black,
    ...Fonts.style.homiTagText,
  },
  input: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    paddingBottom:0,
    paddingLeft:0,
    height: 35,
  },
});

const Input = ({
  label,
  value,
  onChangeText,
  keyboardType,
  placeholder,
  secureTextEntry,
  editable,
  maxLength,
  length,
  newstyle,
  multiline
}) => {
  const inputEl = useRef(null);

  const onPress = () => {
    inputEl.current.focus();
  };

  return (
    <TouchableOpacity
      style={[{...newstyle},editable?styles.inputContainer:styles.inputContainerDisable]}
      activeOpacity={1}
      onPress={onPress}
    >
      <TextInput
        ref={inputEl}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        underlineColorAndroid="transparent"
        pointerEvents="none"
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        editable={editable}
        returnKeyType="default"
        multiline={multiline?true:false}
        maxLength={maxLength ? length : 150}
        placeholderTextColor={'#999999'}
      />
    </TouchableOpacity>
  );
};

export default Input;
