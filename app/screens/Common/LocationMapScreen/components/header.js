import React from 'react';

import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Heading, Icon } from '#components';
import { paddings, flex, text } from '#styles/utilities';

const LocationMapHeader = ({ navigation }) => {
  return (
    <View
      style={{
        ...paddings['p-4'],
        ...flex.directionRow,
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon icon="back" color="grey" />
      </TouchableOpacity>
      <Heading type="h6" style={styles.heading}>
        Location
      </Heading>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    ...flex.grow1,
    ...text.center,
    paddingRight: 32,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowOffset: { height: 0, width: 5 },
    shadowRadius: 5,
  },
});

export default LocationMapHeader;
