import { StyleSheet } from 'react-native';
import { Metrics, Colors, Fonts } from '#themes';

export const styles = StyleSheet.create({
	container: {
    	flex: 1,
    	backgroundColor: Colors.white,
  	},
  	headerContainer: {
	    height: Metrics.calcScreenHeight(32),
	    backgroundColor: Colors.primary,
	    alignItems: 'center',
	    justifyContent: 'center',
	},
	logoImg: {
	    height: Metrics.height / 12,
	    resizeMode: 'contain',
	},
	scrollContainer: {
	    flex: 1,
	    paddingLeft: 20,
	    paddingRight: 20,
	    alignItems: 'center',
	    justifyContent: 'center',
	},
	text: {
	    fontFamily: Fonts.family.regular,
	    fontSize: 13,
	    textAlign: 'center',
	    color: Colors.black,
	    marginBottom: 50,
	},
	textTitle: {
		fontFamily: Fonts.family.regular,
	    fontSize: 16,
	    fontWeight: '500',
	    textAlign: 'center',
	    color: Colors.black,
	    marginBottom: 20,
	},
	textSubTitle: {
		fontFamily: Fonts.family.regular,
	    fontSize: 16,
	    fontWeight: '500',
	    textAlign: 'center',
	    color: Colors.black,
	    marginBottom: 15,
	}
});