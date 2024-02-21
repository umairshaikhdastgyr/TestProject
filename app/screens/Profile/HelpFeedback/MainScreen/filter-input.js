import React, { useState, useEffect } from 'react';
import { Icon } from '#components';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';
const FilterInput = ({ searchText, setSearchText, placeholder }) => {
  const [isFilterFocused, setIsFilterFocused] = useState(false);
  return (
    <View style={styles.headerFilter}>
      <View
        style={[
          styles.inputWrapper,
          isFilterFocused && styles.inputWrapperFocus,
        ]}>
        <View style={styles.safeContainer}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={'#999999'}
            style={[
              styles.inputWrapper__input,
              searchText && styles.inputActive,
            ]}
            onFocus={() => setIsFilterFocused(true)}
            returnKeyLabel="Search"
            returnKeyType="search"
            value={searchText}
            onChangeText={value => setSearchText(value)}
            onSubmitEditing={() => setIsFilterFocused(false)}
            onBlur={() => setIsFilterFocused(false)}
          />

          {!isFilterFocused && (
            <TouchableOpacity style={styles.search_close__icon}>
              <Icon icon="search" color="grey" />
            </TouchableOpacity>
          )}
          {searchText !== '' && isFilterFocused === true && (
            <TouchableOpacity
              style={styles.search_close__icon}
              onPress={() => {
                setSearchText('');
              }}>
              <Icon icon="close" color="grey" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default FilterInput;
