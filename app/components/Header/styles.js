import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '#themes';

export const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.1,
  },
  leftTouchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
  },
  rightTouchContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerText: {
    ...Fonts.style.h6,
    color: Colors.black,
  },
  backImg: {
    width: 20,
    height: 14,
    resizeMode: 'contain',
  },
});
