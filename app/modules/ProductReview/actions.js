import {
  GET_REVIEW_TOTAL,
  GET_REVIEWS,
  ADD_PRODUCT_REVIEW,
  CLEAR_ADD_PRODUCT_REVIEW,
  GET_NEXT_REVIEWS,
  GET_VERIFIED_PURCHASE_INFO,
} from './constants';

export const getReviewTotal = productId => ({
  type: GET_REVIEW_TOTAL,
  payload: {
    productId,
  },
});

export const getReviews = (productId, page, perPage) => ({
  type: GET_REVIEWS,
  payload: {
    productId,
    page,
    perPage,
  },
});

export const getNextReviews = (productId, page, perPage) => ({
  type: GET_NEXT_REVIEWS,
  payload: {
    productId,
    page,
    perPage,
  },
});

export const addProductReview = (
  productId,
  userId,
  rating,
  title,
  comment,
  size,
  image,
  orderId,
) => ({
  type: ADD_PRODUCT_REVIEW,
  payload: {
    productId,
    userId,
    orderId,
    reviewData: {
      rating,
      title,
      comment,
      size,
      image,
    },
  },
});

export const clearAddProductReview = () => ({
  type: CLEAR_ADD_PRODUCT_REVIEW,
});

export const getVerifiedPurchaseInfo = (buyerId, productId) => ({
  type: GET_VERIFIED_PURCHASE_INFO,
  payload: {
    buyerId,
    productId,
  },
});
