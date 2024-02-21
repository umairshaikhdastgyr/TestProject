import moment from "moment";
import { success, failure } from "../utils";
import { Platform } from "react-native";

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
  CLEAR_ORDER_ERROR,
} from "./constants";

const defaultState = {
  order: {
    isFetching: false,
    errorMsg: null,
    id: null,
    success: false,
  },
  orderDetail: {
    isFetching: false,
    failure: "",
    data: null,
  },
  ordersList: {
    isFetching: false,
    errorMsg: "",
    data: [],
    success: false,
  },
  completedOrderList: {
    isFetching: false,
    errorMsg: "",
    data: [],
    success: false,
  },
  meetup: {
    isFetching: false,
    errorMsg: "",
    data: {},
  },
  orderExchange: {
    isFetching: false,
    failure: "",
    data: null,
  },
  cardDetail: {
    isFetching: false,
    failure: "",
    data: null,
  },
  validateAddress: {
    isFetching: false,
    failure: "",
    data: null,
  },
  shippingLabel: {
    isFetching: false,
    failure: "",
    data: null,
  },
  packingSlip: {
    isFetching: false,
    failure: "",
    data: null,
  },
  returnRequest: {
    isFetching: false,
    failure: "",
    data: null,
  },
  returnReason: {
    isFetching: false,
    failure: "",
    data: null,
  },
  returnOrderUpdate: {
    isFetching: false,
    failure: "",
    data: null,
  },
  cheapestRate: {
    isFetching: false,
    failure: "",
    data: null,
  },
  claimRequest: {
    isFetching: false,
    failure: "",
    data: null,
  },
  updateReturn: {
    isFetching: false,
    failure: "",
    data: null,
  },
  returnLabel: {
    deliveryType: "",
    trackingNumber: "",
    shippingCost: "",
    provider: "",
    homitagReturnAddress: null,
    instruction: "",
    selectedCarrierItem: "",
    paymentDefault: {},
    addressObj: "",
  },
  paymentDefault: {
    state: null,
    selectedCard: { id: null },
    default: null,
    title: null,
    icon: null,
  },

  returnAddressList: [],
  independentShippingCarrier: {
    trackingId: "",
    carrier: "",
  },
  refundAmount: "",
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CLEAR_ORDER:
      return {
        ...state,
        order: defaultState.order,
      };
    case CLEAR_ORDER_ERROR:
      return {
        ...state,
        order: {
          ...state.order,
          errorMsg: null,
        },
      };
    case CREATE_ORDER:
      return {
        ...state,
        order: {
          ...state.order,
          id: null,
          errorMsg: null,
          isFetching: true,
        },
      };
    case PAYMENT_DEFAULT:
      return {
        ...state,
        paymentDefault: action.response,
      };
    case SET_RETURN_ADDRESS:
      return {
        ...state,
        returnAddressList: action.payload,
      };

    case success(CREATE_ORDER): {
      return {
        ...state,
        order: {
          ...state?.order,
          ...action?.response,
          ...action?.response?.data,
          isFetching: false,
        },
      };
    }
    case failure(CREATE_ORDER):
      return {
        ...state,
        order: {
          ...state.order,
          isFetching: false,
          errorMsg:
            action && action.response && action.response.result
              ? action?.response?.result?.content?.message
              : action.response,
        },
      };
    case GET_ORDERS:
      if (
        action.requestTime &&
        moment().diff(state?.ordersList?.requestTime, "minute") < 1
      ) {
        return {
          ...state,
        };
      }

      return {
        ...state,
        ordersList: {
          ...state.ordersList,
          data: {},
          isFetching: true,
          success: false,
          requestTime: action.requestTime,
        },
      };
    case success(GET_ORDERS):
      return {
        ...state,
        ordersList: {
          ...state.ordersList,
          isFetching: false,
          errorMsg: "",
          data: action.response.data,
          success: true,
          requestTime: action.requestTime,
          
        },
      };
    case failure(GET_ORDERS):
      return {
        ...state,
        ordersList: {
          ...state.ordersList,
          isFetching: false,
          errorMsg: action.response.result.content.message,
          requestTime: action.requestTime,
        },
      };

    case CLEAR_ORDERS:
      return {
        ...state,
        ordersList: defaultState.ordersList,
      };

    case GET_COMPLETED_ORDER:
      return {
        ...state,
        completedOrderList: {
          ...state.completedOrderList,
          data: [],
          isFetching: true,
          success: false,
        },
      };
    case success(GET_COMPLETED_ORDER):
      return {
        ...state,
        completedOrderList: {
          ...state.completedOrderList,
          isFetching: false,
          errorMsg: "",
          data: action.response.data,
          success: true,
        },
      };
    case failure(GET_COMPLETED_ORDER):
      return {
        ...state,
        completedOrderList: {
          ...state.completedOrderList,
          isFetching: false,
          errorMsg: action.response.result.content.message,
        },
      };
    case SET_MEETUP:
      return {
        ...state,
        meetup: {
          ...state.order.meetup,
          isFetching: true,
          errorMsg: "",
        },
      };
    case success(SET_MEETUP):
      return {
        ...state,
        meetup: {
          ...state.order.meetup,
          isFetching: false,
          errorMsg: "",
        },
      };
    case failure(SET_MEETUP):
      return {
        ...state,
        meetup: {
          ...state.order.meetup,
          isFetching: false,
          errorMsg: "error",
        },
      };

    case VALIDATE_ADDRESS:
      return {
        ...state,
        validateAddress: {
          ...state.validateAddress,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(VALIDATE_ADDRESS):
      return {
        ...state,
        validateAddress: {
          ...state.validateAddress,
          data: {
            ...action?.data?.fedex[0],
            ...action?.data?.ups[0],
            ...action?.data?.usps[0],
          },
          isFetching: false,
          errorMsg: null,
        },
      };
    case failure(VALIDATE_ADDRESS):
      return {
        ...state,
        validateAddress: {
          ...state.validateAddress,
          isFetching: false,
          errorMsg: action.errorMsg,
        },
      };

    case GET_SHIPPING_LABEL:
      return {
        ...state,
        shippingLabel: {
          ...state.shippingLabel,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(GET_SHIPPING_LABEL):
      return {
        ...state,
        shippingLabel: {
          ...state.shippingLabel,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case failure(GET_SHIPPING_LABEL):
      return {
        ...state,
        shippingLabel: {
          ...state.shippingLabel,
          isFetching: false,
          errorMsg: action.errorMsg,
        },
      };

    case GET_PACKING_SLIP:
      return {
        ...state,
        packingSlip: {
          ...state.packingSlip,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(GET_PACKING_SLIP):
      return {
        ...state,
        packingSlip: {
          ...state.packingSlip,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case failure(GET_PACKING_SLIP):
      return {
        ...state,
        packingSlip: {
          ...state.packingSlip,
          isFetching: false,
          errorMsg: action.errorMsg,
        },
      };

    case GET_RETURN_REQUEST:
      return {
        ...state,
        returnRequest: {
          ...state.returnRequest,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(GET_RETURN_REQUEST):
      return {
        ...state,
        returnRequest: {
          ...state.returnRequest,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case failure(GET_RETURN_REQUEST):
      return {
        ...state,
        returnRequest: {
          ...state.returnRequest,
          isFetching: false,
          errorMsg: action.errorMsg,
        },
      };

    case GET_RETURN_REASON:
      return {
        ...state,
        returnReason: {
          ...state.returnReason,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(GET_RETURN_REASON):
      return {
        ...state,
        returnReason: {
          ...state.returnReason,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case failure(GET_RETURN_REASON):
      return {
        ...state,
        returnReason: {
          ...state.returnReason,
          isFetching: false,
          errorMsg: action.errorMsg,
        },
      };

    case RETURN_ORDER_UPDATE:
      return {
        ...state,
        returnOrderUpdate: {
          ...state.returnOrderUpdate,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(RETURN_ORDER_UPDATE):
      return {
        ...state,
        returnOrderUpdate: {
          ...state.returnOrderUpdate,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case failure(RETURN_ORDER_UPDATE):
      return {
        ...state,
        returnOrderUpdate: {
          ...state.returnOrderUpdate,
          isFetching: false,
          errorMsg: action.errorMsg,
        },
      };

    case CHEAPEST_RATE:
      return {
        ...state,
        cheapestRate: {
          ...state.cheapestRate,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(CHEAPEST_RATE):
      return {
        ...state,
        cheapestRate: {
          ...state.cheapestRate,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case failure(CHEAPEST_RATE):
      return {
        ...state,
        cheapestRate: {
          ...state.cheapestRate,
          isFetching: false,
          errorMsg: action.errorMsg,
        },
      };

    case GET_ORDER_BY_ID:
      return {
        ...state,
        orderDetail: {
          ...state.orderDetail,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(GET_ORDER_BY_ID):
      return {
        ...state,
        orderDetail: {
          ...state.orderDetail,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case failure(GET_ORDER_BY_ID):
      return {
        ...state,
        orderDetail: {
          ...state.orderDetail,
          isFetching: false,
          errorMsg: action.errorMsg,
        },
      };

    case GET_CARD_DETAIL:
      return {
        ...state,
        cardDetail: {
          ...state.order.cardDetail,
          isFetching: true,
          errorMsg: "",
        },
      };
    case success(GET_CARD_DETAIL):
      return {
        ...state,
        cardDetail: {
          ...state.order.cardDetail,
          isFetching: false,
          errorMsg: "",
          data: action.data.data,
        },
      };
    case failure(GET_CARD_DETAIL):
      return {
        ...state,
        cardDetail: {
          ...state.order.cardDetail,
          isFetching: false,
          errorMsg: "error",
        },
      };

    case ORDER_EXCHANGE:
      return {
        ...state,
        orderExchange: {
          ...state.orderExchange,
          isFetching: true,
          data: null,
          failure: null,
        },
      };
    case success(ORDER_EXCHANGE):
      return {
        ...state,
        orderExchange: {
          ...state.orderExchange,
          isFetching: false,
          failure: null,
          data: action.data,
        },
      };
    case failure(ORDER_EXCHANGE):
      return {
        ...state,
        orderExchange: {
          ...state.orderExchange,
          isFetching: false,
          failure: action.errorMsg,
        },
      };
    case OFFER_ACTION:
      return {
        ...state,
        order: {
          id: null,
          errorMsg: null,
          isFetching: true,
          success: false,
        },
      };
    case success(OFFER_ACTION):
      return {
        ...state,
        order: {
          ...state.order,
          id: action.payload.orderId,
          errorMsg: null,
          isFetching: false,
          success: true,
        },
      };
    case failure(OFFER_ACTION):
      return {
        ...state,
        order: {
          ...state.order,
          isFetching: false,
          errorMsg: action.response.result.content.message,
        },
      };
    case SET_RETURN_LABEL:
      return {
        ...state,
        returnLabel: action.payload,
      };
    case RETURN_REQUEST:
      return {
        ...state,
        returnRequest: {
          ...state.returnRequest,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(RETURN_REQUEST):
      return {
        ...state,
        returnRequest: {
          ...state.returnRequest,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case failure(RETURN_REQUEST):
      return {
        ...state,
        returnRequest: {
          ...state.returnRequest,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case CLAIM_REQUEST:
      return {
        ...state,
        returnRequest: {
          ...state.returnRequest,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(CLAIM_REQUEST):
      return {
        ...state,
        claimRequest: {
          ...state.claimRequest,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case failure(CLAIM_REQUEST):
      return {
        ...state,
        claimRequest: {
          data: null,
          isFetching: false,
          errorMsg: action.errorMsg,
        },
      };
    case UPDATE_RETURN:
      return {
        ...state,
        updateReturn: {
          ...state.updateReturn,
          isFetching: true,
          data: null,
          errorMsg: "",
        },
      };
    case success(UPDATE_RETURN):
      return {
        ...state,
        updateReturn: {
          ...state.updateReturn,
          data: action.data.data,
          isFetching: false,
          errorMsg: null,
        },
        returnRequest: {
          ...state.returnRequest,
          data: action.data.data,
        },
      };
    case failure(UPDATE_RETURN):
      return {
        ...state,
        updateReturn: {
          ...state.updateReturn,
          data: action.data,
          isFetching: false,
          errorMsg: null,
        },
      };
    case SET_REFUND_AMOUNT:
      return {
        ...state,
        refundAmount: action.payload,
      };
    case SET_INDEPENDENT_SHIPPING_CARRIER:
      return {
        ...state,
        independentShippingCarrier: {
          trackingId: action.trackingId,
          carrier: action.carrier,
        },
      };

    default:
      return state;
  }
};

export default reducer;
