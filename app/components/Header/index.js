import React from 'react';
import { TouchableOpacity, View, Text, Image, Platform } from 'react-native';
import { styles } from './styles';

export const Header = ({
  title,
  leftComponent,
  rightComponent,
  onLeftPress,
  onRightPress,
  containerStyle,
  hasShadow,
  titleTextStyle,
}) => {
  const renderLeftComponent = () => {
    if (leftComponent && onLeftPress) {
      return (
        <TouchableOpacity
          style={styles.leftTouchContainer}
          onPress={onLeftPress}
        >
          {leftComponent}
        </TouchableOpacity>
      );
    }
  };

  const renderRightComponent = () => {
    if (rightComponent && onRightPress) {
      return (
        <TouchableOpacity
          style={styles.rightTouchContainer}
          onPress={onRightPress}
        >
          {rightComponent}
        </TouchableOpacity>
      );
    }
  };
  const style = hasShadow
    ? [styles.container, styles.shadow]
    : styles.container;
  return (
    <View style={[style, containerStyle]}>
      {renderLeftComponent()}
      <Text style={[styles.headerText, titleTextStyle]}>{title}</Text>
      {renderRightComponent()}
    </View>
  );
};

export const SubHeader = ({
  title,
  onBack,
  rightComponent,
  onRightPress,
  hasShadow,
  containerStyle,
  titleTextStyle,
}) => {
  const renderRightComponent = () => {
    if (rightComponent && onRightPress) {
      return (
        <TouchableOpacity
          style={styles.rightTouchContainer}
          onPress={onRightPress}
        >
          {rightComponent}
        </TouchableOpacity>
      );
    }
  };
  const style = hasShadow
    ? [styles.container, styles.shadow]
    : styles.container;
  return (
    <View style={[style, containerStyle]}>
      <TouchableOpacity style={styles.leftTouchContainer} onPress={onBack}>
        { Platform.OS === 'ios' && 
          <Image
            source={require('../../assets/icons/icon_gray_back_ios.png')}
            style={styles.backIcon}
          />
        }
        { Platform.OS === 'android' && 
          <Image
            source={require('../../assets/icons/icon_header_back.png')}
            style={styles.backImg}
          />
        }
      </TouchableOpacity>
      <Text style={[styles.headerText, titleTextStyle]}>{title}</Text>
      {renderRightComponent()}
    </View>
  );
};
