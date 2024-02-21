import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts } from '#themes';
import { flex, paddings } from '#styles/utilities';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
  },
  topContainer: {
    height: 120,
    width: (width - 30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    // marginBottom: 38,
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
  inputNameWrapper: {
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputDescriptionWrapper: {
    paddingHorizontal: 20,
    height: 120,
    paddingBottom: 40,
    backgroundColor: Colors.lightGrey,
  },
  checkBoxWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 8,
  },
  blackBoldText: {
    ...Fonts.style.headerText,
    color: Colors.black,
  },
  reasonContainer: {
    marginVertical: 20,
    height: 180,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  bottomContainer: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  buttonContainer: {
    height: 100,
    ...flex.directionRow,
    ...paddings['p-3'],
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 54,
    elevation: 10,
  },
  btnContainer: {
    backgroundColor: Colors.primary,
  },
  btnContainer1: {
    backgroundColor: Colors.inactiveShape,
  },
  boostModal:{
    flex:1
  },
  modalContentContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
}, 
});

export default styles;
