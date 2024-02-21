import React from 'react';
import { View } from 'react-native';

import { Heading, RangeSliderInput, BodyText } from '#components';
import { paddings, borders, margins, flex } from '#styles/utilities';
import { FAKE_DEFAULT_DISTANCE } from '#constants';

const DistanceRange = ({ filterValues, setFilterValue }) => {
  return (
    <View style={{ ...paddings['px-4'], ...paddings['py-5'], ...borders.bb }}>
      <View style={{ ...flex.directionRow, ...flex.justifyContentSpace }}>
        <Heading type="bodyText" style={margins['mb-4']}>
          Distance Range
        </Heading>
        <BodyText size="medium">
          {filterValues.distance[0] === FAKE_DEFAULT_DISTANCE
            ? 'Default'
            : filterValues.distance[0] === 1
            ? `${filterValues.distance} mile`
            : `${filterValues.distance} miles`}
        </BodyText>
      </View>
      <View style={{ marginLeft: 4 }}>
        <RangeSliderInput
          optionsArray={[
            1,
            3,
            5,
            10,
            30,
            50,
            100,
            300,
            500,
            FAKE_DEFAULT_DISTANCE,
          ]}
          values={filterValues.distance}
          onValuesChange={value => setFilterValue({ distance: value })}
        />
      </View>
    </View>
  );
};

export default DistanceRange;
