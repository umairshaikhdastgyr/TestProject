import React from 'react';

import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Heading, Icon } from '#components';
import { paddings, flex, text } from '#styles/utilities';

const AddFilterHeader = ({ navigation }) => {
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
        Add Filter
      </Heading>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    ...flex.grow1,
    ...text.center,
    paddingRight: 32,
  },
});

export default AddFilterHeader;
