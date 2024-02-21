import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';
import { Fonts } from '../../../themes';
import { Icon, BodyText } from '../../../components';


const PaymentMethodElement = ({
  leftLabel, title,
  txtType,
  icon, onPress,
}) => (

  <View style={{
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 23,
    width: '100%',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E8E8E8',
  }}
  >
    <View style={styles.leftContainer}>
      <Text style={txtType === 'bold' ? styles.leftBoldText : styles.leftText}>{leftLabel}</Text>
    </View>
    <TouchableOpacity style={styles.rightContainer} onPress={onPress}>
      <View style={styles.rightContentIcon}>
        <Icon icon={icon} style={[{ top: -4 }, title === 'Apple pay' && styles.appleIcon]} />
      </View>
      <View style={styles.rightContentText}>
        <BodyText
          theme="large"
          bold
          align="right"
          numberOfLines={1}
          style={[styles.titleText]}
        >
          {title}

        </BodyText>
      </View>
      <View style={styles.arrowContainer}>
        <Icon icon="chevron-right" />
      </View>
    </TouchableOpacity>
  </View>

);


export default PaymentMethodElement;
