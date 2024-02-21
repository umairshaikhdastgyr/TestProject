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
  icon,
}) => (

  <View style={{
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 23,
    width: '100%',
    paddingVertical: 20,
  }}
  >
    <View style={styles.leftContainer}>
      <Text style={txtType === 'bold' ? styles.leftBoldText : styles.leftText}>{leftLabel}</Text>
    </View>
    <View style={styles.rightContainer}>
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

    </View>
  </View>

);


export default PaymentMethodElement;
