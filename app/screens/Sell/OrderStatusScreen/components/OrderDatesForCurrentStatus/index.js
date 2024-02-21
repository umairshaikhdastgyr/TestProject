import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import styles from './styles';

const OrderDatesForCurrentStatus = ({ month, header, active, day }) => (
  <View>
    <Text style={styles.tile_title}>{header}</Text>
    <View style={[styles.tile]}>
      <View
        style={[
          styles.tile__body,
          active ? styles.tile__green : styles.tile__gray,
        ]}
      >
        <Text style={styles.tile_h_label}>{month}</Text>
      </View>
      <View style={styles.tile__container}>
        <Text style={styles.tile_c_label}>{day}</Text>
      </View>
    </View>
  </View>
);

OrderDatesForCurrentStatus.defaultProps = {
  theme: 'primary',
};

OrderDatesForCurrentStatus.propTypes = {
  theme: PropTypes.string,
  day: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  month: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default OrderDatesForCurrentStatus;
