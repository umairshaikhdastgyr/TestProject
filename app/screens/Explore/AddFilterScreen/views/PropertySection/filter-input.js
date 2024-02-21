import React from 'react';

import {StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';
import {Icon} from '#components';
import {Colors, Fonts} from '#themes';

const FilterInput = ({value, setValue, nameProperty}) => {
  return (
    <View style={styles.filterContainer}>
      <View style={styles.inputWrapper}>
        <Icon icon="search" color="grey" style={styles.inputWrapper__icon} />
        <TextInput
          placeholderTextColor={'#999999'}
          placeholder={`Search ${nameProperty}`}
          style={styles.inputWrapper__input}
          value={value}
          onChangeText={val => setValue(val)}
        />
        {value !== '' && (
          <TouchableOpacity
            style={{marginTop: 7, marginRight: 3}}
            onPress={() => {
              setValue('');
            }}>
            <Icon icon="close" color="grey" />
          </TouchableOpacity>
        )}
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
    shadowColor: 'black',
    shadowOffset: {height: 0, width: 2},
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
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

export default FilterInput;
