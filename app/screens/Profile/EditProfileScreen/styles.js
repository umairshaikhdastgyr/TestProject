import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  userInfoContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 25,
    alignItems: 'center',
  },
  userImg: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 40,
  },
  userSubInfoContainer: {
    marginLeft: 20,
    justifyContent: 'space-between',
    flex: 1,
  },
  blackBoldText: {
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.semiBold,
    lineHeight: 18,
    color: Colors.black,
  },
  activeText: {
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.family.semiBold,
    lineHeight: 16,
    textDecorationLine: 'underline',
    color: Colors.active,
  },
  itemContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  blackText: {
    ...Fonts.style.homiBodyText,
    lineHeight: 18,
    color: Colors.black,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
