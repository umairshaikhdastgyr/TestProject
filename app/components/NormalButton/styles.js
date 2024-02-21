import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '#themes';

export const styles = StyleSheet.create({
  container: {
    height: Metrics.buttonHeight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.active,
    width: Metrics.width - 100,
    alignSelf: 'center',
  },
  containerDisabled: {
    height: Metrics.buttonHeight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inactiveShape,
    width: Metrics.width - 100,
    alignSelf: 'center',
  },
  whiteBtnText: {
    ...Fonts.style.buttonText,
    color: Colors.white,
  },
});
