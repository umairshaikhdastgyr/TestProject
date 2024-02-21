import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts } from '#themes';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  productsList: {
    flex: 1,
    width: '100%',
  },
  name: {
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.medium,
    color: '#00BDAa',
  },
  tile: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    elevation: 2,
    marginHorizontal:12,
    marginBottom: 16,
    width: width / 2 - 24,
  },
  tile__picture: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tile__body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingRight: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    minHeight: 45,
  },
  tile__price: {
    paddingTop: 1,
    alignItems: 'flex-end',
  },
  tile__icons: {
    flexDirection: 'row',
  },
  icons__left: {
    marginRight: 2,
  },
  tile__like: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
  },
  tile__rightIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 10,
  },
  close_icon: {
    width: 24,
    height: 24,
    backgroundColor: '#FCFCFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.4,
    elevation: 3,
  },
  tileWithX: {
    marginRight: 28,
    marginTop: 12,
    width: width / 2 - 24 - 12,
  },
  close_Bt: {
    position: 'absolute',
    top: -9,
    right: -9,
    paddingLeft: 10,
    paddingBottom: 10,
  },
});
