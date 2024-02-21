import Clipboard from '@react-native-community/clipboard';
import { Alert, Linking } from 'react-native';

export const TRACKING_URL = {
  UPS: 'https://www.ups.com/track?loc=en_US&tracknum=',
  USPS: 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=',
  FedEx: 'https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=',
  DHL: 'https://www.logistics.dhl/us-en/home/tracking/tracking-freight.html?submit=1&tracking-id=',
};

export const trackOrderById = (carrier, trackingId) => {
  switch (carrier) {
    case 'ups':
      Linking.openURL(TRACKING_URL.UPS + trackingId);
      break;
    case 'fedex':
      Linking.openURL(TRACKING_URL.FedEx + trackingId);
      break;
    case 'usps':
      Linking.openURL(TRACKING_URL.USPS + trackingId);
      break;
    case 'dhl':
      Linking.openURL(TRACKING_URL.DHL + trackingId);
      break;
    default:
      Alert.alert(
        'Tracking Instruction',
        `Please user tracking number: ${trackingId} on ${carrier} website tracking`,
        [
          {
            text: 'Copy tracking number',
            onPress: () => Clipboard.setString(carrier),
          },
        ],
      );
      break;
  }
};
