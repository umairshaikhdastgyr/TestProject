import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getSupplierDataApi,
  getSupplierProductListApi,
  getCatalogListApi,
  getProductsPerCatalogApi,
} from '#services/apiCatalog';

import {
  GET_SUPPLIER_DATA,
  GET_SUPPLIER_PRODUCT_LIST,
  GET_CATALOG_LIST,
  GET_PRODUCTS_PER_CATALOG,
  GET_NEXT_SUPPLIER_PRODUCT_LIST,
} from './constants';

import { success, failure } from '../utils';

function* getSupplierDataSaga({ type, payload }) {
  const data = yield call(getSupplierDataApi, payload);

  if (!data.error) {
    yield put({ type: success(type), data });
  } else {
    yield put({ type: failure(type), data });
  }
}

function* getSupplierProductListSaga({ type, payload }) {
  const data = yield call(getSupplierProductListApi, payload);

  if (!data.error) {
    yield put({ type: success(type), data });
  } else {
    yield put({ type: failure(type), data });
  }
}

function* getCatalogListSaga({ type, payload }) {
  const data = yield call(getCatalogListApi, payload);

  if (!data.error) {
    yield put({ type: success(type), data });
  } else {
    yield put({ type: failure(type), data });
  }
}

function* getProductsPerCatalogSaga({ type, payload }) {
  const data = yield call(getProductsPerCatalogApi, payload);

  if (!data.error) {
    yield put({ type: success(type), data });
  } else {
    yield put({ type: failure(type), data });
  }
}

export default function* actionWatcher() {
  yield takeLatest(GET_SUPPLIER_DATA, getSupplierDataSaga);
  yield takeLatest(GET_SUPPLIER_PRODUCT_LIST, getSupplierProductListSaga);
  yield takeLatest(GET_NEXT_SUPPLIER_PRODUCT_LIST, getSupplierProductListSaga);
  yield takeLatest(GET_CATALOG_LIST, getCatalogListSaga);
  yield takeLatest(GET_PRODUCTS_PER_CATALOG, getProductsPerCatalogSaga);
}
