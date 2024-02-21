import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  reviewItemContainer: {
    marginHorizontal: 20,
    minHeight: 200,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    marginVertical: 5,
    paddingHorizontal: 20,
  },
  space: {
    height: 20,
  },
  blackBoldText: {
    color: Colors.black,
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.semiBold,
    lineHeight: 18,
    textAlign: 'center',
  },
  separator: {
    height: 10,
  },
  grayText: {
    ...Fonts.style.homiTagText,
    color: Colors.inactiveText,
    textAlign: 'center',
    lineHeight: 16,
  },
  grayText1: {
    ...Fonts.style.homiTagText,
    color: Colors.inactiveText,
    lineHeight: 16,
  },
  reviewerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  reviewerImg: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    borderRadius: 22.5,
  },
  reviewerImgContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
  },
  reviewerSubContainer: {
    marginLeft: 10,
    height: 40,
    justifyContent: 'space-between',
  },
  blackMediumText: {
    color: Colors.black,
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.medium,
    lineHeight: 18,
  },
  moreIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  rightIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
