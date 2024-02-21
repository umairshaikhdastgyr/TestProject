import { Colors, fonts } from '#themes';
import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  imageContainer: {
    flex: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray,
  },
  topLeftIcon: {
    position: 'absolute',
    top: 20,
    zIndex: 2,
    left: 20,
  },
  topRightIcon: {
    position: 'absolute',
    top: 20,
    zIndex: 2,
    right: 20,
  },
  loadingText: {
    fontFamily: fonts.family.Regular,
    fontSize: fonts.size.regular,
    color: Colors.black,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginTop: 10,
  },
  bottomStripContainer: {
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 20,
  },
  cameraView: { flex: 1, width: '100%', height: '100%' },
  allowCameraButton: {
    backgroundColor: Colors.active,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  allowCameraText: { color: Colors.white },
  bottomBoxButtons: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyOutlineButton: {
    borderColor: Colors.active,
    borderWidth: 2,
    borderRadius: 45,
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    backgroundColor: Colors.active,
    borderRadius: 75,
    height: 75,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollWhiteBKG: { position: 'absolute', backgroundColor: Colors.white, bottom: 0, height: 80, width: '100%' },
  scrollViewStyle: { width: '100%', backgroundColor: '#00000000', position: 'absolute', bottom: 0 },
  scrollViewContentStyle: { paddingTop: 10, paddingRight: 10 },
  closeBox: {
    position: 'absolute',
    top: -10,
    zIndex: 2,
    elevation: 2,
    right: -10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  scrollImage: { width: 80, height: 80 },
});