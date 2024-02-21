import {all, call, put, takeLatest, select} from 'redux-saga/effects';

import _ from 'lodash';
import {
  getUserValidCards as getUserValidCardsApi,
  getUserInfo as getUserInfoApi,
  followUser as followUserApi,
  unfollowUser as unfollowUserApi,
  getUserAccountSettings as getUserAccountSettingsApi,
  updateUserAccountSettings as updateUserAccountSettingsApi,
  getUserNotificationSettings as getUserNotificationSettingsApi,
  updateUserNotificationSettings as updateUserNotificationSettingsApi,
  updatePaymentMethod as updatePaymentMethodApi,
  getPaymentMethods as getPaymentMethodsApi,
  getUserAccountBalance as getUserAccountBalanceApi,
  payoutBalance as payoutBalanceApi,
  getUserBuyProducts as getUserBuyProductsApi,
  getUserSellProducts as getUserSellProductsApi,
  getUserReview as getUserReviewApi,
  getFollowerDetail as getFollowerDetailApi,
  sendUserReport as sendUserReportApi,
  sendUserBlock as sendUserBlockApi,
  getAddressList as getAddressListApi,
  addAddress as addAddressApi,
  updateAddress as updateAddressApi,
  deleteAddress as deleteAddressApi,
  leaveReview as leaveReviewApi,
  createStripeAccount as createStripeAccountApi,
  getPayouts as getPayoutsApi,
  getStripeAccount as getStripeAccountApi,
  getUserPendingProducts,
} from '#services/apiUsers';

import {
  getOrderById,
  getTransactions as getTransactionsApi,
} from '#services/apiOrders';
import {getPostDetailData} from '#services/apiPosts';
import {LocalStorage} from '#services';
import {updateProfile as updateProfileApi} from '#services/api';
import {mapAccountSettingsData} from '../../utils';
import {
  GET_USER_VALID_CARDS,
  GET_USER_INFO,
  SET_USER_INFORMATION,
  UPDATE_PROFILE,
  FOLLOW_USER,
  UNFOLLOW_USER,
  ACCOUNT_SETTINGS,
  ACCOUNT_SETTINGS_UPDATE,
  NOTIFICATION_SETTINGS,
  NOTIFICATION_SETTINGS_UPDATE,
  UPDATE_PAYMENT_METHOD,
  PAYMENT_CARDS,
  PAYMENT_BANKS,
  ACCOUNT_BALANCE,
  PAYOUT_BALANCE,
  USER_BUY_LIST,
  USER_SELL_LIST,
  USER_REVIEWS,
  FOLLOWER_DETAIL,
  SEND_REPORT,
  POST_BUYER,
  ADDRESS_LIST,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  LEAVE_REVIEW,
  GET_FOLLOWER_VALID_CARDS,
  GET_TRANSACTION_HISTORY,
  GET_PAYOUT_HISTORY,
  GET_USER_STRIPE_HISTORY,
  GET_BUY_NEXT_PAGE,
  GET_SELL_NEXT_PAGE,
  GET_PENDING_NEXT_PAGE,
  USER_PENDING_LIST,
  GET_NEXT_TRANSACTION_HISTORY,
  BUY_LIST,
  SELL_LIST,
} from './constants';
import {success, failure} from '../utils';
import {selectUserData} from './selectors';

function* fetchUserInfo({type, payload}) {
  const response = yield call(getUserInfoApi, payload);
  const errorMsg = _.get(response, 'result.content.message', null);
  if (errorMsg) {
    // console.info('failure to fetch the user info', errorMsg);
  } else if (payload.params) {
    yield put({type: success(type), response});
  } else if (
    response?.error != 'Not Found' &&
    response?.status != 404 &&
    response?.status != 500 &&
    response?.status != 501
  ) {
    yield call(LocalStorage.setUserInformation, response);
    yield put({type: SET_USER_INFORMATION, information: response});
  }
}

function* fetchBuyerInfo({type, payload}) {
  const response = yield call(getUserInfoApi, payload);
  const errorMsg = _.get(response, 'result.content.message', null);
  if (errorMsg) {
    // console.info('failure to fetch the user info', errorMsg);
  } else {
    yield put({type: success(type), response});
  }
}

function* fetchValidCardsSaga({type, payload}) {
  const data = yield call(getUserValidCardsApi, payload);
  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    // console.info('failure to fetch valid cards', errorMsg);
  } else {
    yield put({type: success(type), data});
  }
}

function* fetchAccountSettings({type, payload}) {
  const data = yield call(getUserAccountSettingsApi, payload);
  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    const mapData = mapAccountSettingsData(data, 'Account');
    yield put({type: success(type), data: mapData});
  }
}

function* fetchNotificationSettings({type, payload}) {
  const data = yield call(getUserNotificationSettingsApi, payload);
  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    const mapData = data.data;
    yield put({type: success(type), data: mapData});
  }
}

function* updateNotificationSettings({type, payload}) {
  const data = yield call(updateUserNotificationSettingsApi, payload);
  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
    if (data?.data?.settings) {
      yield put({
        type: success('NOTIFICATION_SETTINGS'),
        data: data?.data?.settings,
      });
    }
  }
}

function* updateAccountSettings({type, payload}) {
  const data = yield call(updateUserAccountSettingsApi, payload);
  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
  }
}

function* getPayoutHistory({type, payload}) {
  const data = yield call(getPayoutsApi, payload);
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data: data?.data || data?.[0]?.data});
  }
}

function* payoutBalance({type, payload}) {
  const data = yield call(payoutBalanceApi, payload);
  const errorMsg = _.get(data, 'result.content.message', null);
  const err2 = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else if (err2) {
    yield put({
      type: failure(type),
      errorMsg: err2,
    });
  } else {
    yield put({type: success(type), data});
  }
}

function* sendUserReport({type, payload}) {
  const reportData = yield call(sendUserReportApi, payload);
  let blockData;
  if (payload?.isBlock) {
    const {
      information: {id},
    } = yield select(selectUserData());
    const {body} = payload;
    const params = {
      reasonDescription: body.params.reason,
      blockedByUserId: id,
      blockedUserId: body.params.reportedUserId,
    };
    if (body.params.reasonDescription) {
      params.internalNotes = body.params.reasonDescription;
    }
    blockData = yield call(sendUserBlockApi, {params});
  }
  // const [reportData, blockData] = yield all(calls);
  const errorReportMsg = _.get(reportData, 'result.content.message', null);
  const errorBlockMsg = _.get(blockData, 'result.content.message', null);
  const err1 = _.get(reportData, 'error', null);
  const err2 = _.get(blockData, 'error', null);
  if (errorReportMsg || errorBlockMsg) {
    yield put({
      type: failure(type),
      errorMsg: `${errorReportMsg} ${errorBlockMsg}`,
    });
  } else if (err1 || err2) {
    yield put({
      type: failure(type),
      errorMsg: err2,
    });
  } else {
    yield put({type: success(type), data: {reportData, blockData}});
  }
}

function* updatePaymentMethod({type, payload}) {
  if (payload.createStripeAccount) {
    const dataFirst = yield call(createStripeAccountApi, payload);
    const errorMsg = _.get(dataFirst, 'error', null);
    if (errorMsg && errorMsg != 'Account already exists.') {
      yield put({type: failure(type), errorMsg});
      return;
    }
  }
  let shouldSendDoc = false;
  if (payload.type == 'bank') {
    const bankAccountInfo = yield call(getStripeAccountApi, payload);

    if (!bankAccountInfo?.stripeData?.requirements) {
      shouldSendDoc = true;
    } else if (
      bankAccountInfo?.stripeData?.requirements?.currently_due?.includes(
        'documents.bank_account_ownership_verification.files',
      )
    ) {
      shouldSendDoc = true;
    }
    if (
      !shouldSendDoc &&
      payload?.body?.params?.documents?.bank_account_ownership_verification
        ?.files
    ) {
      payload.body.params.documents.bank_account_ownership_verification.files =
        [];
    }
  }

  const data = yield call(updatePaymentMethodApi, payload);
  if (payload.method == 'DELETE') {
    yield fetchPaymentCards({
      payload: {userId: payload.userId, type: 'card'},
      type: 'PAYMENT_CARDS',
    });
  }
  const errorMsg = _.get(data, 'error', null);
  console.log("🚀 ~ file: sagas.js:274 ~ function*updatePaymentMethod ~ errorMsg:", errorMsg)
  if (errorMsg) {
    yield put({type: failure(type), errorMsg: errorMsg.message || errorMsg});
  } else {
    yield put({type: success(type), data});
  }
}

function* fetchAccountBalance({type, payload}) {
  const data = yield call(getUserAccountBalanceApi, payload);
  if (data == undefined) {
    return;
  }
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data: data.data});
  }
}

function* fetchTransactions({type, payload}) {
  const data = yield call(getTransactionsApi, payload);
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data: data?.data});
  }
}

function* fetchBuyProductList({type, payload}) {
  const data = yield call(getUserBuyProductsApi, payload);
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    const buyList = data?.rows;
    if (data?.rows) {
      yield put({
        type: success(type),
        data: buyList,
        total: data?.total,
        reqType: payload.reqType,
      });
    } else {
      yield put({type: failure(type), errorMsg});
    }
  }
}

function* fetchPendingProductList({type, payload}) {
  const data = yield call(getUserPendingProducts, payload);
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    const pendingList = data?.rows;
    if (data?.rows) {
      yield put({
        type: success(type),
        data: pendingList,
        total: data?.total,
        reqType: payload.reqType,
      });
    } else {
      yield put({type: failure(type), errorMsg});
    }
  }
}

export function* fetchSellProductList({type, payload}) {
  // const selectForChat = state => state.chat;
  // const stateData = yield select(selectForChat);
  // const chatData = { ...stateData.chatInfo };
  const data = yield call(getUserSellProductsApi, payload);
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    const sellList = data?.rows;
    for (let i = 0; i < sellList?.length; i++) {
      let postDetail;
      if (sellList[i].status === 'draft' && sellList[i].postId) {
        postDetail = yield call(getPostDetailData, {
          postId: sellList[i].postId,
          params: {
            lat: 0,
            lng: 0,
            userId: payload.userId,
          },
        });
        sellList[i].postDetail = postDetail?.data;
      }
    }
    if (data?.rows) {
      yield put({
        type: success(type),
        data: sellList,
        total: data?.total,
        reqType: payload.reqType,
      });
    } else {
      yield put({type: failure(type), errorMsg});
    }
  }
}

function* fetchPaymentCards({type, payload}) {
  if (payload.userId) {
    const data = yield call(getPaymentMethodsApi, payload);
    const errorMsg = _.get(data, 'error', null);
    if (errorMsg) {
      yield put({type: failure(type), errorMsg});
    } else {
      yield put({type: success(type), data});
    }
  }
}

function* fetchPaymentBanks({type, payload}) {
  const data = yield call(getPaymentMethodsApi, payload);
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
  }
}

function* fetchUserReview({type, payload}) {
  const data = yield call(getUserReviewApi, payload);
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
  }
}

function* fetchFollowerDetail({type, payload}) {
  const data = yield call(getFollowerDetailApi, payload);
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
  }
}

function* updateProfile({type, payload}) {
  const data = yield call(updateProfileApi, payload);
  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield call(LocalStorage.setUserInformation, data);
    yield put({type: success(type), information: data});
  }
}

function* followUser({type, payload}) {
  const data = yield call(followUserApi, payload);
  const errorMsg = data.error;
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
  }
}

function* unfollowUser({type, payload}) {
  const data = yield call(unfollowUserApi, payload);

  const errorMsg = data.error;
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
  }
}

function* fetchAddressList({type}) {
  const {
    information: {id},
  } = yield select(selectUserData());
  const data = yield call(getAddressListApi, id);
  const errorMsg = _.get(data, 'error', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
  }
}

function* addAddress({type, payload}) {
  const {
    information: {id},
  } = yield select(selectUserData());
  const data = yield call(addAddressApi, id, {params: payload});

  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
    yield call(fetchAddressList, {type: ADDRESS_LIST});
  }
}

function* updateAddress({type, payload}) {
  const {
    information: {id},
  } = yield select(selectUserData());
  const data = yield call(updateAddressApi, id, payload.id, {
    params: payload.address,
  });

  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
    yield call(fetchAddressList, {type: ADDRESS_LIST});
  }
}

function* deleteAddress({type, payload}) {
  const {
    information: {id},
  } = yield select(selectUserData());
  const data = yield call(deleteAddressApi, id, payload);

  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), payload});
    yield call(fetchAddressList, {type: ADDRESS_LIST});
  }
}

function* leaveReview({type, payload}) {
  const {
    information: {id},
  } = yield select(selectUserData());
  const data = yield call(leaveReviewApi, payload.reviewingUserId, {
    params: {
      ...payload,
      // reviewingUserId: payload.sellerId,
      reviewingUserId: id,
    },
  });

  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), payload});
  }
}

function* getUserStripeData({type}) {
  const {
    information: {id},
  } = yield select(selectUserData());
  const data = yield call(getStripeAccountApi, {userId: id});

  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    yield put({type: success(type), data});
  }
}

export default function* actionWatcher() {
  yield takeLatest(GET_USER_VALID_CARDS, fetchValidCardsSaga);
  yield takeLatest(GET_FOLLOWER_VALID_CARDS, fetchValidCardsSaga);
  yield takeLatest(GET_USER_INFO, fetchUserInfo);
  yield takeLatest(UPDATE_PROFILE, updateProfile);
  yield takeLatest(FOLLOW_USER, followUser);
  yield takeLatest(UNFOLLOW_USER, unfollowUser);
  yield takeLatest(ACCOUNT_SETTINGS, fetchAccountSettings);
  yield takeLatest(ACCOUNT_SETTINGS_UPDATE, updateAccountSettings);
  yield takeLatest(NOTIFICATION_SETTINGS, fetchNotificationSettings);
  yield takeLatest(NOTIFICATION_SETTINGS_UPDATE, updateNotificationSettings);
  yield takeLatest(UPDATE_PAYMENT_METHOD, updatePaymentMethod);
  yield takeLatest(PAYMENT_BANKS, fetchPaymentBanks);
  yield takeLatest(PAYMENT_CARDS, fetchPaymentCards);
  yield takeLatest(ACCOUNT_BALANCE, fetchAccountBalance);
  yield takeLatest(PAYOUT_BALANCE, payoutBalance);
  yield takeLatest(USER_BUY_LIST, fetchBuyProductList);
  yield takeLatest(BUY_LIST, fetchBuyProductList);
  yield takeLatest(GET_BUY_NEXT_PAGE, fetchBuyProductList);
  yield takeLatest(USER_PENDING_LIST, fetchPendingProductList);
  yield takeLatest(GET_PENDING_NEXT_PAGE, fetchPendingProductList);
  yield takeLatest(USER_SELL_LIST, fetchSellProductList);
  yield takeLatest(SELL_LIST, fetchSellProductList);
  yield takeLatest(GET_SELL_NEXT_PAGE, fetchSellProductList);
  yield takeLatest(USER_REVIEWS, fetchUserReview);
  yield takeLatest(FOLLOWER_DETAIL, fetchFollowerDetail);
  yield takeLatest(SEND_REPORT, sendUserReport);
  yield takeLatest(POST_BUYER, fetchBuyerInfo);
  yield takeLatest(ADDRESS_LIST, fetchAddressList);
  yield takeLatest(ADD_ADDRESS, addAddress);
  yield takeLatest(UPDATE_ADDRESS, updateAddress);
  yield takeLatest(DELETE_ADDRESS, deleteAddress);
  yield takeLatest(LEAVE_REVIEW, leaveReview);
  yield takeLatest(GET_TRANSACTION_HISTORY, fetchTransactions);
  yield takeLatest(GET_NEXT_TRANSACTION_HISTORY, fetchTransactions);
  yield takeLatest(GET_PAYOUT_HISTORY, getPayoutHistory);
  yield takeLatest(GET_USER_STRIPE_HISTORY, getUserStripeData);
}
