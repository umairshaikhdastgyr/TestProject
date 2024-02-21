import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  graySmallText: {
    ...Fonts.style.label,
    textAlignVertical: 'center',
    marginLeft: 5,
    color: Colors.inactiveText,
  },
  reviewHeaderContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    height: 40,
    marginTop: 10,
  },
  contentContainer: {
    backgroundColor: Colors.creamBackground,
    flex: 1,
  },
  reviewItemContainer: {
    marginHorizontal: 20,
    minHeight: 200,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: 'rgba(0, 0, 0, 0.55)',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    marginVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  listView: {
    marginVertical: 20,
  },
  separator: {
    height: 10,
  },
  blackMediumText: {
    color: Colors.black,
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.medium,
    lineHeight: 18,
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
  space: {
    height: 20,
  },
});
