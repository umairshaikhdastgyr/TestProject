const family = {
  black: 'Montserrat-Black',
  bold: 'Montserrat-Bold',
  extraBold: 'Montserrat-ExtraBold',
  extraLight: 'Montserrat-ExtraLight',
  light: 'Montserrat-Light',
  medium: 'Montserrat-Medium',
  Regular: 'Montserrat-Regular',
  regular: 'Montserrat-Regular',
  semiBold: 'Montserrat-SemiBold',
  thin: 'Montserrat-Thin',
  blackItalic: 'Montserrat-BlackItalic',
  boldItalic: 'Montserrat-BoldItalic',
  extraBoldItalic: 'Montserrat-ExtraBoldItalic',
  extraLightItalic: 'Montserrat-ExtraLightItalic',
  lightItalic: 'Montserrat-LightItalic',
  mediumItalic: 'Montserrat-MediumItalic',
  regularItalic: 'Montserrat-RegularItalic',
  semiBoldItalic: 'Montserrat-SemiBoldItalic',
  thinItalic: 'Montserrat-ThinItalic',
};

const size = {
  h3: 28,
  h4: 25,
  h6: 18,
  regular: 16,
  large: 15,
  medium: 13,
  small: 10,
  tiny: 9,
};

const style = {
  h4: {
    fontSize: size.h4,
    fontFamily: family.regular,
    fontWeight: '600',
  },
  h6: {
    fontSize: size.h6,
    fontFamily: family.semiBold,
    fontWeight: '600',
  },
  homiBodyText: {
    fontSize: size.large,
    fontFamily: family.regular,
  },
  headerText: {
    fontSize: size.large,
    fontFamily: family.semiBold,
  },
  homiBodyTextMedium: {
    fontSize: size.medium,
    fontFamily: family.regular,
  },
  buttonText: {
    fontSize: size.regular,
    fontFamily: family.semiBold,
    fontWeight: '600',
  },
  instruction_Text: {
    fontSize: size.regular,
    fontFamily: family.regular,
    fontWeight: '400',
  },
  linkText: {
    fontSize: size.medium,
    fontFamily: family.regular,
    fontWeight: '500',
  },
  shareText: {
    fontSize: size.medium,
    fontFamily: family.regular,
    fontWeight: '600',
  },
  inputText: {
    fontSize: size.medium,
    fontFamily: family.regular,
    fontWeight: '500',
  },
  homiTagText: {
    fontSize: size.medium,
    fontFamily: family.regular,
  },
  notificationText: {
    fontSize: size.small,
    fontFamily: family.regular,
    fontWeight: '600',
  },
  largeBoldText: {
    fontSize: size.medium,
    fontFamily: family.semiBold,
    fontWeight: '600',
  },
  labelText: {
    fontSize: size.small,
    fontFamily: family.regular,
    fontWeight: '600',
  },
  label: {
    fontSize: size.small,
    fontFamily: family.regular,
  },
  detailText: {
    fontSize: size.tiny,
    fontFamily: family.regular,
  },
};

export default { size, style, family };
