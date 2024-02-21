import React from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import { InputText, CheckBox, BodyText } from '#components';
import { Colors } from '#themes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Form = ({ formValues, setFormValue, errorBag }) => {
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="never">
      <View style={styles.inputNameWrapper}>
        <BodyText style={styles.label}>Album's Name</BodyText>
        <InputText
          placeholder="Write a nice name"
          fullWidth
          textAlign="left"
          value={formValues.name}
          onChangeText={(value) => setFormValue({ name: value })}
          maxLength={40}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.blacktoolight,
            paddingBottom: 10,
            marginBottom: 20,
          }}
        />
      </View>
      <KeyboardAwareScrollView style={styles.scrollContainer} extraHeight={230}>
        <View style={styles.inputDescriptionWrapper}>
          <InputText
            placeholder="Description"
            fullWidth
            value={formValues.description}
            onChangeText={(value) => setFormValue({ description: value })}
            multiline
            numberOfLines={12}
            multilineTextVerticalAlign="center"
            maxLength={1500}
          />
        </View>
        <View style={styles.checkBoxWrapper}>
          <CheckBox
            label="Keep this album private"
            selected={formValues.isPrivate}
            onChange={(value) => setFormValue({ isPrivate: value })}
          />
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
  },
  inputNameWrapper: {
    marginTop: 32,
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  inputDescriptionWrapper: {
    marginHorizontal: 20,
    backgroundColor: Colors.lightGrey,
  },
  checkBoxWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 8,
  },
});

export default Form;
