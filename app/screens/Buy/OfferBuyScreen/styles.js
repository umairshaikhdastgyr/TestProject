import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts } from '#themes';


export default StyleSheet.create({
  'main-container': {
    flex: 1,
  },
  'input-container': {
    paddingVertical: 10,
  },
  currencyContainer: {
  	marginTop: 20,
  	backgroundColor: '#F5F5F5',
  	paddingHorizontal: 20,
  	paddingVertical: 15,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  redText: {
    ...Fonts.style.homiTagText,
    color: Colors.red,
    textAlign: 'center',
  },
});
