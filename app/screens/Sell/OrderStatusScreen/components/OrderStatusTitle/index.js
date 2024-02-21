import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import styles from './styles';

/** This component displays the order state and its current status */
const OrderStatusTitle = ({ orderStatusText, orderStatusValue, isLate }) => {
  return (
    <Text style={styles.statusTextTitle}>
      {orderStatusText}:{'  '}
      <Text  style={styles.statusTextValue}>
        {orderStatusValue}
      </Text>
      {isLate &&<Text style={styles.lateTextValue}>
        {' '}(LATE)
      </Text>}
    </Text>
  );
};

OrderStatusTitle.propTypes = {
  orderStatusText: PropTypes.string.isRequired,
  orderStatusValue: PropTypes.string.isRequired,
};

export default OrderStatusTitle;
