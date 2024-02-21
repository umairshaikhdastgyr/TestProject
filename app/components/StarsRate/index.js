import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Icon } from '#components';

const StarsRate = ({ value, style }) => {
  return (
    <View style={{ ...styles.starsRate, ...style }}>
      <Icon icon="star" color={value >= 1 ? 'active' : 'grey'} size="small" />
      <Icon icon="star" color={value >= 2 ? 'active' : 'grey'} size="small" />
      <Icon icon="star" color={value >= 3 ? 'active' : 'grey'} size="small" />
      <Icon icon="star" color={value >= 4 ? 'active' : 'grey'} size="small" />
      <Icon icon="star" color={value >= 5 ? 'active' : 'grey'} size="small" />
    </View>
  );
};

const styles = StyleSheet.create({
  starsRate: {
    flexDirection: 'row',
  },
});

export default StarsRate;
