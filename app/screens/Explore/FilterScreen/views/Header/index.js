import React from 'react';

import { View, TouchableOpacity } from 'react-native';
import { Heading, Icon } from '#components';
import { paddings, flex } from '#styles/utilities';

const FilterHeader = ({ handleCloseFilter }) => {
  return (
    <View
      style={{
        ...paddings['p-4'],
        ...flex.directionRow,
        ...flex.justifyContentSpace,
      }}
    >
      <Heading type="h6">Filter</Heading>
      <TouchableOpacity onPress={handleCloseFilter}>
        <Icon icon="close" />
      </TouchableOpacity>
    </View>
  );
};

export default FilterHeader;
