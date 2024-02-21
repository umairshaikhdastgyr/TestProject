import { apiModels } from './apiModels';

export const getProductReviewTotalsApi = async ({ productId }) =>
  apiModels('accounts/productReview/totals', 'GET', { productId });

export const getProductReviewsApi = async ({ productId, page, perPage }) =>
  apiModels('accounts/productReview', 'GET', { productId, page, perPage });

export const addProductReviewApi = async ({
  productId,
  userId,
  reviewData,
  orderId,
}) =>
  apiModels('accounts/productReview', 'POST', {
    params: {
      productId,
      userId,
      reviewData,
      orderId,
    },
  });
