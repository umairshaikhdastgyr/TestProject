import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ColorTag } from '#components';
import { paddings } from '#styles/utilities';

const ColorList = ({ property, values, name, setFilterValue, onlySelection }) => {
  /* Methods */
  const handlePressTag = option => {
    let valuesToUpdate = [...values];

    if(onlySelection && onlySelection === true){
      if (!values.find(value => value.value === option.color)){
        valuesToUpdate = [];
        valuesToUpdate.push({ name: option.name, value: option.color });
      }
      else {
        valuesToUpdate = [];
      }
    }
    else {
      if (!values.find(value => value.value === option.color))
        valuesToUpdate.push({ name: option.name, value: option.color });
      else
        valuesToUpdate = valuesToUpdate.filter(
          value => value.value !== option.color,
        );
    }

    setFilterValue({ [name]: valuesToUpdate });
  };

  return (
    <View style={styles.colorsContainer}>
      {property.listOptions.map((option, index) => (
        <ColorTag
          key={index}
          label={option.name}
          value={option.color}
          width={(Dimensions.get('window').width - 96) / 4}
          margin={16}
          jump={(index + 1) % 4 === 0}
          active={values.find(value => value.value === option.color)}
          onPress={() => handlePressTag(option)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  colorsContainer: {
    ...paddings['p-4'],
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default ColorList;
