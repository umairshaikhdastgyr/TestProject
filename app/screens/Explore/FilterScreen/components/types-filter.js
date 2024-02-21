import React from 'react';
import { string, arrayOf, shape } from 'prop-types';

import { View } from 'react-native';
import { Heading, TypeTag } from '#components';
import { paddings, margins, borders, flex } from '#styles/utilities';

const TypesFilter = ({ title, options, values, setFilterValue }) => {
  /* Methods */
  const handlePressTypeTag = typeValue => {
    let valuesToUpdate = [...values];
    if (!values.find(({ id }) => id === typeValue.id)) {
      valuesToUpdate.push(typeValue);
    } else {
      valuesToUpdate = valuesToUpdate.filter(({ id }) => id !== typeValue.id);
    }
    setFilterValue({ subCategories: valuesToUpdate });
  };

  return (
    <View style={{ ...paddings['px-4'], ...paddings['py-5'], ...borders.bb }}>
      <Heading type="bodyText" style={margins['mb-5']}>
        {title}
      </Heading>
      <View style={{ ...flex.directionRowWrap, ...flex.justifyContentCenter }}>
        {options.map((option, index) => (
          <TypeTag
            key={index}
            label={option.name.trim().toUpperCase()}
            icon={option.iconUrl}
            iconActive={option.iconActiveUrl}
            style={{
              ...margins['mb-4'],
              ...(index % 2 === 0 && margins['mr-4']),
            }}
            onPress={() => handlePressTypeTag(option)}
            active={values.find(({ id }) => id === option.id)}
          />
        ))}
        <View style={{ width: '42%' }} />
      </View>
    </View>
  );
};

TypesFilter.propTypes = {
  options: arrayOf(shape({})).isRequired,
  title: string.isRequired,
};

export default TypesFilter;
