import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '#themes';
import fonts from '#themes/fonts';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  'main-container': {
    flex: 1,
  },
  'input-container': {
    paddingVertical: 10,
  },
  bodyContainer: {
    flex: 1,
  },
  labelContainer: {
    paddingHorizontal: 20,
    marginBottom: 0,
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
  },
  bottomContainer: {
  	flex: 1,
  	justifyContent: 'flex-end',
  },
  objContainer: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.33)',
    marginHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  objContainerSelected: {
    borderRadius: 4,
    marginHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    backgroundColor: '#ffffff',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  tintStyle: {
    tintColor: '#00BDAA',
  },

  container: {
    flexDirection: 'column',
    paddingVertical: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  leftContainer: {
    width: 40,
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  arrowContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  titleText: {
    marginBottom: 5,
    color: '#000000',
    fontFamily:fonts.family.Regular
  },
  titleSelected: {
    fontFamily:fonts.family.semiBold
  },
  appleIcon: {
    width: 15.31,
    height: 19,
    marginLeft: 5,
  },

});
