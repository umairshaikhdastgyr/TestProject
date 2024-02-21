import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import styles from './styles';

const { width } = Dimensions.get('window');

const PurchasedItem = ({ leftLabel, rightLabel, txtType }) => (
  <View
    style={{
      flexDirection: 'row',
      width: width - 32,
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View>
      <Text style={txtType === 'bold' ? styles.leftBoldText : styles.leftText}>
        {leftLabel}
      </Text>
    </View>
    <View style={{ marginLeft: 5 }}>
      <Text style={styles.rightText}>{rightLabel}</Text>
    </View>
  </View>
);

export default PurchasedItem;
