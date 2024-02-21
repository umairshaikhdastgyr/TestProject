import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export default StyleSheet.create({
  topContainer: {
    height: 120,
    width: width - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  imgContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
  },
  imgElement: {
    width: 60,
    height: 60,
  },
  textContainer: {
    flexDirection: 'column',
    maxWidth: width - 30 - 75,
  },
  titleTextProduct: {
    fontFamily: 'Montserrat-Medium',
    fontWeight: '500',
    fontSize: 12,
    color: '#696969',
  },
  imgContainerWrapper: {
    paddingRight: 15,
  },
});
