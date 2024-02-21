import { success, failure } from '../utils';

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
} from './constants';

const defaultState = {
  isFetchingAuth: false,
  isFetchingProfile: false,
  isFetchingSignIn: false,
  isFetchingSignUp: false,
  isFetchingVerify: 0, // 0: initial, 1: verify code, 2: sending
  token: null,
  refresh_token: null,
  failure: null,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SIGN_UP:
      return {
        ...state,
        isFetchingSignUp: true,
        failure: null,
      };
    case success(SIGN_UP):
      return {
        ...state,
        isFetchingSignUp: false,
        token: action.data.token,
        refresh_token: action.data.refresh_token,
        failure: null,
      };
    case failure(SIGN_UP):
      return {
        ...state,
        isFetchingSignUp: false,
        failure: action.errorMsg,
      };
    case PROFILE_SETUP:
      return {
        ...state,
        isFetchingProfile: true,
        failure: null,
      };
    case success(PROFILE_SETUP):
      return {
        ...state,
        isFetchingProfile: false,
        failure: null,
      };
    case failure(PROFILE_SETUP):
      return {
        ...state,
        isFetchingProfile: false,
        failure: action.errorMsg,
      };
    case LOGIN_WITH_EMAIL:
      return {
        ...state,
        isFetchingSignIn: true,
        failure: null,
      };
    case success(LOGIN_WITH_EMAIL):
      return {
        ...state,
        isFetchingSignIn: false,
        token: action.data.token,
        refresh_token: action.data.refresh_token,
        failure: null,
      };
    case failure(LOGIN_WITH_EMAIL):
      return {
        ...state,
        isFetchingSignIn: false,
        failure: action.errorMsg,
      };
    case LOGIN_WITH_TOKEN:
      return {
        ...state,
        isFetchingAuth: true,
        failure: null,
      };
    case success(LOGIN_WITH_TOKEN):
      return {
        ...state,
        isFetchingAuth: false,
        failure: null,
        token: action.data.token,
        refresh_token: action.data.refresh_token,
      };
    case failure(LOGIN_WITH_TOKEN):
      return {
        ...state,
        isFetchingAuth: false,
        failure: action.errorMsg,
      };
    case LOGIN_WITH_OAUTH:
      return {
        ...state,
        isFetchingAuth: true,
        failure: null,
      };
    case success(LOGIN_WITH_OAUTH):
      return {
        ...state,
        isFetchingAuth: false,
        failure: null,
        token: action.data.token,
        refresh_token: action.data.refresh_token,
      };
    case failure(LOGIN_WITH_OAUTH):
      return {
        ...state,
        isFetchingAuth: false,
        failure: action.errorMsg,
      };
    case VERIFY_CODE:
      return {
        ...state,
        isFetchingVerify: 1,
        failure: null,
      };
    case success(VERIFY_CODE):
      return {
        ...state,
        isFetchingVerify: 0,
        failure: null,
      };
    case failure(VERIFY_CODE):
      return {
        ...state,
        isFetchingVerify: 0,
        failure: action.errorMsg,
      };
    case REQUEST_CODE:
      return {
        ...state,
        isFetchingVerify: 2,
        failure: null,
      };
    case REQUEST_PHONE_CODE:
      return {
        ...state,
        isFetchingVerify: 3,
        failure: null,
      };
    case success(REQUEST_CODE):
      return {
        ...state,
        isFetchingVerify: 0,
        failure: null,
      };
    case failure(REQUEST_CODE):
      return {
        ...state,
        isFetchingVerify: 0,
        failure: action.errorMsg,
      };
    case USER_FROM_STORAGE:
      return {
        ...state,
        failure: null,
      };
    case success(USER_FROM_STORAGE):
      return {
        ...state,
        failure: null,
        user: action.user,
      };
    case failure(USER_FROM_STORAGE):
      return {
        ...state,
        failure: action.errorMsg,
      };
    case SIGN_OUT:
      return {
        ...defaultState,
      };
    default:
      return state;
  }
};

export default reducer;
