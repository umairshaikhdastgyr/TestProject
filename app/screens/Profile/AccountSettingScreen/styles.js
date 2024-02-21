import { StyleSheet, PixelRatio } from 'react-native';
import { Colors, Fonts } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mainContentContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  titleText: {
    ...Fonts.style.h6,
    color: Colors.black,
    lineHeight: 22,
    marginTop: 10,
  },
  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  subTitleText: {
    fontSize: 11,
    fontFamily: Fonts.family.medium,
    color: Colors.active,
    marginTop: 10,
    marginBottom: 20,
  },
  separator: {
    backgroundColor: Colors.lightGrey,
    height: 1 / PixelRatio.get(),
    marginBottom: 10,
  },
  toggleContainer: {
    paddingRight: 15,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
  },
  switchContainer: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  activeItemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
  },
  rightIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
