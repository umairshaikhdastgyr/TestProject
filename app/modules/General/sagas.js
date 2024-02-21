import { call, put, takeLatest } from "redux-saga/effects";

import {
  getContent as getContentApi,
  sendFeedback as sendFeedbackApi,
  sendExpression as sendExpressionApi
} from "#services/apiGeneral";
import _ from "lodash";

import { GET_CONTENT_INFO, SEND_FEEDBACK, SEND_EXPRESSION } from "./constants";
import { success, failure } from "../utils";

function* fetchContent({ type, payload }) {
  const data = yield call(getContentApi, payload);

  const errorMsg = _.get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data: data.data });
  }
}

function* sendFeedback({ type, payload }) {
  const data = yield call(sendFeedbackApi, payload);
  const errorMsg = _.get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data: data });
  }
}

function* sendExpression({ type, payload }) {
  const data = yield call(sendExpressionApi, payload);
  const errorMsg = _.get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data: data });
  }
}

export default function* actionWatcher() {
  yield takeLatest(GET_CONTENT_INFO, fetchContent);
  yield takeLatest(SEND_FEEDBACK, sendFeedback);
  yield takeLatest(SEND_EXPRESSION, sendExpression);
}
