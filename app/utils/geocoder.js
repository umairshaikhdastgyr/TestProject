import Geocoder from 'react-native-geocoding';
import Config from '#config';

Geocoder.init(Config.googleApiKey);

/**
 *
 * @param {Object} region {latitude: number, longitude: number}
 * @param {number} distance in mile
 */
export const regionFrom = distance => {
  const latitudeDelta = (distance * 1.1) / 69;
  const longitudeDelta = (distance * 1.1) / 69;

  return {
    latitudeDelta,
    longitudeDelta,
  };
};

export default Geocoder;
