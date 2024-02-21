import { call, put, takeLatest } from "redux-saga/effects";
import _ from "lodash";

import {
  signUp as signUpApi,
  loginWithEmail as loginWithEmailApi,
  loginWithToken as loginWithTokenApi,
  verifyCode as verifyCodeApi,
  requestCode as requestCodeApi,
  updateProfile as updateProfileApi,
} from "#services/api";
import { LocalStorage } from "#services";
import {
  SIGN_UP,
  PROFILE_SETUP,
  LOGIN_WITH_EMAIL,
  LOGIN_WITH_TOKEN,
  LOGIN_WITH_OAUTH,
  VERIFY_CODE,
  REQUEST_CODE,
  USER_FROM_STORAGE,
  SIGN_OUT,
  REQUEST_PHONE_CODE,
} from "./constants";
import { SET_USER_INFORMATION, CLEAR_USER } from "../User/constants";
import { CLEAR_SELL } from "../Sell/constants";
import { CLEAR_POSTS } from "../Posts/constants";
import { CLEAR_IDEAS } from "../Ideas/constants";
import { CLEAR_FILTERS } from "../Filters/constants";
import { CLEAR_DELIVERY } from "../Delivery/constants";
import { CLEAR_CHAT } from "../Chat/constants";
import { CLEAR_CATEGORIES } from "../Categories/constants";
import { CLEAR_NOTIFICATIONS, DELETE_TOKEN } from "../Notifications/constants";

import { success, failure } from "../utils";
import { removeToken, setToken } from "#services/httpclient/clientHelper";

function* signUp({ type, payload }) {
  const data = yield call(signUpApi, payload);
  const errorMsg = _.get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield call(LocalStorage.setUserInformation, data.user);
    yield call(LocalStorage.setTokens, data.token, data.refresh_token);
    setToken(data.token);

    yield put({
      type: SET_USER_INFORMATION,
      information: { ...data.user, justSignUp: true },
    });
    yield put({ type: success(type), data });
  }
}

function* profileSetup({ type, payload }) {
  const data = yield call(updateProfileApi, payload?.body?.params || payload);
  const errorMsg = _.get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield call(LocalStorage.setUserInformation, data);
    yield put({ type: SET_USER_INFORMATION, information: data });
    yield put({ type: success(type), data });
  }
}

function* loginWithEmail({ type, payload }) {
  const data = yield call(loginWithEmailApi, payload);

  const errorMsg = _.get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield call(LocalStorage.setUserInformation, data.user);
    yield call(LocalStorage.setTokens, data.token, data.refresh_token);
    setToken(data.token);
    yield put({ type: SET_USER_INFORMATION, information: data.user });
    yield put({ type: success(type), data });
  }
}

function* loginWithToken({ type }) {
  const user = yield call(LocalStorage.getUserInformation);
  const tokens = yield call(LocalStorage.getTokens);
  if (user && tokens) {
    const params = {
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
      client_id: user.email,
      client_secret: user.passwordSalt,
    };
    const data = yield call(loginWithTokenApi, params);
    if (
      data.error != "token_not_expired" ||
      data.error == "user_with_not_valid_token" ||
      data.error === "invalid_refresh_token"
    ) {
      yield call(LocalStorage.clearUserInformation);
    }
    if (data.error === "token_not_expired") {
      yield put({ type: SET_USER_INFORMATION, information: user });
      yield put({ type: success(type), data: tokens });
    } else if (data.error === "invalid_refresh_token") {
      yield put({ type: failure(type), errorMsg: null });
    } else {
      yield put({ type: SET_USER_INFORMATION, information: data.user });
      yield put({ type: success(type), data });
    }
  } else {
    yield put({ type: failure(type), errorMsg: null });
  }
}

function* loginWithOauth({ type, payload, authID, appleId }) {
  let customEmail;
  if (authID === 0) {
    customEmail =
      payload.first_name.toLowerCase() +
      payload.last_name.toLowerCase() +
      "@gmail.com";
  }
  const email =
    authID === 0
      ? payload.email
        ? payload.email
        : customEmail
      : _.get(payload, "email", null);
  const id = authID === 0 ? payload.id : _.get(payload, "id", null);
  const firstName =
    authID === 0 ? payload.first_name : _.get(payload, "givenName", "");
  const lastName =
    authID === 0 ? payload.last_name : _.get(payload, "familyName", null);
  const profilepictureurl =
    authID === 0
      ? _.get(payload, "picture.data.url", null)
      : _.get(payload, "photo", null);

  const params = { email, password: id };
  const data = yield call(loginWithEmailApi, params);
  const errorMsg = _.get(data, "result.content.message", null);
  if (errorMsg) {
    const parameter = {
      firstName,
      lastName,
      email,
      password: id,
      profilepictureurl,
    };
    if (
      errorMsg == "Your account is deleted!" ||
      errorMsg == "User is deleted!"
    ) {
      yield put({ type: failure(type), errorMsg });
      return;
    }
    if (authID === 0) {
      parameter.facebookaccount = id;
    } else if (appleId && appleId == 1 && authID == 1) {
      parameter.appleaccount = id;
    } else {
      parameter.googleaccount = id;
    }
    const signUpData = yield call(signUpApi, { params: parameter });
    const signUpErrorMsg = _.get(signUpData, "result.content.message", null);
    if (signUpErrorMsg) {
      yield put({ type: failure(type), errorMsg: signUpErrorMsg });
    } else {
      yield call(LocalStorage.setUserInformation, signUpData.user);
      yield call(
        LocalStorage.setTokens,
        signUpData.token,
        signUpData.refresh_token
      );
      setToken(signUpData.token);
      yield put({ type: SET_USER_INFORMATION, information: signUpData.user });
      yield put({ type: success(type), data: signUpData });
    }
  } else {
    yield call(LocalStorage.setUserInformation, data.user);
    yield call(LocalStorage.setTokens, data.token, data.refresh_token);
    setToken(data.token);
    yield put({ type: SET_USER_INFORMATION, information: data.user });
    yield put({ type: success(type), data });
  }
}

function* verifyCode({ type, payload }) {
  const data = yield call(
    verifyCodeApi,
    payload.userId,
    payload.type,
    payload.params
  );
  const errorMsg = _.get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    yield put({ type: success(type), data });
  }
}

function* requestCode({ type, payload, userID, verificationType }) {
  const data = yield call(requestCodeApi, payload, userID, verificationType);
  const errorMsg = _.get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else {
    if (verificationType === "email") {
      yield put({ type: success(type), data });
    }
  }
}

function* requestPhoneCode({ type, payload, userID, verificationType }) {
  const data = yield call(requestCodeApi, payload, userID, verificationType);
  const errorMsg = _.get(data, "result.content.message", null);
  if (errorMsg) {
    yield put({ type: failure(REQUEST_CODE), errorMsg });
  } else {
    yield put({ type: success(REQUEST_CODE), data });
  }
}

function* loadUserFromStorage({ type }) {
  const user = yield call(LocalStorage.getUserInformation);
  if (user) {
    yield put({ type: SET_USER_INFORMATION, information: user });
    yield put({ type: success(type), user });
  } else {
    yield put({ type: SET_USER_INFORMATION, information: user });
    yield put({ type: failure(type), errorMsg: null });
  }
}

function* signOut() {
  try {
    yield put({ type: DELETE_TOKEN });
    yield put({ type: CLEAR_USER });
    yield put({ type: CLEAR_SELL });
    yield put({ type: CLEAR_POSTS });
    yield put({ type: CLEAR_IDEAS });
    yield put({ type: CLEAR_FILTERS });
    yield put({ type: CLEAR_DELIVERY });
    yield put({ type: CLEAR_CHAT });
    yield put({ type: CLEAR_CATEGORIES });
    yield put({ type: CLEAR_NOTIFICATIONS });
    yield call(LocalStorage.clearSignOut);
    removeToken();
  } catch (e) {
    console.info("e failure signOut", e);
  }
}

export default function* actionWatcher() {
  yield takeLatest(SIGN_UP, signUp);
  yield takeLatest(PROFILE_SETUP, profileSetup);
  yield takeLatest(LOGIN_WITH_EMAIL, loginWithEmail);
  yield takeLatest(LOGIN_WITH_TOKEN, loginWithToken);
  yield takeLatest(LOGIN_WITH_OAUTH, loginWithOauth);
  yield takeLatest(VERIFY_CODE, verifyCode);
  yield takeLatest(REQUEST_CODE, requestCode);
  yield takeLatest(REQUEST_PHONE_CODE, requestPhoneCode);
  yield takeLatest(USER_FROM_STORAGE, loadUserFromStorage);
  yield takeLatest(SIGN_OUT, signOut);
}
