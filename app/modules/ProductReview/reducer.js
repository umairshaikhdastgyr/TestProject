import { success, failure } from '../utils';

import {
  GET_REVIEW_TOTAL,
  GET_REVIEWS,
  ADD_PRODUCT_REVIEW,
  CLEAR_ADD_PRODUCT_REVIEW,
  GET_NEXT_REVIEWS,
  GET_VERIFIED_PURCHASE_INFO,
} from './constants';

const defaultState = {
  reviewTotal: {
    isFetching: false,
    data: {
      total: '0',
      avg: '0',
    },
  },
  reviews: {
    isFetching: false,
    data: {
      data: [],
      total: 0,
    },
  },
  addProductReviewResult: {
    isFetching: false,
    failure: null,
    data: null,
  },
  verifiedPurchaseInfo: {
    isFetching: false,
    data: null,
    failure: null,
  },
};

const reducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case GET_REVIEW_TOTAL:
      return {
        ...state,
        reviewTotal: {
          ...defaultState.reviewTotal,
          isFetching: true,
        },
      };
    case success(GET_REVIEW_TOTAL):
      return {
        ...state,
        reviewTotal: {
          ...data,
          isFetching: false,
        },
      };
    case GET_REVIEWS:
      return {
        ...state,
        reviews: {
          ...defaultState.reviews.data,
          isFetching: true,
        },
      };
    case success(GET_REVIEWS):
      return {
        ...state,
        reviews: {
          total: data.total,
          data: data.data,
          isFetching: false,
        },
      };
    case success(GET_NEXT_REVIEWS):
      return {
        ...state,
        reviews: {
          ...state.reviews,
          total: data.total,
          data: [...state.reviews.data, ...data.data],
          isFetching: false,
        },
      };
    case ADD_PRODUCT_REVIEW:
      return {
        ...state,
        addProductReviewResult: {
          ...defaultState.addProductReviewResult,
          isFetching: true,
        },
      };
    case success(ADD_PRODUCT_REVIEW):
      return {
        ...state,
        addProductReviewResult: {
          ...data,
          failure: null,
          isFetching: false,
        },
      };
    case failure(ADD_PRODUCT_REVIEW):
      return {
        ...state,
        addProductReviewResult: {
          data: null,
          failure: { ...data.result },
          isFetching: false,
        },
      };
    case CLEAR_ADD_PRODUCT_REVIEW:
      return {
        ...state,
        addProductReviewResult: defaultState.addProductReviewResult,
      };
    case GET_VERIFIED_PURCHASE_INFO:
      return {
        ...state,
        verifiedPurchaseInfo: {
          ...defaultState.verifiedPurchaseInfo,
          isFetching: true,
        },
      };
    case success(GET_VERIFIED_PURCHASE_INFO):
      return {
        ...state,
        verifiedPurchaseInfo: {
          ...data,
          failure: null,
          isFetching: false,
        },
      };
    case failure(GET_VERIFIED_PURCHASE_INFO):
      return {
        ...state,
        verifiedPurchaseInfo: {
          data: null,
          failure: { ...data.result },
          isFetching: false,
        },
      };
    default:
      return state;
  }
};

export default reducer;
