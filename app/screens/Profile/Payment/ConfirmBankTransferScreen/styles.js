import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    // marginBottom: 120
  },
  headerContainer: {
    marginTop: 30,
    marginBottom: 10,
  },
  blackText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
  },
  textViewContainer: {
    marginTop: 35,
    height: 50,
    justifyContent: 'space-between',
  },
  blackBoldText: {
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.medium,
    color: Colors.black,
  },
  blackSmallText: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
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
  checkContainer: {
    flexDirection: 'row',
    marginTop: 30,
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
});
