import stripe from 'tipsi-stripe';
import config from './index';
export const initializeStripe = () =>{
  stripe.setOptions({
    publishableKey: config.stripePublishableKey,
    androidPayMode: 'test',
    merchantId: 'merchant.com.homitag.app'
  });
}