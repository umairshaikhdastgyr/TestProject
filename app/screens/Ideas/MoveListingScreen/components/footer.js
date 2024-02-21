import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Button } from '#components';
import { paddings } from '#styles/utilities';

const Footer = ({ handleSaveIdea }) => {
  return (
    <View style={styles.container}>
      <Button
        label="Save Idea"
        size="large"
        fullWidth
        onPress={handleSaveIdea}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...paddings['px-3'],
    ...paddings['py-4'],
  },
});

export default Footer;
