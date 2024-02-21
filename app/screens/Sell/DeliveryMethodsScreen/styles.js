import { StyleSheet } from 'react-native';
import { Colors } from '#themes';

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
  titleText: {
  	paddingVertical: 15,
  },
  scrollContainer: {
    paddingHorizontal: 20
  }
});
