import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '#themes';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  'main-container': {
    flex: 1,
  },
  'input-container': {
    paddingVertical: 10,
  },
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
  },
  imgElement: {
    width: 60,
    height: 60,
  },
  textsContainer: {
    flexDirection: 'column',
    maxWidth: width - 30 - 75,
  },
  imgsContainer: {
    paddingRight: 15,
  },
  currencyContainer: {
    marginTop: 20,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    zIndex: 3,
    flexGrow: 1,
  },
  input: {
    marginTop: 15,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});
