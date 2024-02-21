import { call, put, take, takeLatest } from "redux-saga/effects";
import { get } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createOrder as createOrderApi,
  getOrders as getOrdersApi,
  setMeetup as setMeetupApi,
  orderExchange as orderExchangeApi,
  orderAction as orderActionApi,
  getCardDetailById as getCardDetailByIdApi,
  getCompletedOrders as getCompletedOrdersApi,
  validateAddress as validateAddressApi,
  getShippingLabel as getShippingLabelApi,
  getPackingSlip as getPackingSlipApi,
  getOrderById as getOrderByIdApi,
  getReturnRequest as getReturnRequestApi,
  getReturnReason as getReturnReasonApi,
  returnOrderUpdate as returnOrderUpdateApi,
  getCheapestRate as getCheapestRateApi,
  claimRequest as claimRequestApi,
  returnRequest as returnRequestApi,
  updateReturn as updateReturnApi,
  confirmOrder as confirmOrderApi,
  cancelReturnRequest as cancelReturnRequestApi,
  cancelClaimRequest as cancelClaimRequestApi,
  denyCancellationRequest as denyCancellationRequestApi,
  acceptCancellationRequest as acceptCancellationRequestApi,
  raiseDisputeRequest as raiseDisputeRequestApi,
} from "#services/apiOrders";

import { updatePaymentMethod as updatePaymentMethodApi } from "#services/apiUsers";

import { updatePaymentMethod } from "#modules/User/actions";
import {
  CREATE_ORDER,
  GET_ORDERS,
  SET_MEETUP,
  ORDER_EXCHANGE,
  OFFER_ACTION,
  GET_CARD_DETAIL,
  GET_COMPLETED_ORDER,
  VALIDATE_ADDRESS,
  GET_SHIPPING_LABEL,
  GET_PACKING_SLIP,
  GET_ORDER_BY_ID,
  GET_RETURN_REQUEST,
  GET_RETURN_REASON,
  RETURN_ORDER_UPDATE,
  CHEAPEST_RATE,
  RETURN_REQUEST,
  CLAIM_REQUEST,
  CANCEL_RETURN,
  UPDATE_RETURN,
  CANCEL_CLAIM,
  CLEAR_ORDER_ERROR,
  DENY_CANCELLATION,
  ACCEPT_CANCELLATION,
  RAISE_DISPUTE,
} from "./constants";
import { success, failure } from "../utils";
import stripe from "tipsi-stripe";
import { Alert, Platform } from "react-native";
import { getOrderById } from "./actions";
import { receiveConversations } from "../Chat/sagas";

function* createOffer({ type, payload }) {
  let paymentMethodId;
  let updatedPayload = payload;

  if (
    payload?.paymentMethod?.paymentType == "applepay" ||
    payload?.paymentMethod?.paymentType == "googlepay"
  ) {
    const options = {
      total_price: payload?.params?.price,
      currency_code: "USD",
      shipping_address_required: false,
      billing_address_required: false,
      line_items: [
        {
          currency_code: "USD",
          description: payload?.params?.title,
          total_price: payload?.params?.price,
          unit_price: payload?.params?.unit_price,
          quantity: payload?.params?.quantity.toString(),
        },
      ],
    };
    let nativePayToken = "";
    const items = [{ label: "Place Order", amount: payload?.params?.price.toString() }]
    try {
      if(Platform.OS == 'android'){
        nativePayToken = yield stripe.paymentRequestWithNativePay(options);
      }else{
        try {
          nativePayToken = yield stripe.paymentRequestWithNativePay(options,items)
          stripe.completeNativePayRequest()
        } catch (error) {
          Alert.alert(`${error.message}`);
        }
      }

      updatedPayload = {
        ...updatedPayload,
        params: {
          ...updatedPayload.params,
          paymentMethodSelected: {
            ...updatedPayload.params.paymentMethodSelected,
            id: nativePayToken?.card?.cardId,
            
          },
        },
        paymentMethod: {
          ...updatedPayload.paymentMethod,
          stripeToken: nativePayToken?.tokenId,
          id: nativePayToken?.card?.cardId,
        },
      };
     
    } catch (e) {
      console.log(e);
      yield put({ type: failure(type), response: e.message });
      return;
    }
    yield call(updatePaymentMethodApi, {
      userId: payload.params.buyerId,
      body: {
        params: {
          tokenId: nativePayToken?.tokenId,
          isDefault: false,
          isNativeCard: true,
          cardId: nativePayToken?.card?.cardId,
        },
      },
      type: "card",
      method: "POST",
    });
 
    paymentMethodId = nativePayToken?.card?.cardId;
  }

  const response = yield call(createOrderApi, updatedPayload);

  const errorMsg = get(response, "result.content.message", null);
  console.info("failurexxx", errorMsg);
  if (errorMsg) {
    yield put({ type: failure(type), response });
  } else {
    if (updatedPayload.isNegotiable) {
      yield call(receiveConversations, {
        type: "RECEIVE_CONVERSATIONS",
        payload: {
          userId: updatedPayload.params.buyerId,
          lightMode: false,
          origin: "app",
        },
      });
      if (response.orderData) {
        yield put({
          type: success(type),
          response: response.orderData,
          payload:updatedPayload,
        });
      } else {
        yield put({ type: success(type), response, payload:updatedPayload });
      }

      return;
    }
    if (updatedPayload?.paymentMethod?.paymentType === "creditcard") {
      paymentMethodId = updatedPayload?.paymentMethod?.id;
    }

    if (!payload.method && response.paymentIntentToken && paymentMethodId) {
      try {
        
        const stripeResp = yield stripe.confirmPaymentIntent({
          clientSecret: response.paymentIntentToken,
          paymentMethodId,
        });

        const confrimationPayload = {
          params: {
            orderId: response.orderId,
            paidStatus: stripeResp?.status == "succeeded" ? true : false,
            paymentMethodId,
          },
        };
        const responseconfirmOrderApi = yield call(
          confirmOrderApi,
          confrimationPayload
        );
        const errorMsgconfirmOrderApi = get(
          response,
          "result.content.message",
          null
        );
        if (errorMsgconfirmOrderApi) {
          yield put({ type: failure(type), response: responseconfirmOrderApi });
        } else {
          yield call(receiveConversations, {
            type: "RECEIVE_CONVERSATIONS",
            payload: {
              userId: updatedPayload.params.buyerId,
              lightMode: false,
              origin: "app",
            },
          });
          yield put({
            type: success(type),
            response: { data: responseconfirmOrderApi },
            payload,
          });
        }
      } catch (E) {
        console.log(E);
        yield put({ type: failure(type), response: E.message });
      }
    } else {
      yield call(receiveConversations, {
        type: "RECEIVE_CONVERSATIONS",
        payload: {
          userId: updatedPayload.params.buyerId,
          lightMode: false,
          origin: "app",
        },
      });
      yield put({ type: success(type), response, payload:updatedPayload });
    }
  }
}

function* offerAction({ type, payload }) {
  const response = yield call(orderActionApi, payload);
  const errorMsg = get(response, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), response });
  } else {
    yield put({ type: success(type), payload });
  }
}

function* getOrders({ type, payload, requestTime }) {
  Object.keys(payload).forEach(
    (key) =>
      (payload[key] === undefined || payload[key] === null) &&
      delete payload[key]
  );
  const response = yield call(getOrdersApi, payload);
  //set order
  // await AsyncStorage.setItem("@orderDetails", JSON.stringify({ response }));
  const errorMsg = get(response, "result.content.message", null);
  if (errorMsg) {
    // console.info('failure', errorMsg);
    yield put({ type: failure(type), response, requestTime });
  } else {
    yield put({ type: success(type), response, requestTime });
  }
}

function* getCompletedOrders({ type, payload }) {
  const response = yield call(getCompletedOrdersApi, payload);
  const errorMsg = get(response, "result.content.message", null);
  if (errorMsg) {
    // console.info('failure', errorMsg);
    yield put({ type: failure(type), response });
  } else {
    yield put({ type: success(type), response });
  }
}

function* setMeetup({ type, payload }) {
  const response = yield call(setMeetupApi, payload);
  if (response.error === true) {
    yield put({ type: failure(type), response });
  } else {
    yield put({ type: success(type), response });
  }
}

function* orderExchange({ type, payload }) {
  const data = yield call(orderExchangeApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

function* validateAddress({ type, payload }) {
  const response = yield call(validateAddressApi, payload);
  const errorMsg = get(response, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    const value = 
    {
      validation: response?.isValid,
      validAddress: response?.address
    }
    const providerType = payload.provider
    const data =  
    {
      fedex: providerType == "fedex" ? [value] : [] ,
      ups: providerType == "ups" ? [value] : [],
      usps: providerType == "usps" ? [value] : [],
      status: response?.status
    }
    yield put({ type: success(type), data });
  }
}

function* getShippingLabel({ type, payload }) {
  const data = yield call(getShippingLabelApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

function* getPackingSlip({ type, payload }) {
  const data = yield call(getPackingSlipApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

function* getOrderDetail({ type, payload }) {
  const data = yield call(getOrderByIdApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

function* getCardDetail({ type, payload }) {
  const data = yield call(getCardDetailByIdApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    const error = get(data, "error", null);
    if (error) {
      yield put({ type: failure(type), errorMsg: error });
    } else {
      yield put({
        type: success(type),
        data,
        rediecrtParam: payload.rediecrtParam,
      });
    }
  }
}

// ----START RETURN AREA---- //

// RETURN REQUEST
function* getReturnRequest({ type, payload }) {
  const data = yield call(getReturnRequestApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

// DECLINE REASON
function* getReturnReason({ type, payload }) {
  const data = yield call(getReturnReasonApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (data?.status != 200 || errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

// SELLER REQUEST
function* returnOrderUpdate({ type, payload }) {
  const data = yield call(returnOrderUpdateApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

// CHEAPEST RATE
function* getCheapestRate({ type, payload }) {
  const data = yield call(getCheapestRateApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

// RETURN REQUEST
function* cancelReturn({ type, payload }) {
  const data = yield call(cancelReturnRequestApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    Alert.alert("Request failed", "Oops something went wrong!");
  } else {
    if (payload.orderId) {
      yield call(getOrderDetail, {
        type: "GET_ORDER_BY_ID",
        payload: { orderId: payload.orderId },
      });
    }
  }
}

function* denyCancellation({ type, payload }) {
  const data = yield call(denyCancellationRequestApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    Alert.alert("Request failed", "Oops something went wrong!");
  } else {
    if (payload.orderId) {
      yield call(getOrderDetail, {
        type: "GET_ORDER_BY_ID",
        payload: { orderId: payload.orderId },
      });
    }
  }
}

function* acceptCancellation({ type, payload }) {
  const data = yield call(acceptCancellationRequestApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    Alert.alert("Request failed", "Oops something went wrong!");
  } else {
    if (payload.orderId) {
      yield call(getOrderDetail, {
        type: "GET_ORDER_BY_ID",
        payload: { orderId: payload.orderId },
      });
    }
  }
}

// CLAIM REQUEST CANCEL
function* cancelClaim({ type, payload }) {
  const data = yield call(cancelClaimRequestApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    Alert.alert("Request failed", "Oops something went wrong!");
  } else {
    if (payload.orderId) {
      yield call(getOrderDetail, {
        type: "GET_ORDER_BY_ID",
        payload: { orderId: payload.orderId },
      });
    }
  }
}

// RETURN REQUEST
function* returnRequest({ type, payload }) {
  const data = yield call(returnRequestApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

// CLAIM REQUEST
function* claimRequest({ type, payload }) {
  const data = yield call(claimRequestApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

function* raiseDisputeRequest({ type, payload }) {
  const data = yield call(raiseDisputeRequestApi, payload);
  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
    if (payload.orderId) {
      yield call(getOrderDetail, {
        type: "GET_ORDER_BY_ID",
        payload: { orderId: payload.orderId },
      });
    }
  }
}

//RAISE_DISPUTE

// UPDATE RETURN REQUEST
function* updateReturn({ type, payload }) {
  const data = yield call(updateReturnApi, payload);

  const errorMsg = get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
    if (payload.orderId) {
      yield call(getOrderDetail, {
        type: "GET_ORDER_BY_ID",
        payload: { orderId: payload.orderId },
      });
    }
  }
}

// ----END RETURN AREA---- //

export default function* actionWatcher() {
  yield takeLatest(CREATE_ORDER, createOffer);
  yield takeLatest(OFFER_ACTION, offerAction);
  yield takeLatest(GET_ORDERS, getOrders);
  yield takeLatest(SET_MEETUP, setMeetup);
  yield takeLatest(ORDER_EXCHANGE, orderExchange);
  yield takeLatest(GET_CARD_DETAIL, getCardDetail);
  yield takeLatest(GET_COMPLETED_ORDER, getCompletedOrders);
  yield takeLatest(VALIDATE_ADDRESS, validateAddress);
  yield takeLatest(GET_SHIPPING_LABEL, getShippingLabel);
  yield takeLatest(GET_PACKING_SLIP, getPackingSlip);
  yield takeLatest(GET_ORDER_BY_ID, getOrderDetail);
  yield takeLatest(GET_RETURN_REQUEST, getReturnRequest);
  yield takeLatest(GET_RETURN_REASON, getReturnReason);
  yield takeLatest(RETURN_ORDER_UPDATE, returnOrderUpdate);
  yield takeLatest(CHEAPEST_RATE, getCheapestRate);
  yield takeLatest(RETURN_REQUEST, returnRequest);
  yield takeLatest(CLAIM_REQUEST, claimRequest);
  yield takeLatest(UPDATE_RETURN, updateReturn);
  yield takeLatest(CANCEL_RETURN, cancelReturn);
  yield takeLatest(CANCEL_CLAIM, cancelClaim);
  yield takeLatest(DENY_CANCELLATION, denyCancellation);
  yield takeLatest(ACCEPT_CANCELLATION, acceptCancellation);
  yield takeLatest(RAISE_DISPUTE, raiseDisputeRequest);
}
