import React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { TypeTag } from '#components';
import { margins } from '#styles/utilities';

const ItemList = ({
  property,
  name,
  values,
  setFilterValue,
  onlySelection,
}) => {
  /* Methods */
  const handlePressTypeTag = option => {
    let valuesToUpdate = [...values];
    if (onlySelection && onlySelection === true) {
      if (!values.find(value => value.value === option.name)) {
        valuesToUpdate = [];
        valuesToUpdate.push({
          name: option.name,
          value: option.name,
          icon: option.iconUrl,
        });
      } else {
        valuesToUpdate = [];
      }
    } else {
      if (!values.find(value => value.value === option.name)) {
        valuesToUpdate.push({
          name: option.name,
          value: option.name,
        });
      } else {
        valuesToUpdate = valuesToUpdate.filter(
          value => value.value !== option.name,
        );
      }
    }
    setFilterValue({ [name]: valuesToUpdate });
  };
  return (
    <>
      <View style={styles.container}>
        {property.listOptions.map((option, index) => (
          <TypeTag
            key={index}
            label={option.name.trim().toUpperCase()}
            icon={option.iconUrl}
            iconActive={option.iconUrlActive}
            style={{
              ...margins['mb-4'],
              ...(index % 2 === 0 && margins['mr-4']),
            }}
            onPress={() => handlePressTypeTag(option)}
            active={values.find(value => value.value === option.name)}
          />
        ))}
        <View style={{ width: '42%' }} />
      </View>
      {property.listOptions.length === 0 && <Text>No data...</Text>}
    </>
  );
};

ItemList.defaultProps = {
  values: [],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default ItemList;
