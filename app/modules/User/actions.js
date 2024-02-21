import {
  SET_USER_INFORMATION,
  GET_USER_INFO,
  GET_USER_INFO_LOCAL,
  UPDATE_PROFILE,
  CLEAR_UPDATE_PROFILE_STATUS,
  CLEAR_USER,
  FOLLOW_USER,
  UNFOLLOW_USER,
  ACCOUNT_SETTINGS,
  NOTIFICATION_SETTINGS,
  NOTIFICATION_SETTINGS_UPDATE,
  ACCOUNT_SETTINGS_UPDATE,
  UPDATE_PAYMENT_METHOD,
  PAYMENT_CARDS,
  PAYMENT_BANKS,
  ACCOUNT_BALANCE,
  PAYOUT_BALANCE,
  USER_SELL_LIST,
  USER_BUY_LIST,
  FOLLOWER_DETAIL,
  USER_REVIEWS,
  SEND_REPORT,
  POST_BUYER,
  ADDRESS_LIST,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  LEAVE_REVIEW,
  SET_PHOTO_LIST,
  ADD_PHOTO_TO_LIST,
  REMOVE_PHOTO_FROM_LIST,
  SET_CLAIM_PHOTO_LIST,
  ADD_CLAIM_PHOTO_TO_LIST,
  REMOVE_CLAIM_PHOTO_FROM_LIST,
  GET_USER_VALID_CARDS,
  GET_FOLLOWER_VALID_CARDS,
  CLEAR_REPORT,
  CLEAR_SELL_LIST,
  CLEAR_BUY_LIST,
  GET_TRANSACTION_HISTORY,
  GET_PAYOUT_HISTORY,
  GET_USER_STRIPE_HISTORY,
  GET_BUY_NEXT_PAGE,
  GET_SELL_NEXT_PAGE,
  USER_PENDING_LIST,
  GET_PENDING_NEXT_PAGE,
  GET_NEXT_TRANSACTION_HISTORY,
  SELL_LIST,
  BUY_LIST,
  ADD_ADDRESS_REMOVE_ERROR,
  CLEAR_IMAGE,
} from "./constants";

export const getUserValidCards = (userId) => ({
  type: GET_USER_VALID_CARDS,
  payload: {
    userId,
  },
});

export const getFollowerValidCards = (userId) => ({
  type: GET_FOLLOWER_VALID_CARDS,
  payload: {
    userId,
  },
});

export const setUserInformation = (payload) => ({
  type: SET_USER_INFORMATION,
  payload,
});

export const getUserInfo = (payload) => ({
  type: GET_USER_INFO,
  payload,
});

export const getUserInfoLocal = (payload) => ({
  type: GET_USER_INFO_LOCAL,
  payload,
});

export const postBuyerDetail = (payload) => ({
  type: POST_BUYER,
  payload,
});

export const sendUserReport = (payload) => ({
  type: SEND_REPORT,
  payload,
});

export const clearUserReport = () => ({
  type: CLEAR_REPORT,
});

export const getUserReview = (payload) => ({
  type: USER_REVIEWS,
  payload,
});

export const getFollowerDetails = (payload) => ({
  type: FOLLOWER_DETAIL,
  payload,
});

export const getUserAccountSettings = (payload) => ({
  type: ACCOUNT_SETTINGS,
  payload,
});

export const updatePaymentMethod = (payload) => ({
  type: UPDATE_PAYMENT_METHOD,
  payload,
});

export const getAccountBalance = (payload) => ({
  type: ACCOUNT_BALANCE,
  payload,
});

export const getTransactionHistory = (payload) => ({
  type: GET_TRANSACTION_HISTORY,
  payload,
});

export const getNextTransactionHistory = (payload) => ({
  type: GET_NEXT_TRANSACTION_HISTORY,
  payload,
});

export const getPayoutHistory = (payload) => ({
  type: GET_PAYOUT_HISTORY,
  payload,
});

export const payoutBalance = (payload) => ({
  type: PAYOUT_BALANCE,
  payload,
});

export const getPaymentCards = (payload) => ({
  type: PAYMENT_CARDS,
  payload,
});

export const getPaymentBanks = (payload) => ({
  type: PAYMENT_BANKS,
  payload,
});

export const getUserSellList = (payload, page) => ({
  type: USER_SELL_LIST,
  payload,
  page,
});

export const getSellNextPage = (payload, page) => ({
  type: GET_SELL_NEXT_PAGE,
  payload,
  page,
});

export const clearSellList = () => ({
  type: CLEAR_SELL_LIST,
});

export const clearBuyList = () => ({
  type: CLEAR_BUY_LIST,
});

export const getUserBuyList = (payload, page) => ({
  type: USER_BUY_LIST,
  payload,
  page,
});

export const getSellList = (payload, page) => ({
  type: SELL_LIST,
  payload,
  page,
});

export const getBuyList = (payload, page) => ({
  type: BUY_LIST,
  payload,
  page,
});

export const getBuyNextPage = (payload, page) => ({
  type: GET_BUY_NEXT_PAGE,
  payload,
  page,
});

export const getUserPendingList = (payload, page) => ({
  type: USER_PENDING_LIST,
  payload,
  page,
});

export const getPendingNextPage = (payload, page) => ({
  type: GET_PENDING_NEXT_PAGE,
  payload,
  page,
});

export const updateUserAccountSettings = (payload) => ({
  type: ACCOUNT_SETTINGS_UPDATE,
  payload,
});

export const getUserNotificationSettings = (payload) => ({
  type: NOTIFICATION_SETTINGS,
  payload,
});

export const updateUserNotificationSettings = (payload) => ({
  type: NOTIFICATION_SETTINGS_UPDATE,
  payload,
});

export const updateProfile = (payload) => ({
  type: UPDATE_PROFILE,
  payload,
});

export const clearUpdateProfileStatus = () => ({
  type: CLEAR_UPDATE_PROFILE_STATUS,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const followUser = (payload) => ({
  type: FOLLOW_USER,
  payload,
});

export const unfollowUser = (payload) => ({
  type: UNFOLLOW_USER,
  payload,
});

export const getAddressList = () => ({
  type: ADDRESS_LIST,
});

export const addAddress = (payload) => ({
  type: ADD_ADDRESS,
  payload,
});

export const addressErrorRemove = () => ({
  type: ADD_ADDRESS_REMOVE_ERROR,
});

export const updateAddress = (payload) => ({
  type: UPDATE_ADDRESS,
  payload,
});

export const deleteAddress = (payload) => ({
  type: DELETE_ADDRESS,
  payload,
});

export const leaveReview = (payload) => ({
  type: LEAVE_REVIEW,
  payload,
});

export const setReturnPhotoList = (payload) => ({
  type: SET_PHOTO_LIST,
  response: payload,
});
export const addReturnPhotoToList = (payload) => ({
  type: ADD_PHOTO_TO_LIST,
  response: payload,
});

export const removeReturnPhotoFromList = (key) => ({
  type: REMOVE_PHOTO_FROM_LIST,
  response: key,
});

export const setClaimPhotoList = (payload) => ({
  type: SET_CLAIM_PHOTO_LIST,
  response: payload,
});
export const addClaimPhotoToList = (payload) => ({
  type: ADD_CLAIM_PHOTO_TO_LIST,
  response: payload,
});

export const removeClaimPhotoFromList = (key) => ({
  type: REMOVE_CLAIM_PHOTO_FROM_LIST,
  payload: key,
});

export const getUserStripeHistory = () => ({
  type: GET_USER_STRIPE_HISTORY,
});

export const clearImage = () => ({
  type: CLEAR_IMAGE,
});
