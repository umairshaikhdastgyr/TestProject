import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getCategories as getCategoriesApi,
  getCategoryDetails as getCategoryDetailsApi,
} from '#services/apiCatalog';

import { GET_CATEGORIES, GET_CATEGORY_DETAILS } from './constants';
import { success, failure } from '../utils';

function* fetchCategories({ type }) {
  const response = yield call(getCategoriesApi);
  if (!response.error) yield put({ type: success(type), response });
  else yield put({ type: failure(type), response });
}

function* fetchCategoryDetails({ type, payload }) {
  const response = yield call(getCategoryDetailsApi, payload);
  yield put({ type: success(type), response });
}

export default function* actionWatcher() {
  yield takeLatest(GET_CATEGORIES, fetchCategories);
  yield takeLatest(GET_CATEGORY_DETAILS, fetchCategoryDetails);
}
