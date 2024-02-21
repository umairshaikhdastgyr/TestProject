import { StyleSheet, Dimensions } from 'react-native';

import { Fonts, Colors } from '#themes';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  tile: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
    marginRight: 16,
    marginBottom: 16,
    width: width / 2 - 24,
  },
  tile__picture: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tile__body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingRight: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    minHeight: 45,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tile__price: {
    paddingTop: 1,
    alignItems: 'flex-end',
  },
  tile__icons: {
    width: '100%',
  },
  tile__container: {
    height: 110,
    alignItems: 'center',
  },
  tile__gray: {
    backgroundColor: '#969696',
  },
  tile__green: {
    backgroundColor: '#00BDAA',
  },
  icons__center: {
    marginTop: 10,
    marginBottom: 10,
    tintColor: '#969696',
  }, 
  icons__gray: {
    tintColor: '#969696',
  },
  icons_green: {
    tintColor: '#00BDAA',
  },
  tile__innerText: {
    fontSize: 13, 
    textAlign: 'center', 
    color: '#313334', 
    lineHeight: 20,
  },
});
