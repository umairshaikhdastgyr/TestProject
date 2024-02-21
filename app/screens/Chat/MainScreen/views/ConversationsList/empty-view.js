import React from 'react';

import { StyleSheet, View, Dimensions } from 'react-native';
import { EmptyState, Button } from '#components';

const SCREEN_HEIGHT = Dimensions.get("window").height - 350;

const EmptyView = ({ navigation }) => {
  const onStartSelling = () => {
    navigation.navigate('SellMain');
  };

  return (
    <View style={[styles.container, {height: SCREEN_HEIGHT}]}>
      <EmptyState
        icon="chat"
        text="You have no messages yet"
        style={styles.emptyState}
      />
      <Button 
        label="Start Selling"
        theme="secondary"
        size="large"
        onPress={onStartSelling}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    marginBottom: 24,
  },
  createButton: {
    marginBottom: 27,
  },
});

export default EmptyView;
