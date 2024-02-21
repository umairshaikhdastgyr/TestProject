import React from 'react';

import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Heading, Icon } from '#components';

const Header = ({ navigation }) => {
  return (
    <View style={styles.title}>
      <Heading type="bodyText" bold>
        Albums
      </Heading>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CreateAlbumIdeas', { type: 'create' })
        }>
        <Icon icon="add" color="grey" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Header;
