import { StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { Colors } from '#themes';

const HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({
  'section-container': {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  'section-container-condition': {
    borderBottomWidth: 0,
  },
  'header-title-count': {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  'condition-header': {
    marginBottom: 0,
  },
  'condition-labels': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    marginLeft: -10,
    marginRight: -10,
  },
  'condition-label': {
    flex: 1,
    fontSize: 11,
    textAlign: 'left',
  },
  container: {
    flex: 1,
    minHeight: HEIGHT - 200,
  },
  'map-container': {
    flex: 1,
    minHeight: 200,
  },
  'location-header-input': {
    paddingHorizontal: 16,
    paddingVertical: 24,
    position: 'absolute',
    top: 10,
    width: '100%',
  },
  'input-search-location': {
    flex: 1,
  },
  container_iosFix: {
    // zIndex: 2,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  activeText: {
    fontWeight: 'bold',
    color: Colors.active,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  locationBtnContainer: {
    zIndex: -1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingRight: 8,
    paddingLeft: 2,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.inactiveText,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  locationBtnText: {
    color: Colors.blackLight,
  },
});
