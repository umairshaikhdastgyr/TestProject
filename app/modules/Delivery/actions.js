import { GET_DELIVERY_METHODS, CLEAR_DELIVERY } from './constants';

export const getDeliveryMethods = payload => ({
  type: GET_DELIVERY_METHODS,
  payload,
});

export const clearDelivery = () => ({
  type: CLEAR_DELIVERY,
});
