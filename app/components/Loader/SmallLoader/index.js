import React from 'react';
import { View } from 'react-native';
import { Colors } from '#themes';
import { Utilities } from '#styles';
import { BallIndicator } from 'react-native-indicators';

const SmallLoader = ({ style }) => (
  <View
    style={{
      height: 70,
      ...style,
    }}
  >
    <View style={Utilities.style.activityContainer1}>
      <BallIndicator size={30} color={Colors.active} />
    </View>
  </View>
);
export default SmallLoader;
