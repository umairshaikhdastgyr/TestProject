import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import moment from 'moment';
import _ from 'lodash';
import { LocalStorage } from '#services';
import {
  sendToken as sendTokenApi,
  deleteEndPoint as deleteEndPointApi,
  getNotification as getNotificationApi,
} from '#services/apiNotification';
import { selectNotificationData } from './selectors';

import {
  SET_TOKEN_DATA,
  GET_TOKEN_DATA,
  NOTIFICATION,
  CLEAR_NOTIFICATIONS,
  DELETE_TOKEN,
  SET_NOTIFICATIONS,
} from './constants';

import { success, failure } from '../utils';

function* getTokenData({ type }) {
  const notificationObject = yield call(LocalStorage.getNotificationData);
  if (notificationObject !== null) {
    const token = notificationObject.deviceToken;
    yield put({ type: success(type), token });
  } else {
    const token = notificationObject;
    const errorMsg = 'empty';
    yield put({ type: failure(type), errorMsg });
  }
}

function* setTokenData({ type, payload }) {

  const paramsObject = {};
  paramsObject.params = {};
  paramsObject.params.userId = payload.userId;
  paramsObject.params.kindDevice = payload.platform;
  paramsObject.params.Token = payload.token;

  const selectForNotification = (state) => state[NOTIFICATION];
  const stateData = yield select(selectForNotification);
  const newData = { ...stateData.notificationInfo };

  const response = yield call(sendTokenApi, paramsObject);
  const errorMsg = _.get(response, 'error', null);
  if (errorMsg) {
    console.info('failure to send message', errorMsg);
    yield put({ type: failure(type), errorMsg });
  } else {
    const { token } = payload;

    newData.deviceToken = token;

    yield put({ type: success(type), token });
    yield call(LocalStorage.setNotificationData, newData);
  }
}

function* deleteToken({ type, payload }) {
  const notificationObject = yield call(LocalStorage.getNotificationData);
  const token = notificationObject && notificationObject.deviceToken;

  const userObject = yield call(LocalStorage.getUserInformation);
  const userId = userObject && userObject.id;

  const payloadApi = { userId, params: { token } };
  const response = yield call(deleteEndPointApi, payloadApi);
  const errorMsg = _.get(response, 'error', null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type) });
  }
}

function* fetchNotifications({ type, payload }) {
  const data = yield call(getNotificationApi,payload);
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

export default function* actionWatcher() {
  yield takeLatest(GET_TOKEN_DATA, getTokenData);
  yield takeLatest(SET_TOKEN_DATA, setTokenData);
  yield takeLatest(DELETE_TOKEN, deleteToken);
  yield takeLatest(SET_NOTIFICATIONS, fetchNotifications);
}
