import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import styles from './styles';

const RowItem = ({ leftLabel, rightLabel, txtType, style, textColor }) => (
  <View style={[style, styles.wrapper]}>
    <View style={styles.leftContainer}>
      <Text style={txtType ? styles.leftBoldText : styles.leftText }>
        {leftLabel}
      </Text>
    </View>
    <View style={styles.rightContainer}>
      <Text style={txtType ? [styles.rightBoldText,{color:textColor?textColor:'black'}] : [styles.rightText,{color:textColor?textColor:'black'}]}>
        {rightLabel}
      </Text>
    </View>
  </View>
);

RowItem.propTypes = {
  style: PropTypes.any.isRequired,
  txtType: PropTypes.bool.isRequired,
  leftLabel: PropTypes.string.isRequired,
  rightLabel: PropTypes.string.isRequired,
  textColor: PropTypes.string
};

export default RowItem;
