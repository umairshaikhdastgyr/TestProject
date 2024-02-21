import { StyleSheet } from 'react-native';
import { Fonts, Metrics, Colors } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  blackBoldText: {
    color: Colors.black,
    ...Fonts.style.headerText,
    textAlign: 'center',
  },
  headerContainer: {
    marginVertical: 30,
    marginHorizontal: 5,
    flexDirection:'column'
  },
  blackText: {
    color: Colors.black,
    ...Fonts.style.homiBodyText,
    lineHeight: 18,
  },
  descriptionContainer: {
    marginHorizontal: 20,
  },
  bottomBtnsContaienr: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnContainer1: {
    backgroundColor: Colors.primary,
    width: '90%',
    marginBottom:20
  },
  btnContainer2: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginVertical: 30,
  },
  primaryColor: {
    color: Colors.primary,
  },
  closeIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  headerRightContainer: {
    marginRight: 10,
  },
});
