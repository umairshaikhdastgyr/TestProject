import React from 'react';

import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Heading, Icon } from '#components';

const Header = ({ navigation, formType }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon icon="back" color="grey" />
      </TouchableOpacity>
      <Heading type="h6">
        {formType === 'create' ? 'New ' : 'Edit '}
        Album
      </Heading>
      <View style={styles.helperView} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 76,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 5,
    zIndex: 2,
  },
  helperView: {
    width: 25,
  },
});

export default Header;
