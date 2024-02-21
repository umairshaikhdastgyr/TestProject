import * as React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '#themes';

const Toast = ({
  message,
  isVisible,
  autoHideMs,
  success,
  containerStyle,
  textStyle,
  linkLabel,
  linkStyle,
  linkOnPress,
  onAnimationEnd
}) => {
  const { useState, useEffect, useCallback } = React;

  const [translateY] = useState(new Animated.Value(-100));

  useEffect(
    useCallback(() => {
      const runAnimation = () => {
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -100,
            duration: 1000,
            useNativeDriver: true,
            delay: autoHideMs,
          }),
        ]).start(() => {onAnimationEnd && onAnimationEnd()});
      };
      if(isVisible){
        runAnimation();
      }
      
    }, [isVisible]),
  );

  const renderLabel = () => {
    if (linkLabel) {
      return (
        <TouchableOpacity
          hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
          onPress={linkOnPress}
        >
          <Text style={linkStyle ? { ...linkStyle } : styles.linkLabel}>
            {linkLabel}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  if (!isVisible) return <></>;

  return (
    <Animated.View
      style={
        containerStyle
          ? { ...containerStyle }
          : success
          ? [
              styles.container,
              styles.containerSuccess,
              {
                transform: [
                  {
                    translateY,
                  },
                ],
              },
            ]
          : [
              styles.container,
              {
                transform: [
                  {
                    translateY,
                  },
                ],
              },
            ]
      }
    >
      <Text style={textStyle ? { ...textStyle } : styles.content}>
        {message}
      </Text>
      {renderLabel()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('screen').width,
    backgroundColor: Colors.red,
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 9999,
  },
  containerSuccess: {
    backgroundColor: 'green',
  },
  content: {
    color: Colors.white,
    marginBottom: 5,
  },
  linkLabel: {
    textDecorationLine: 'underline',
    color: Colors.white,
  },
});

Toast.defaultProps = {
  message: '',
  isVisible: false,
  autoHideMs: 2500,
};

Toast.proptypes = {
  message: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  success: PropTypes.bool,
  cotainerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  autoHideMs: PropTypes.number,
  linkLabel: PropTypes.string,
  linkStyle: PropTypes.object,
  linkOnPress: PropTypes.func,
};

export default Toast