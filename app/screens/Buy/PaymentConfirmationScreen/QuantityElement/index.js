import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Icon } from '#components';
import PropTypes from 'prop-types';
import { Fonts } from '#themes';

const QuantityElement = ({ quantitySelected }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{quantitySelected}</Text>
      <Icon icon="chevron-down" size="small" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    fontFamily: Fonts.family.medium,
  },
});

QuantityElement.defaultProps = {
  quantitySelected: 1,
};

QuantityElement.propTypes = {
  quantitySelected: PropTypes.number.isRequired,
};

export default QuantityElement;
