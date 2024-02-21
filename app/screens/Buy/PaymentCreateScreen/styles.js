import { StyleSheet } from 'react-native';
import { Fonts, Metrics, Colors } from '#themes';
import { flex, margins, paddings } from '#styles/utilities';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  headerContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  headerText: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    textAlign: 'center',
  },
  blackText: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
  },
  redText: {
    ...Fonts.style.homiTagText,
    color: Colors.red,
  },
  redTextRow: {
    ...Fonts.style.homiTagText,
    color: Colors.red,
    flex: 1,
  },
  cardInputContainer: {
    marginHorizontal: 20,
  },
  cardInputHeaderContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  creditIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },
  blackBoldText: {
    ...Fonts.style.headerText,
    color: Colors.black,
  },
  input: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inactiveShape,
    marginTop: 15,
  },

  input1: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inactiveShape,
    marginTop: 15,
    flex: 1,
  },
  inputsContainer: {
    flexDirection: 'row',
  },
  space: {
    width: 20,
  },
  checkContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 20,
  },
  check: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.black,
    marginRight: 10,
  },
  check1: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.active,
    marginRight: 10,
    backgroundColor: Colors.active,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  btnContainer: {
    backgroundColor: Colors.primary,
  },
  bottomDescriptionContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: Metrics.height / 15,
  },
  lockIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 5,
  },
  imgStripe: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  buttonContainer: {
    ...flex.directionRow,
    ...paddings['p-3'],
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 54,
    elevation: 10,
  },
});
