import {
  CREATE_ORDER,
  OFFER_ACTION,
  GET_ORDERS,
  SET_MEETUP,
  ORDER_EXCHANGE,
  PAYMENT_DEFAULT,
  GET_CARD_DETAIL,
  GET_COMPLETED_ORDER,
  SET_RETURN_ADDRESS,
  VALIDATE_ADDRESS,
  GET_SHIPPING_LABEL,
  GET_PACKING_SLIP,
  GET_ORDER_BY_ID,
  GET_RETURN_REQUEST,
  GET_RETURN_REASON,
  RETURN_ORDER_UPDATE,
  CHEAPEST_RATE,
  SET_RETURN_LABEL,
  RETURN_REQUEST,
  CLAIM_REQUEST,
  UPDATE_RETURN,
  SET_REFUND_AMOUNT,
  CLEAR_ORDER,
  SET_INDEPENDENT_SHIPPING_CARRIER,
  CLEAR_ORDERS,
  CANCEL_RETURN,
  CANCEL_CLAIM,
  DENY_CANCELLATION,
  ACCEPT_CANCELLATION,
  RAISE_DISPUTE
} from './constants';

export const createOffer = payload => ({
  type: CREATE_ORDER,
  payload,
});

export const clearOrder = () => ({
  type: CLEAR_ORDER,
});

export const getShippingLabel = payload => ({
  type: GET_SHIPPING_LABEL,
  payload,
});

export const setRefundAmount = payload => ({
  type: SET_REFUND_AMOUNT,
  payload,
});

export const setReturnLabel = payload => ({
  type: SET_RETURN_LABEL,
  payload,
});

export const updateReturn = payload => ({
  type: UPDATE_RETURN,
  payload,
});

export const cancelReturn = payload => ({
  type: CANCEL_RETURN,
  payload,
});

export const cancelClaim = payload => ({
  type: CANCEL_CLAIM,
  payload,
});

export const denyCancellation = payload => ({
  type: DENY_CANCELLATION,
  payload,
});

export const acceptCancellation = payload => ({
  type: ACCEPT_CANCELLATION,
  payload,
});

export const raiseDispute = payload => ({
  type: RAISE_DISPUTE,
  payload,
});

export const getPackingSlip = payload => ({
  type: GET_PACKING_SLIP,
  payload,
});

export const getCheapestRate = payload => ({
  type: CHEAPEST_RATE,
  payload,
});

export const returnOrderUpdate = payload => ({
  type: RETURN_ORDER_UPDATE,
  payload,
});

export const getReturnReason = payload => ({
  type: GET_RETURN_REASON,
  payload,
});

export const getReturnOrder = payload => ({
  type: GET_RETURN_REQUEST,
  payload,
});

export const getOrderById = payload => ({
  type: GET_ORDER_BY_ID,
  payload,
});

export const setReturnAddress = payload => ({
  type: SET_RETURN_ADDRESS,
  payload,
});

export const validateAddress = payload => ({
  type: VALIDATE_ADDRESS,
  payload,
});

export const getCardDetail = payload => ({
  type: GET_CARD_DETAIL,
  payload,
});

export const offerAction = payload => ({
  type: OFFER_ACTION,
  payload,
});

export const setPaymentDefault = payload => ({
  type: PAYMENT_DEFAULT,
  response: payload,
});

export const getOrders = (payload, requestTime) => ({
  type: GET_ORDERS,
  payload,
  requestTime,
  
}

);

export const clearOrders = () => ({
  type: CLEAR_ORDERS,
});

export const getCompletedOrders = payload => ({
  type: GET_COMPLETED_ORDER,
  payload,
});

export const orderExchange = payload => ({
  type: ORDER_EXCHANGE,
  payload,
});

export const setMeetup = payload => ({
  type: SET_MEETUP,
  payload,
});

export const returnRequest = payload => ({
  type: RETURN_REQUEST,
  payload,
});

export const claimRequest = payload => ({
  type: CLAIM_REQUEST,
  payload,
});

export const setIndependentShippingCarrier = ({ trackingId, carrier }) => ({
  type: SET_INDEPENDENT_SHIPPING_CARRIER,
  trackingId,
  carrier,
});
