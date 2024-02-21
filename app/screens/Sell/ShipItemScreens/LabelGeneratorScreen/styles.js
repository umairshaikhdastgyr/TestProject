import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '#themes';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 72;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: '#313334',
    fontWeight: '600',
  },
  headerContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerDetailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#313334',
    lineHeight: 18,
    marginTop: 11,
    marginRight: 30,
  },
  addressListConatiner: {
    paddingHorizontal: 20,
    // flex: 1,
  },
  pdf: {
    // flex: 1,
    backgroundColor: 'red',
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth:1,
    borderBottomColor:'#E8E8E8',
  },
  activeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.active,
    backgroundColor: Colors.active,
    marginRight: 12,
  },
  addressDetailContainer: {
    marginVertical:10,
    flex: 1,
    borderRadius: 10,
  },
  addressName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: '#313334',
    fontWeight: '600',
    marginTop: 12,
  },
  adressDetail: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#313334',
    lineHeight: 18,
    marginBottom: 12,
    marginTop: 5,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginRight: 12,
  },

  addressButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth:1,
    borderBottomColor:'#E8E8E8',
    paddingVertical:20
  },
  addressButton: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 18,
    textAlign: 'center',
  },
  iconAddStyle: {
    width: 17.5,
    height: 17.5,
    marginRight: 5,
  },
  iconEditStyle: {
    width: 12,
    height: 16,
    marginRight: 5,
  },
});
export default styles;
