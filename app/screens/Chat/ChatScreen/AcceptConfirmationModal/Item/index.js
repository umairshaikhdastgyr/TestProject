import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types'

const { width } = Dimensions.get('window');

const Item = ({ leftLabel, rightLabel, txtType }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width,
        marginTop: 15,
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
        <Text
          style={styles.rightText}
        >
          {rightLabel}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  leftBoldText: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    fontSize: 15,
  },
  leftText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
  },
  rightText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
  }
})

Item.defaultProps = {
  leftLabel: '',
  rightLabel: '',
  txtType: ''
}

Item.propTypes = {
  leftLabel: PropTypes.string.isRequired, 
  rightLabel: PropTypes.string.isRequired, 
  txtType: PropTypes.string.isRequired
}

export default Item;
