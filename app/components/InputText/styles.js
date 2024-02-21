import { StyleSheet, Platform } from 'react-native';
import { Fonts, Colors, Metrics } from '#themes';

export const styles = StyleSheet.create({
  inputText: {
    ...Fonts.style.homiBodyTextMedium,
    //borderBottomWidth: 1,
    //borderBottomColor: Colors.inactiveShape,
    width: (Metrics.width / 3) * 2 - 30,
    alignSelf: 'center',
    color: Colors.black,
    paddingVertical: 0,
  },
  error: {
    borderBottomColor: Colors.red,
  },
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
  fullWidth: {
    width: '100%',
  },
  multiline: {
    lineHeight: 22,
  },
  container: {
    zIndex: -1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inactiveShape,
    width: (Metrics.width / 3) * 2 - 30,
    alignSelf: 'center',
    paddingBottom: Platform.OS === 'ios' ? 6 : 0,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
  },
  containerNoLine: {
    zIndex: -1,
    width: (Metrics.width / 3) * 2 - 30,
    alignSelf: 'center',
    paddingBottom: Platform.OS === 'ios' ? 6 : 0,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
  }
});
