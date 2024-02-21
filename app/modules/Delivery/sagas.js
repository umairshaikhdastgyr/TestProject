import { call, put, takeLatest } from 'redux-saga/effects';

import { getDeliveryMethods as getDeliveryMethodsApi } from '#services/apiCatalog';

import { GET_DELIVERY_METHODS } from './constants';
import { success } from '../utils';

function* fetchDeliveryMethods({ type, payload }) {
  const response = yield call(getDeliveryMethodsApi, payload);
  yield put({ type: success(type), response });
}

export default function* actionWatcher() {
  yield takeLatest(GET_DELIVERY_METHODS, fetchDeliveryMethods);
}
