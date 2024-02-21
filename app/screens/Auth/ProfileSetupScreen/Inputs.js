import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Colors, Fonts, Metrics } from "#themes";
import PhoneInput from "#components/PhoneInput/lib";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: Metrics.height / 30,
  },
  inputLabel: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    marginBottom: 5,
  },
  inputText: {
    fontSize: Fonts.size.large,
    color: Colors.black,
    fontFamily: Fonts.family.regular,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingVertical: 5,
    paddingLeft: 0,
  },
  phoneInputContainer: {
    paddingVertical: 5,
    paddingLeft: 0,
  },
  phoneInputText: {
    fontSize: Fonts.size.large,
    color: Colors.black,
    fontFamily: Fonts.family.regular,
    paddingLeft: 5,
  },
});

export const PhoneNumberInput = ({ value, onChangeText, setPhoneRef }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>Phone number</Text>
      <PhoneInput
        ref={setPhoneRef}
        style={styles.phoneInputContainer}
        textStyle={styles.phoneInputText}
        placeholder="Mobile"
        name="Phone"
        label="Mobile"
        keyboardType="numeric"
        onChangePhoneNumber={onChangeText}
        value={value}
        maxLength={value.startsWith("+1") ? 12 : 20}
      />
    </View>
  );
};

export const BirthdayInput = ({ value, onShowDatePicker }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={onShowDatePicker}
    activeOpacity={1}
  >
    <Text style={styles.inputLabel}>Birthdate</Text>
    <TextInput
      placeholderTextColor={Colors.inactiveText}
      placeholder="YYYY-MM-DD"
      style={styles.inputText}
      keyboardType="numeric"
      value={value}
      editable={false}
      pointerEvents="none"
    />
  </TouchableOpacity>
);

export const LocationInput = ({ value, onPress }) => (
  <TouchableOpacity
    style={styles.container}
    activeOpacity={1}
    onPress={onPress}
  >
    <Text style={styles.inputLabel}>Location</Text>
    <TextInput
      style={styles.inputText}
      value={value}
      editable={false}
      underlineColorAndroid="transparent"
      pointerEvents="none"
      placeholderTextColor={Colors.inactiveText}
      placeholder="City, State"
      returnKeyType="done"
      onSubmitEditing={() => {
        Keyboard.dismiss();
      }}
      blurOnSubmit
    />
  </TouchableOpacity>
);
