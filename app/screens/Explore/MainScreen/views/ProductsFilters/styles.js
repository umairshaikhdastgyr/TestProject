import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Colors, Fonts } from '#themes';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  headerFilter: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    height: 76,
    shadowColor: 'black',
    shadowOpacity: 0.08,
    shadowOffset: { height: 0, width: 4 },
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: 'white',
    position: 'relative',
    zIndex: 10,
  },
  inputWrapperBack: {
    marginRight: 8,
    left: -4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.inactiveText,
    height: 40,
    paddingHorizontal: 10,
    paddingRight: 4,
    borderRadius: 7,
    backgroundColor: 'white',
  },
  inputWrapperFocus: {
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 4,
  },
  safeContainer: {
    position: 'relative',
    flex: 1,
  },
  inputWrapper__input: {
    fontFamily: Fonts.family.regular,
    color: Colors.inactiveText,
    fontWeight: '400',
    fontSize: 13,
    paddingLeft: 0,
    // backgroundColor: 'yellow',
    flex: 1,
    position: 'relative',
    zIndex: 3,
    marginRight: 30,
  },
  inputWrapper__label: {
    fontFamily: Fonts.family.regular,
    color: Colors.inactiveText,
    fontSize: 13,
    position: 'absolute',
    left: 0,
    top: Platform.OS === 'ios' ? 11 : 9,
  },
  label__strong: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '500',
    color: Colors.primary,
  },
  inputActive: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '500',
    color: Colors.black,
  },
  inputWrapper__icon: {
    top: 6,
    marginRight: 10,
  },
  notificationWrapper: {
    marginLeft: 26,
    marginRight: 4,
  },
  animatedContainer: {
    backgroundColor: Colors.backgroundGrey,
    position: 'absolute',
    top: 0,
  },
  categories: {
    flexDirection: 'row',
    height: 94,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  moreFilters: {
    height: 40,
    paddingVertical: 2,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGrey,
    position: 'absolute',
    top: 94,
    width: screenWidth,
    flex: 1,
  },
  moreFilters__button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreFilters__iconFilter: {
    marginRight: 6,
  },
  moreFilters__iconLocation: {
    marginRight: 1,
  },
  search_close__icon: {
    top: 6,
    marginRight: 0,
    position: 'absolute',
    right: 2,
  },
});
