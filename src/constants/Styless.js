import {StyleSheet} from 'react-native' ;
import { Colors, WP } from '.';

const Styless = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  regular: (size, color) => ({
    fontSize: WP(size ?? 4),
    color: color ?? Colors.secondary,
    // letterSpacing:WP(0.3)
  }),

  semiBold: (size, color) => ({
    fontSize: WP(size),
    color: color ?? Colors.secondary,
    fontWeight: '500',
    // letterSpacing:WP(0.3)
  }),

  bold: (size, color) => ({
    fontSize: WP(size),
    color: color ?? Colors.secondary,
    fontWeight: '900',
    // letterSpacing:WP(0.3)
  }),

  imageStyle: (size, color) => ({
    width: WP(size),
    height: WP(size),
    resizeMode: 'contain',
    ...(color ? {tintColor : color} : {})
  })

});
export default Styless ;