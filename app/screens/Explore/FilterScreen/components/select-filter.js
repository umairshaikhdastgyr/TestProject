import React from 'react';
import { string } from 'prop-types';
import { startCase } from 'lodash';

import { View } from 'react-native';
import { Heading, CustomSelectInput } from '#components';
import { paddings, borders, flex } from '#styles/utilities';

const SelectFilter = ({
  title,
  placeholder,
  values,
  onPress,
  disabled,
  bottomLine,
}) => {
  const valueToRender = Array.isArray(values)
    ? values.map(value => value.name).join(', ')
    : values;

  const renderAsterisk =
    title === 'make' || title === 'model' || title === 'year';

  return (
    <View style={{ ...paddings['px-4'], ...paddings['py-5'], ...borders.bb }}>
      <View style={[flex.directionRow]}>
        <Heading type="bodyText">{startCase(title)}</Heading>
        {renderAsterisk && (
          <Heading type="bodyText" style={{ color: 'red' }}>
            *
          </Heading>
        )}
      </View>
      <CustomSelectInput
        placeholder={placeholder}
        value={valueToRender}
        onPress={onPress}
        disabled={disabled}
        bottomLine={bottomLine}
      />
    </View>
  );
};

SelectFilter.propTypes = {
  title: string.isRequired,
  valueType: string,
};

SelectFilter.defaultProps = {
  values: [],
  valueType: 'array',
  bottomLine: true,
};

export default SelectFilter;
