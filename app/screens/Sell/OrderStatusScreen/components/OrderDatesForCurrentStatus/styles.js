import { Colors } from '#themes';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width / 3.7;
const styles = StyleSheet.create({
  tile: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
    marginBottom: 16,
    width: CARD_WIDTH,
    height: CARD_WIDTH - 12,
    marginTop: 10,
  },
  tile__body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingRight: 10,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,

    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
  },
  tile__container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tile__gray: {
    backgroundColor: '#969696',
  },
  tile__green: {
    backgroundColor: '#00BDAA',
  },
  tile_h_label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  tile_c_label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: '#313334',
    textAlign: 'center',
  },
  tile_title: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: '#313334',
  },
});

export default styles;