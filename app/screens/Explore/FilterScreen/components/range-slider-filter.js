import React from 'react';
import { string } from 'prop-types';
import { startCase } from 'lodash';

import { View } from 'react-native';
import { Heading, RangeSliderInput, BodyText } from '#components';
import { paddings, borders, margins, flex } from '#styles/utilities';

const RangeSliderFilter = ({
  title,
  min,
  max,
  symbol,
  values,
  onValuesChange,
}) => {

  //let defaultValue = false;
  //if(values && values[0] === min && values[1] === max){
  //  defaultValue = true;
  //}

  return (
    <View style={[paddings['px-4'], paddings['py-5'], borders.bb]}>
      <View style={[flex.directionRow, flex.justifyContentSpace]}>
        <Heading type="bodyText" style={margins['mb-4']}>
          {startCase(title)}
        </Heading>
          {values && (
            <BodyText size="medium">
              {symbol} {values[0].toLocaleString()} - {symbol} {values[1].toLocaleString()}
            </BodyText>
          )}
      </View>
      <View style={{marginLeft: 5}}>
        <RangeSliderInput
          min={min}
          max={max === 0 ? 1 : max}
          values={values}
          onValuesChange={onValuesChange}
        />
      </View>
    </View>
  );
};

RangeSliderFilter.propTypes = {
  title: string.isRequired,
};

export default RangeSliderFilter;
