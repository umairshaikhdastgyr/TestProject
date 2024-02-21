import React from 'react';
import { func } from 'prop-types';

import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { View, Dimensions } from 'react-native';
import { Colors } from '#themes';

const RangeSliderInput = ({
  min,
  max,
  values,
  step,
  onValuesChange,
  optionsArray,
}) => {
  return (
    <View>
      <MultiSlider
        min={min}
        max={max}
        step={step}
        values={values}
        optionsArray={optionsArray}
        sliderLength={Dimensions.get('window').width - 64}
        onValuesChangeStart={() => {}}
        onValuesChange={onValuesChange}
        onValuesChangeFinish={() => {}}
        {...sliderStyles}
        allowOverlap
        snapped
        customMarker={() => (
          <View
            style={[
              sliderStyles.marker,
              { marginRight: values[0] == 4 ? 2 : -12 },
            ]}
          />
        )}
        // markerOffsetX={8}
      />
    </View>
  );
};

RangeSliderInput.propTypes = {
  onValuesChange: func.isRequired,
};

RangeSliderInput.defaultProps = {
  step: 1,
  min: 0,
  max: 10,
  values: [0],
};

const sliderStyles = {
  containerStyle: {
    flex: 1,
  },
  selectedStyle: {
    backgroundColor: Colors.active,
  },
  trackStyle: {
    backgroundColor: Colors.gray,
    height: 1,
  },
  marker: {
    backgroundColor: Colors.active,
    height: 18,
    width: 18,
    borderRadius: 18,
  },
};

export default RangeSliderInput;
