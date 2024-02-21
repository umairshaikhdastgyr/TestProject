import React from 'react';

import {StyleSheet, View} from 'react-native';
import {Button} from '#components';
import {flex, paddings} from '#styles/utilities';
import SmallLoader from '#components/Loader/SmallLoader';

const Footer = ({disabled, handleSubmit, isFetching}) => {
  return (
    <View style={styles.container}>
      {isFetching ? (
        <SmallLoader />
      ) : (
        <Button
          label="Add Review"
          size="large"
          fullWidth
          disabled={disabled}
          onPress={handleSubmit}
          showLoading
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...flex.directionRow,
    ...paddings['px-3'],
    ...paddings['py-4'],
    ...flex.justifyContentCenter,
    ...flex.alignItemsCenter,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {height: 10, width: 0},
    shadowOpacity: 0.12,
    shadowRadius: 54,
    elevation: 24,
  },
});

export default Footer;
