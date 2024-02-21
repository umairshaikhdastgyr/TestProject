import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Fonts, Colors, Metrics } from '#themes';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  topContainer: {
    height: 120,
    width: (width - 30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  imgsContainer: {
    paddingRight: 15,
  },
  imgContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imgElement: {
    width: 60,
    height: 60,
  },
  textsContainer: {
    flexDirection: 'column',
    maxWidth: (width - 30 - 75),
  },
});
