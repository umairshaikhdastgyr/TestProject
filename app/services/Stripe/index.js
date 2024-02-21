import stripe from 'tipsi-stripe';
import { initializeStripe } from '../../config/configStripe';
// initializeStripe();
export const createTokenWithBankOrCard = async ({ params, type }) => {
  try {
    const token =
      type === 'card'
        ? await stripe.createTokenWithCard(params)
        : await stripe.createTokenWithBankAccount(params);
    return { token, success: true };
  } catch (err) {
    return { errMsg: err.message, success: false };
  }
};
