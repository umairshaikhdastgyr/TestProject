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
  containerMore: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  arrowContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

});
