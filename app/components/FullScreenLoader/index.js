import React from 'react';

import { StyleSheet, ActivityIndicator, View, Dimensions, Modal } from 'react-native';
import { Colors } from '#themes';

const screenHeight = Math.round(Dimensions.get('window').height);

const FullScreenLoader = ({ isVisible }) => {
  return (
    <Modal 
      visible={isVisible}
      animationType={'none'}
      transparent={true}
    >
      <View style={{ ...styles.loader }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loader: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  fullScreen: {
    flex: 1,
  },
});

export default FullScreenLoader;
