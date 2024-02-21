import React from 'react';

import { View, TouchableOpacity } from 'react-native';
import { Icon } from '#components';
import { paddings, flex } from '#styles/utilities';

const Header = ({ navigation }) => (
  <View
    style={{
      paddingHorizontal: 20,
      paddingVertical: 10,
      ...flex.directionRow,
      ...flex.justifyContentSpace,
      borderBottomColor: '#dedede',
      borderBottomWidth: 1,
    }}
  >
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon icon="close" />
    </TouchableOpacity>

  </View>
);

export default Header;
