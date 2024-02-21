import {
  SET_TOKEN_DATA,
  GET_TOKEN_DATA,
  CLEAR_NOTIFICATIONS,
  DELETE_TOKEN,
  SET_NOTIFICATIONS,
} from './constants';

export const getTokenData = () => ({
  type: GET_TOKEN_DATA,
});

export const setTokenData = (payload) => ({
  type: SET_TOKEN_DATA,
  payload,
});

export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS,
});

export const getNotificationList = (payload) => ({
  type: SET_NOTIFICATIONS,
  payload,
});

export const deleteToken = (payload) => ({
  type: DELETE_TOKEN,
  payload,
});
