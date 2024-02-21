import React from 'react';

import { View, TouchableOpacity } from 'react-native';
import { Icon } from '#components';
import { flex } from '#styles/utilities';

const Header = ({ navigation, handleConfirmActionLocal }) => (
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
    <TouchableOpacity
      onPress={() =>
        handleConfirmActionLocal
          ? handleConfirmActionLocal()
          : navigation.goBack()
      }
    >
      <Icon icon="close" />
    </TouchableOpacity>
  </View>
);

export default Header;
