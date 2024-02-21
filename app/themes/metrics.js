import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const wscale = width / 375;
const hscale = height / 812;

const isIphoneX = () => {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || (height === 896 || width === 896))
  );
};

export default {
  width,
  height,
  buttonHeight: 52,
  calcHeight: x => PixelRatio.roundToNearestPixel(height * x) / 100,
  calcWidth: x => PixelRatio.roundToNearestPixel(width * x) / 100,
  screenHeight: Math.max(667, height),
  calcScreenHeight: x =>
    PixelRatio.roundToNearestPixel(Math.max(667, height - 40) * x) / 100,
  getBottomSpace: () => (isIphoneX() ? 34 : 0),
};

export function normalize(size, based = 'width') {
  const newSize = based === 'height' ? size * hscale : size * wscale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
