import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getProductReviewTotalsApi,
  getProductReviewsApi,
  addProductReviewApi,
} from '#services/apiReviews';

import {
  GET_REVIEW_TOTAL,
  GET_REVIEWS,
  ADD_PRODUCT_REVIEW,
  GET_NEXT_REVIEWS,
  GET_VERIFIED_PURCHASE_INFO,
} from './constants';

import { success, failure } from '../utils';
import { getOrders } from '#services/apiOrders';

function* fetchProductReviewTotalsSaga({ type, payload }) {
  const data = yield call(getProductReviewTotalsApi, payload);

  if (!data.error) {
    yield put({ type: success(type), data });
  } else {
    yield put({ type: failure(type), data });
  }
}

function* fetchProductReviewsSaga({ type, payload }) {
  const data = yield call(getProductReviewsApi, payload);

  if (!data.error) {
    yield put({ type: success(type), data });
  } else {
    yield put({ type: failure(type), data });
  }
}

function* addProductReviewSaga({ type, payload }) {
  const data = yield call(addProductReviewApi, payload);

  if (data?.result?.success === false) {
    yield put({ type: failure(type), data });
  } else {
    yield put({ type: success(type), data });
  }
}

function* getVerifiedPurchaseInfoSaga({ type, payload }) {
  const data = yield call(getOrders, payload);

  if (data?.result?.content?.message) {
    yield put({ type: failure(type), data });
  } else {
    yield put({ type: success(type), data });
  }
}



export default function* actionWatcher() {
  yield takeLatest(GET_REVIEW_TOTAL, fetchProductReviewTotalsSaga);
  yield takeLatest(GET_REVIEWS, fetchProductReviewsSaga);
  yield takeLatest(GET_NEXT_REVIEWS, fetchProductReviewsSaga);
  yield takeLatest(ADD_PRODUCT_REVIEW, addProductReviewSaga);
  yield takeLatest(GET_VERIFIED_PURCHASE_INFO, getVerifiedPurchaseInfoSaga);
}
