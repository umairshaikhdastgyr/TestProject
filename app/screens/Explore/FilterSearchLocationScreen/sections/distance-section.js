import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Heading, RangeSliderInput, BodyText, Divider } from '#components';
import { margins, flex } from '#styles/utilities';
import { FAKE_DEFAULT_DISTANCE } from '#constants';

const DistanceSection = ({ distance, onChange }) => {
  return (
    <View style={styles.container}>
      <Divider style={styles.divider} />
      <View style={[flex.directionRow, flex.justifyContentSpace]}>
        <Heading type="bodyText" style={margins['mb-5']}>
          Distance Range
        </Heading>
        <BodyText size="medium">
          {distance[0] === FAKE_DEFAULT_DISTANCE
            ? 'Default'
            : distance[0] === 1
            ? `${distance[0]} mile`
            : `${distance[0]} miles`}
        </BodyText>
      </View>
      <View style={{ marginLeft: 7 }}>
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
          values={distance}
          onValuesChange={onChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    marginBottom: 20,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default DistanceSection;
