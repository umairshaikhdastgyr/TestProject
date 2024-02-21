import React from 'react';
import { startCase } from 'lodash';

import { View } from 'react-native';
import { Heading, RangeSliderInput, BodyText } from '#components';
import { paddings, flex, margins } from '#styles/utilities';

const RangeSlider = ({ property, name, values, setFilterValue, min, max }) => {
  return (
    <View style={paddings['py-3']}>
      <View style={[flex.directionRow, flex.justifyContentSpace]}>
        <Heading type="bodyText" style={margins['mb-4']}>
          {startCase(property.name)}
        </Heading>
        <BodyText size="medium">
          {values[0].toLocaleString()} - {values[1].toLocaleString()}
        </BodyText>
      </View>
      <RangeSliderInput
        min={min}
        max={max}
        values={[values[0], values[1]]}
        onValuesChange={value => setFilterValue({ [name]: value })}
      />
    </View>
  );
};

export default RangeSlider;
