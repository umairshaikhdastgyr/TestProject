import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getSearchTextSuggestions as getSearchTextSuggestionsApi,
  getMaxPricePerCategory as getMaxPricePerCategoryApi,
  abortFecth as abortFecthApi,
  getCustomFilterOptionsList as getCustomFilterOptionsListApi,
  getModelsByMake as getModelsByMakeApi,
} from '#services/apiCatalog';

import {
  GET_SEARCH_TEXT_SUGGESTIONS,
  GET_MAX_PRICE_PER_CATEGORY,
  GET_CUSTOM_FILTER_OPTIONS_LIST,
  GET_MODELS_BY_MAKE,
} from './constants';
import { success, failure } from '../utils';

function* fetchSearchTextSuggestions({ type, payload }) {
  // Abort fetch in testing
  yield call(abortFecthApi);

  const data = yield call(getSearchTextSuggestionsApi, payload);
  if (!data.error) yield put({ type: success(type), payload: data });
  else yield put({ type: failure(type), payload: data });
}

function* fetchMaxPricePerCategory({ type, payload }) {
  const data = yield call(getMaxPricePerCategoryApi, payload);
  //let data = {};
  //data.data = {};
  //data.data.max = 1000000;
  if (!data.error) yield put({ type: success(type), payload: data });
  else yield put({ type: failure(type), payload: data });
}

function* fetchCustomFilterOptionsList({ type, payload }) {
  
  const data = yield call(getCustomFilterOptionsListApi, payload);
  if (!data.error)
    yield put({
      type: success(type),
      payload: { ...data, filterName: payload.name },
    });
  else yield put({ type: failure(type), payload: data });
}

function* fetchModelsByMake({ type, payload }) {
  const data = yield call(getModelsByMakeApi, payload);
  if (!data.error)
    yield put({
      type: success(type),
      payload: { ...data, ...payload },
    });
  else yield put({ type: failure(type), payload: data });
}

export default function* actionWatcher() {
  yield takeLatest(GET_SEARCH_TEXT_SUGGESTIONS, fetchSearchTextSuggestions);
  yield takeLatest(GET_MAX_PRICE_PER_CATEGORY, fetchMaxPricePerCategory);
  yield takeLatest(
    GET_CUSTOM_FILTER_OPTIONS_LIST,
    fetchCustomFilterOptionsList,
  );
  yield takeLatest(GET_MODELS_BY_MAKE, fetchModelsByMake);
}
