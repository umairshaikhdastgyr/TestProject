import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '#themes';

export default StyleSheet.create({
  'main-container': {
    flex: 1,
  },
  'input-container': {
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  redText: {
    ...Fonts.style.homiTagText,
    color: Colors.red,
  },
});
