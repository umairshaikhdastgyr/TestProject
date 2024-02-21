import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  mainContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  blackText: {
    color: Colors.black,
    ...Fonts.style.homiBodyText,
  },
  bottomBtnContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  btnContainer: {
    backgroundColor: Colors.primary,
  },
  btnContainer1: {
    backgroundColor: Colors.inactiveShape,
  },
});
