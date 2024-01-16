import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const WP = wp(100) < hp(100) ? wp : hp
const HP = wp(100) > hp(100) ? hp : wp

export {
  WP,
  HP
};
