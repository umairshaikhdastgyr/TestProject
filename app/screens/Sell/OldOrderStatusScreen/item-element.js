import React from 'react';
import {
  View,
  Text,

} from 'react-native';
import styles from './styles';


const ItemElement = ({
  leftLabel, rightLabel, txtType, style,
}) => (

  <View style={[style, { flexDirection: 'row', width: '100%', marginBottom: 13 }]}>
    <View style={styles.leftContainer}>
      <Text style={txtType === 'bold' ? styles.leftBoldText : styles.leftText}>{leftLabel}</Text>
    </View>
    <View style={styles.rightContainer}>
      <Text style={txtType === 'bold' ? styles.rightBoldText : styles.rightText}>{rightLabel}</Text>
    </View>
  </View>

);


export default ItemElement;
