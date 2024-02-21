import React from 'react';

import { StyleSheet, View, Platform } from 'react-native';
import { Icon } from '#components';

const CloseImage = ({ style }) => {
  return (
    <View style={ Platform.OS === 'ios' ? styles.closeButtonIOS : styles.closeButtonAndroid }>
      <Icon icon="close" />
    </View>
  );
};

const styles = StyleSheet.create({
  closeButtonAndroid: {
    paddingLeft: 0,
  },
  closeButtonIOS: {
    paddingLeft: 16,
  },

});

export default CloseImage;
