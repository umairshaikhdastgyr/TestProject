import React from 'react';

import { StyleSheet, View, TextInput } from 'react-native';
import { Icon } from '#components';
import { Colors, Fonts } from '#themes';

const TagTypeOptionsFilter = ({ value, setValue }) => {
  return (
    <View style={styles.filterContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholderTextColor={'#999999'}
          placeholder="Looking for something?"
          style={styles.inputWrapper__input}
          value={value}
          onChangeText={val => setValue(val)}
        />
        <Icon icon="search" color="grey" style={styles.inputWrapper__icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    height: 72,
    padding: 16,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.inactiveText,
    height: 40,
    paddingHorizontal: 10,
    paddingRight: 4,
    borderRadius: 7,
    backgroundColor: 'white',
  },
  inputWrapper__input: {
    fontFamily: Fonts.family.regular,
    color: Colors.inactiveText,
    fontSize: 13,
    flex: 1,
  },
  inputWrapper__icon: {
    top: 6,
  },
});

export default TagTypeOptionsFilter;
