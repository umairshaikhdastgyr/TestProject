import React from 'react';

import { StyleSheet, View } from 'react-native';
import { EmptyState, Button } from '#components';
import { selectUserData } from '#modules/User/selectors';
import { useSelector } from 'react-redux';

const EmptyView = ({ navigation }) => {
  const { information: userInfo } = useSelector(
    selectUserData()
    );
  const onStartSelling = () => {
    navigation.navigate('SellMain');
  };

  return (
    <View style={styles.container}>
      <EmptyState
        icon="like"
        text={`${userInfo?.name} has no idea board`}
        style={styles.emptyState}
      />
      <Button
        label="Create an Idea Board"
        theme="secondary"
        size="large"
        style={styles.createButton}
        onPress={() =>
          navigation.navigate('CreateAlbumIdeas', { type: 'create' })
        }
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
    flex: 1,
    justifyContent: 'center',
    marginBottom: 80,
  },
  emptyState: {
    marginBottom: 24,
  },
  createButton: {
    marginBottom: 27,
  },
});

export default EmptyView;
