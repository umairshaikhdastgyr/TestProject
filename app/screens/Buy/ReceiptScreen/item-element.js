import React from 'react';
import {
  View,
  Text,

} from 'react-native';
import styles from './styles';


const ItemElement = ({
  leftLabel, rightLabel,
  txtType, float,
}) => (

  <View style={{ flexDirection: 'row', width: '100%', marginBottom: 18 }}>
    <View style={[styles.leftContainer, float === 'left' && {
      // justifyContent: 'flex-start',
      flex: 0,
      // backgroundColor: 'red',
    }]}
    >
      <Text style={txtType === 'bold' ? styles.leftBoldText : styles.leftText}>{leftLabel}</Text>
    </View>
    <View style={[styles.rightContainer, float === 'left' && {
      justifyContent: 'flex-start',
      flex: 1,
      // backgroundColor: 'red',
    }]}
    >
      <Text style={!float && txtType === 'bold' ? styles.rightBoldText : styles.rightText}>{rightLabel}</Text>
    </View>
  </View>

);


export default ItemElement;
