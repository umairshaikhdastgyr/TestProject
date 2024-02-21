import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Button } from '#components';
import { flex, paddings } from '#styles/utilities';

const Footer = ({ handlePersistAddFilters }) => {
  return (
    <View style={styles.container}>
      <Button
        label="Save Filters"
        size="large"
        fullWidth
        onPress={handlePersistAddFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...flex.directionRow,
    ...paddings['px-3'],
    ...paddings['py-4'],
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 54,
    elevation:24,
  },
});

export default Footer;
