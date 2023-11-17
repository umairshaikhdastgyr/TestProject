import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Colors, Styless, WP } from '../constants';
import { PButton } from './Pressable';

export const regux = {
  NUMBER: /\D/g,
  NO_SPACE: /\s/g,
};

export const InputText = forwardRef(
  ({ preAdded, defaultValue = '', sourceLeft, sourceRight, sourcePress = () => {}, inputProps = {}, validation, containerStyle, style, onChangeText, inputStyle, addInfo, infoStyle, sourceRightStyle, info }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({
      getValue() {
        return value;
      },
      clear() {
        setValue(defaultValue);
      },
    }));

    return (
      <View style={[styles.container, containerStyle]}>
        {inputProps.placeholder ? (
          <View style={styles.rowContainer}>
            <Text style={[Styless.regular(4, Colors.white), styles.marginBottom]}>{inputProps.placeholder}</Text>
            {addInfo ? <Text style={[Styless.regular(3, Colors.white), styles.marginBottom]}>{addInfo}</Text> : null}
          </View>
        ) : null}
        <View style={[styles.inputContainer, style]}>
          {sourceLeft ? (
            <Image style={[Styless.imageStyle(8), styles.leftImage]} source={sourceLeft} />
          ) : null}
          <TextInput
            value={value}
            style={[Styless.regular(3.5, Colors.white), styles.textInput, inputStyle]}
            placeholderTextColor={Colors.graytext}
            {...inputProps}
            onChangeText={(text) => {
              let validText = text;
              if (validation) {
                validText = validText.replace(validation, '');
                validText.trim();
              }
              setValue(validText);
              onChangeText && onChangeText(validText);
            }}
          />
          {sourceRight ? (
            <PButton
              onPress={sourcePress}
              style={styles.rightButton}
              imageStyle={[Styless.imageStyle(8), sourceRightStyle]}
              icon={sourceRight}
            />
          ) : null}
        </View>
        {info ? <Text style={[Styless.regular(3, Colors.white + 80), styles.info, infoStyle]}>{info}</Text> : null}
      </View>
    );
  }
);

export const InputPassword = forwardRef(
  ({ inputProps = {}, validation, containerStyle, style, onChangeText, inputStyle, info, infoStyle }, ref) => {
    const [value, setValue] = useState('');
    const [showPass, setShowPass] = useState(false);

    useImperativeHandle(ref, () => ({
      getValue() {
        return value;
      },
    }));

    return (
      <View style={[styles.container, containerStyle]}>
        {inputProps.placeholder ? (
          <Text style={[Styless.regular(4, Colors.white), styles.marginBottom]}>{inputProps.placeholder}</Text>
        ) : null}
        <View style={[styles.inputContainer, style]}>
          <TextInput
            {...(validation ? { value: value } : {})}
            style={[Styless.regular(3.5, Colors.white), styles.textInput, inputStyle]}
            placeholderTextColor={Colors.graytext}
            secureTextEntry={!showPass}
            {...inputProps}
            onChangeText={(text) => {
              const validText = text.trim();
              setValue(validText);
              onChangeText && onChangeText(validText);
            }}
          />
          <PButton
            onPress={() => {
              setShowPass((prev) => !prev);
            }}
            style={styles.passwordButton}
            imageStyle={Styless.imageStyle(8, Colors.white)}
            icon={showPass ? require('../assets/eye.png') : require('../assets/eyeCross.png')}
          />
        </View>
        {info ? <Text style={[Styless.regular(3, Colors.white + 80), styles.info, infoStyle]}>{info}</Text> : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  marginBottom: {
    marginBottom: WP(2),
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.grayMain,
    alignItems: 'center',
    borderRadius: WP(2),
    backgroundColor: Colors.secondarylight,
  },
  leftImage: {
    marginLeft: WP(4),
  },
  textInput: {
    flex: 1,
    height: WP(12),
    paddingLeft: WP(5),
  },
  rightButton: {
    backgroundColor: Colors.transparent,
    paddingHorizontal: WP(4),
  },
  passwordButton: {
    backgroundColor: Colors.transparent,
    paddingHorizontal: WP(4),
  },
  info: {
    marginLeft: WP(2),
    marginTop: WP(1),
  },
});
