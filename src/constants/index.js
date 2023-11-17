// @flow
import Colors from './Colors';
import {Variables , AsyncContants} from './Variables';
import Styless from './Styless' ;
import ApiController from './ApiController' ;
import Helper from './Helper' ;
import { widthPercentageToDP } from 'react-native-responsive-screen';

const WP = (value) => {
  return widthPercentageToDP(value)
}

export {
  Colors,
  Styless,
  Variables,
  AsyncContants,
  ApiController,
  Helper,
  WP
};
