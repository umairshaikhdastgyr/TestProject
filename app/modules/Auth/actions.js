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

export const signUp = payload => ({
  type: SIGN_UP,
  payload,
});

export const profileSetup = payload => ({
  type: PROFILE_SETUP,
  payload,
});

export const loginWithEmail = payload => ({
  type: LOGIN_WITH_EMAIL,
  payload,
});

export const loginWithToken = () => ({
  type: LOGIN_WITH_TOKEN,
});

export const loginWithOauth = (payload, authID,appleId ) => ({
  // authID: check if it's FB or Google 0: FB, 1: Google
  type: LOGIN_WITH_OAUTH,
  payload,
  authID,
  appleId,
});

export const verifyCode = (userId, type, params) => ({
  type: VERIFY_CODE,
  payload: {
    userId,
    type,
    params,
  },
});

export const requestCode = (payload, userID, verificationType) => ({
  type: REQUEST_CODE,
  payload,
  userID,
  verificationType,
});

export const requestPhoneCode = (payload, userID, verificationType) => ({
  type: REQUEST_PHONE_CODE,
  payload,
  userID,
  verificationType,
});

export const loadUserFromStorage = () => ({
  type: USER_FROM_STORAGE,
});

export const signOut = () => ({
  type: SIGN_OUT,
});
