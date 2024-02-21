import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Tag } from '#components';
import { paddings } from '#styles/utilities';

const VerticalList = ({ property, values, setFilterValue, name, onlySelection }) => {
  /* Methods */
  const handlePressTag = option => {
    let valuesToUpdate = [...values];
    if(onlySelection && onlySelection === true){
      if (!values.find(value => value.value === option)){
        valuesToUpdate = [];
        valuesToUpdate.push({ name: option, value: option });
      }
      else {
        valuesToUpdate = [];
      }
    } else {
      if (!values.find(value => value.value === option))
        valuesToUpdate.push({ name: option, value: option });
      else valuesToUpdate = valuesToUpdate.filter(value => value.value !== option);
    }
    setFilterValue({ [name]: valuesToUpdate });
  };

  return (
    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 0}}>
      <View style={styles.colorsContainer}>
        {property.listOptions && property.listOptions.map((option, index) => (
          <Tag
            key={index}
            label={option}
            active={values.find(value => value.value === option)}
            onPress={() => handlePressTag(option)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  colorsContainer: {
    ...paddings['p-4'],
  },
});

export default VerticalList;
