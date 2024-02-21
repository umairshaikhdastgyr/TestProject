import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const ItemElement = ({
  containerStyle,
  leftLabel,
  rightLabel,
  txtType,
  rightContainer: RightContainer,
  rightContainerStyle,
  rightContainerOnPress,
}) => (
  <View
    style={
      containerStyle
        ? [
            {
              flexDirection: 'row',
              width: '100%',
              marginTop: 15,
              alignItems: 'center',
            },
            containerStyle,
          ]
        : {
            flexDirection: 'row',
            width: '100%',
            marginTop: 15,
            alignItems: 'center',
          }
    }
  >
    <View style={styles.leftContainer}>
      <Text style={txtType === 'bold' ? styles.leftBoldText : styles.leftText}>
        {leftLabel}
      </Text>
    </View>
    {RightContainer ? (
      <RightContainer
        style={rightContainerStyle}
        onPress={rightContainerOnPress}
      >
        {rightLabel}
      </RightContainer>
    ) : (
      <View style={styles.rightContainer}>
        <Text
          style={txtType === 'bold' ? styles.rightBoldText : styles.rightText}
        >
          {rightLabel}
        </Text>
      </View>
    )}
  </View>
);

ItemElement.defaultProps = {
  leftLabel: '',
  rightLabel: '',
};

export default ItemElement;
