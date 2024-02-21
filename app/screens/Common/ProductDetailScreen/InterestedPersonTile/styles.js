import { StyleSheet } from 'react-native';

import { Fonts, Colors } from '#themes';

export default StyleSheet.create({
  tileContainer: {
    flex: 1,
    height: 87,

    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  tileBaseElement: {
    flex: 1,
    flexDirection: 'row',
  },
  leftContainer: {
    width: 57,
    overflow: 'hidden',
    borderRadius: 28.5,
    borderWidth: 0.5,
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 15,
  },
  starContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 5,
    // height: 30,
  },
  graySmallText: {
    textDecorationLine: 'underline',
    ...Fonts.style.label,
    textAlignVertical: 'center',
    marginLeft: 5,
    color: Colors.inactiveText,
  },
  rightContainer: {
    width: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listImg: {
    width: 66,
    height: 66,
    resizeMode: 'contain',
    borderRadius: 33,
    alignSelf:'center',
    overflow: 'hidden',
    borderColor: '#fff',
  },
  titleText: {
    fontFamily: Fonts.family.regular,
    color: '#313334',
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 7,
  },
  msgText: {
    fontFamily: Fonts.family.regular,
    color: '#969696',
    fontWeight: 'normal',
    fontSize: 13,
    textAlign: 'left',
  },
  titleTextBadge: {
    fontFamily: Fonts.family.semiBold,
    color: '#313334',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 7,
  },
  msgTextBadge: {
    fontFamily: Fonts.family.semiBold,
    color: '#969696',
    fontWeight: '500',
    fontSize: 13,
    textAlign: 'left',
  },
  timeText: {
    fontFamily: Fonts.family.regular,
    color: '#313334',
    fontWeight: 'normal',
    fontSize: 10,
    textAlign: 'right',
  },
  timeTextBadge: {
    fontFamily: Fonts.family.semiBold,
    color: '#00BDAA',
    fontWeight: '600',
    fontSize: 10,
    textAlign: 'right',
  },
  badgeContainer: {
    height: 18,
    minWidth: 18,
    backgroundColor: '#FF5556',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 7,
    position: 'absolute',
    right: 0.3,
    bottom: 8,
  },
  badgeText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 11,
    fontFamily: Fonts.family.regular,
    fontWeight: 'normal',
    marginHorizontal: 5,
  },
  badgeContainerEmpty: {
    height: 20,
    minWidth: 20,
    backgroundColor: 'transparent',
    marginTop: 7,
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button__text: {
    ...Fonts.style.buttonText,
    fontFamily: Fonts.family.semiBold,
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  button__icon: {
    marginRight: 4,
    marginTop: -1,
  },
  large: {
    height: 52,
    borderRadius: 10,
  },
  'button__text-large': {
    fontSize: 16,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  'button__text-secondary': {
    color: Colors.primary,
  },
  'secondary-active': {
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.active,
  },
  'button__text-secondary-active': {
    color: Colors.active,
  },
  fullWidth: {
    width: '100%',
  },
  'secondary-rounded': {
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.active,
    borderRadius: 20,
  },
  'button__text-secondary-rounded': {
    color: Colors.black,
  },
  'button__icon-secondary-rounded': {
    marginRight: 8,
    marginTop: -2,
  },
  subLabel: {
    height: 52,
  },
  subLabelText: {
    textAlign: 'center',
    fontFamily: Fonts.family.semiBold,
    fontWeight: '600',
    fontSize: 10,
    color: 'white',
    marginTop: 4,
  },
});
