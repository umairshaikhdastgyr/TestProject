import _ from 'lodash';
import {success, failure} from '../utils';
import {
  SET_USER_INFORMATION,
  GET_USER_INFO,
  UPDATE_PROFILE,
  CLEAR_USER,
  FOLLOW_USER,
  UNFOLLOW_USER,
  ACCOUNT_SETTINGS,
  ACCOUNT_SETTINGS_UPDATE,
  NOTIFICATION_SETTINGS,
  NOTIFICATION_SETTINGS_UPDATE1,
  UPDATE_PAYMENT_METHOD,
  PAYMENT_BANKS,
  PAYMENT_CARDS,
  ACCOUNT_BALANCE,
  PAYOUT_BALANCE,
  USER_SELL_LIST,
  USER_BUY_LIST,
  FOLLOWER_DETAIL,
  USER_REVIEWS,
  SEND_REPORT,
  UPDATE_USER_SELL_LIST,
  UPDATE_USER_SELL,
  POST_BUYER,
  ADDRESS_LIST,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  LEAVE_REVIEW,
  ADD_PHOTO_TO_LIST,
  REMOVE_PHOTO_FROM_LIST,
  SET_PHOTO_LIST,
  SET_CLAIM_PHOTO_LIST,
  ADD_CLAIM_PHOTO_TO_LIST,
  REMOVE_CLAIM_PHOTO_FROM_LIST,
  GET_USER_VALID_CARDS,
  GET_FOLLOWER_VALID_CARDS,
  CLEAR_UPDATE_PROFILE_STATUS,
  CLEAR_REPORT,
  CLEAR_BUY_LIST,
  CLEAR_SELL_LIST,
  GET_TRANSACTION_HISTORY,
  GET_PAYOUT_HISTORY,
  GET_USER_STRIPE_HISTORY,
  GET_BUY_NEXT_PAGE,
  GET_SELL_NEXT_PAGE,
  USER_PENDING_LIST,
  GET_PENDING_NEXT_PAGE,
  GET_USER_INFO_LOCAL,
  GET_NEXT_TRANSACTION_HISTORY,
  BUY_LIST,
  SELL_LIST,
  ADD_ADDRESS_REMOVE_ERROR,
  CLEAR_IMAGE,
} from './constants';

import {PAYMENT_DEFAULT} from '../Orders/constants';
import {Platform} from 'react-native';

const defaultState = {
  information: {
    isFetching: false,
  },
  userProductDetail: {
    isFetching: true,
    data: {},
  },
  postBuyerDetail: {
    isFetching: true,
    data: null,
  },
  followUpdateState: {
    isFetching: false,
    data: {},
    failure: '',
  },
  accountSettingsState: {
    isFetching: false,
    data: [],
    failure: '',
  },
  notificationSettingsState: {
    isFetching: false,
    data: [],
    failure: '',
  },
  accountSettingsUpdateState: {
    isFetching: false,
    data: {},
    failure: '',
  },
  notificationSettingsUpdateState: {
    isFetching: false,
    data: {},
    failure: '',
  },
  userTransactions: [],
  totalUserTransactions: 0,
  isFetchUserTransactions: false,
  isFetchNextUserTransactions: false,

  userPayouts: [],
  isFetchUserPayouts: false,

  paymentCardList: {
    isFetching: false,
    data: [],
    failure: '',
  },
  paymentMethodDefault: {
    default: 'google-pay',
    icon: '',
    state: '',
    title: '',
    selectedCard: {},
  },
  updatePaymentMethodState: {
    isFetching: false,
    data: {},
    failure: '',
  },
  paymentBankList: {
    isFetching: false,
    data: [],
    failure: '',
  },
  accountBalanceState: {
    isFetching: false,
    data: null,
    failure: '',
  },
  payoutBalanceState: {
    isFetching: false,
    data: null,
    failure: null,
  },
  userSellListState: {
    isFetching: false,
    data: [],
    total: 0,
    page: 1,
    success: false,
    failure: null,
  },
  userBuyListState: {
    isFetching: false,
    data: [],
    total: 0,
    page: 1,
    success: false,
    failure: null,
  },
  userPendingListState: {
    isFetching: false,
    data: [],
    total: 0,
    page: 1,
    success: false,
    failure: null,
  },
  followerDetailState: {
    isFetching: false,
    data: null,
    failure: null,
  },
  userReviewsState: {
    isFetching: false,
    data: [],
    success: false,
    failure: null,
  },
  sendUserReportState: {
    isFetching: false,
    data: null,
    failure: '',
  },
  addressListState: {
    isFetching: false,
    data: [],
    success: false,
    failure: null,
  },
  addAddressState: {
    isFetching: false,
    success: false,
    failure: null,
  },
  leaveReviewState: {
    isFetching: false,
    success: false,
    failure: null,
  },
  photosList: [],
  claimPhotosList: [],
  isFetchingNextPageBuyList: false,
  noMoreBuyList: false,
  isFetchingNextPageSellList: false,
  noMoreSellList: false,
  isFetchingNextPagePendingList: false,
  noMorePendingList: false,
  userStripeDataState: {
    isFetching: false,
    data: null,
    failure: '',
  },
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_USER_INFORMATION:
      if (_.get(action, 'payload.information', null)) {
        return {
          ...state,
          information: {
            ...state.information,
            ...action.payload.information,
            isFetching: false,
          },
        };
      }
      return {
        ...state,
        information: {
          ...state.information,
          ...action.information,
          isFetching: false,
        },
      };

    case GET_USER_INFO:
      if (action.payload.params) {
        return {
          ...state,
          userProductDetail: {
            ...state.userProductDetail,
            isFetching: true,
          },
        };
      }
      return {
        ...state,
        information: {
          ...state.information,
          isFetching: true,
        },
      };
    case success(GET_USER_INFO):
      return {
        ...state,
        userProductDetail: {
          ...state.userProductDetail,
          isFetching: false,
          data: action.response,
        },
      };

    case GET_USER_INFO_LOCAL:
      return {
        ...state,
        information: {
          ...state.information,
          ...action.payload,
          isFetching: false,
        },
      };

    case POST_BUYER:
      return {
        ...state,
        postBuyerDetail: {
          ...state.postBuyerDetail,
          isFetching: true,
        },
      };

    case success(POST_BUYER):
      return {
        ...state,
        postBuyerDetail: {
          isFetching: false,
          data: action.response,
        },
      };

    case GET_USER_VALID_CARDS:
      return {
        ...state,
        information: {
          ...state.information,
        },
      };

    case success(GET_USER_VALID_CARDS):
      return {
        ...state,
        information: {
          ...state.information,
          validCards: action?.data?.value ?? false,
        },
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        information: {
          ...state.information,
          isFetching: true,
          success: false,
          failure: null,
        },
      };

    case CLEAR_UPDATE_PROFILE_STATUS:
      return {
        ...state,
        information: {
          ...state.information,
          isFetching: false,
          success: null,
          failure: null,
        },
      };

    case success(UPDATE_PROFILE):
      return {
        ...state,
        information: {
          ...state.information,
          ...action.information,
          isFetching: false,
          success: true,
        },
      };
    case failure(UPDATE_PROFILE):
      return {
        ...state,
        information: {
          ...state.information,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case PAYOUT_BALANCE:
      return {
        ...state,
        payoutBalanceState: {
          data: null,
          failure: '',
          isFetching: true,
        },
      };

    case success(PAYOUT_BALANCE):
      return {
        ...state,
        payoutBalanceState: {
          ...state.payoutBalanceState,
          data: action.data,
          isFetching: false,
        },
      };

    case failure(PAYOUT_BALANCE):
      return {
        ...state,
        payoutBalanceState: {
          ...state.payoutBalanceState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case ACCOUNT_BALANCE:
      return {
        ...state,
        accountBalanceState: {
          data: null,
          failure: '',
          isFetching: true,
        },
      };

    case success(ACCOUNT_BALANCE):
      return {
        ...state,
        accountBalanceState: {
          ...state.accountBalanceState,
          data: action.data,
          isFetching: false,
        },
      };

    case failure(ACCOUNT_BALANCE):
      return {
        ...state,
        accountBalanceState: {
          ...state.accountBalanceState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case GET_TRANSACTION_HISTORY:
      return {
        ...state,
        isFetchUserTransactions: true,
        userTransactions: [],
      };

    case success(GET_TRANSACTION_HISTORY):
      return {
        ...state,
        isFetchUserTransactions: false,
        totalUserTransactions: action?.data?.total,
        userTransactions: action?.data,
        // userTransactions: action?.data?.rows,
      };

    case failure(GET_TRANSACTION_HISTORY):
      return {
        ...state,
        isFetchUserTransactions: false,
        userTransactions: [],
      };

    case GET_NEXT_TRANSACTION_HISTORY:
      return {
        ...state,
        isFetchNextUserTransactions: true,
      };

    case success(GET_NEXT_TRANSACTION_HISTORY):
      return {
        ...state,
        isFetchNextUserTransactions: false,
        userTransactions: [...state.userTransactions, ...action?.data?.rows],
      };

    case failure(GET_NEXT_TRANSACTION_HISTORY):
      return {
        ...state,
        isFetchNextUserTransactions: false,
        userTransactions: [],
      };

    case GET_PAYOUT_HISTORY:
      return {
        ...state,
        userPayouts: [],
        isFetchUserPayouts: true,
      };

    case success(GET_PAYOUT_HISTORY):
      return {
        ...state,
        userPayouts: action.data,
        isFetchUserPayouts: false,
      };

    case failure(GET_PAYOUT_HISTORY):
      return {
        ...state,
        userPayouts: [],
        isFetchUserPayouts: false,
      };

    case FOLLOWER_DETAIL:
      return {
        ...state,
        followerDetailState: {
          data: null,
          failure: '',
          isFetching: true,
        },
      };

    case success(FOLLOWER_DETAIL):
      return {
        ...state,
        followerDetailState: {
          ...state.followerDetailState,
          data: {...state.followerDetailState?.data, ...action.data},
          isFetching: false,
        },
      };

    case success(GET_FOLLOWER_VALID_CARDS):
      return {
        ...state,
        followerDetailState: {
          ...state.followerDetailState,
          data: {
            ...state?.followerDetailState?.data,
            validCards: action?.data?.value ?? false,
          },
        },
      };

    case failure(FOLLOWER_DETAIL):
      return {
        ...state,
        followerDetailState: {
          ...state.followerDetailState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case USER_REVIEWS:
      return {
        ...state,
        userReviewsState: {
          success: false,
          data: [],
          failure: '',
          isFetching: true,
        },
      };

    case success(USER_REVIEWS):
      return {
        ...state,
        userReviewsState: {
          ...state.userReviewsState,
          success: true,
          data: action.data.data,
          isFetching: false,
        },
      };

    case failure(USER_REVIEWS):
      return {
        ...state,
        userReviewsState: {
          ...state.userReviewsState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case USER_BUY_LIST:
      return {
        ...state,
        userBuyListState: {
          ...state.userBuyListState,
          data: [],
          success: false,
          failure: '',
          isFetching: true,
        },
      };

    case success(USER_BUY_LIST):
      return {
        ...state,
        noMoreBuyList: false,
        userBuyListState: {
          ...state.userBuyListState,
          success: true,
          data: action.data,
          total: action.total,
          isFetching: false,
        },
      };

    case failure(USER_BUY_LIST):
      return {
        ...state,
        userBuyListState: {
          ...state.userBuyListState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case GET_BUY_NEXT_PAGE:
      return {
        ...state,
        isFetchingNextPageBuyList: true,
        userBuyListState: {
          ...state.userBuyListState,
          success: false,
          failure: '',
          page: action.page,
        },
      };
    case success(GET_BUY_NEXT_PAGE):
      return {
        ...state,
        isFetchingNextPageBuyList: false,
        noMoreBuyList: action.data.length === 0,
        userBuyListState: {
          ...state.userBuyListState,
          success: true,
          data: [...state.userBuyListState.data, ...action.data],
        },
      };

    case USER_PENDING_LIST:
      return {
        ...state,
        userPendingListState: {
          ...state.userPendingListState,
          success: false,
          failure: '',
          isFetching: true,
          page: action.page,
        },
      };

    case success(USER_PENDING_LIST):
      return {
        ...state,
        noMorePendingList: false,
        userPendingListState: {
          ...state.userPendingListState,
          success: true,
          data: action.data && action.data.length ? [...action.data] : [],
          total: action.total,
          isFetching: false,
        },
      };

    case failure(USER_PENDING_LIST):
      return {
        ...state,
        userPendingListState: {
          ...state.userPendingListState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case GET_PENDING_NEXT_PAGE:
      return {
        ...state,
        isFetchingNextPagePendingList: true,
        userPendingListState: {
          ...state.userPendingListState,
          success: false,
          failure: '',
          page: action.page,
        },
      };
    case success(GET_PENDING_NEXT_PAGE):
      return {
        ...state,
        isFetchingNextPagePendingList: false,
        noMorePendingList: action.data.length === 0,
        userPendingListState: {
          ...state.userPendingListState,
          success: true,
          data:
            action.data && action.data.length
              ? [...state.userBuyListState.data, ...action.data]
              : [],
          total: action.total,
        },
      };

    case CLEAR_BUY_LIST:
      return {
        ...state,
        userBuyListState: defaultState.userBuyListState,
      };

    case USER_SELL_LIST:
      return {
        ...state,
        userSellListState: {
          ...state.userSellListState,
          success: false,
          data: [],
          failure: '',
          isFetching: true,
        },
      };

    case success(USER_SELL_LIST):
      return {
        ...state,
        noMoreSellList: false,
        userSellListState: {
          ...state.userSellListState,
          isFetching: false,
          data: action.data,
          total: action.total,
          success: true,
        },
      };

    case failure(USER_SELL_LIST):
      return {
        ...state,
        userSellListState: {
          ...state.userSellListState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case SELL_LIST:
      return {
        ...state,
        userSellListState: {
          ...state.userSellListState,
          success: false,
          failure: '',
        },
      };

    case success(SELL_LIST):
      return {
        ...state,
        noMoreSellList: false,
        userSellListState: {
          ...state.userSellListState,
          data: action.data,
          total: action.total,
          success: true,
        },
      };

    case failure(SELL_LIST):
      return {
        ...state,
        userSellListState: {
          ...state.userSellListState,
          failure: action.errorMsg,
        },
      };

    case BUY_LIST:
      return {
        ...state,
        userBuyListState: {
          ...state.userBuyListState,
          success: false,
          failure: '',
        },
      };

    case success(BUY_LIST):
      return {
        ...state,
        noMoreBuyList: false,
        userBuyListState: {
          ...state.userBuyListState,
          success: true,
          data: action.data,
          total: action.total,
        },
      };

    case failure(BUY_LIST):
      return {
        ...state,
        userBuyListState: {
          ...state.userBuyListState,
          failure: action.errorMsg,
        },
      };

    case GET_SELL_NEXT_PAGE:
      return {
        ...state,
        isFetchingNextPageSellList: true,
        userSellListState: {
          ...state.userSellListState,
          success: false,
          failure: '',
          page: action.page,
        },
      };
    case success(GET_SELL_NEXT_PAGE):
      return {
        ...state,
        isFetchingNextPageSellList: false,
        noMoreSellList: action.data.length === 0,
        userSellListState: {
          ...state.userSellListState,
          success: true,
          data: [...state.userSellListState.data, ...action.data],
        },
      };

    case CLEAR_SELL_LIST:
      return {
        ...state,
        userSellListState: defaultState.userSellListState,
      };

    case UPDATE_USER_SELL_LIST:
      const userSellList = state.userSellListState.data;
      const updatedItem = action.data.data;
      const updatedList = userSellList.map(item => {
        if (item.id === updatedItem.PostId) {
          return {...item, isFavorite: false};
        }
        return item;
      });

      return {
        ...state,
        userSellListState: {
          ...state.userSellListState,
          data: updatedList,
          success: true,
          isFetching: false,
        },
      };

    case UPDATE_USER_SELL:
      return {
        ...state,
        userSellListState: {
          ...state.userSellListState,
          success: false,
        },
      };

    case ACCOUNT_SETTINGS:
      return {
        ...state,
        accountSettingsState: {
          data: [],
          failure: '',
          isFetching: true,
        },
      };

    case success(ACCOUNT_SETTINGS):
      return {
        ...state,
        accountSettingsState: {
          ...state.accountSettingsState,
          data: action.data,
          isFetching: false,
        },
      };

    case failure(ACCOUNT_SETTINGS):
      return {
        ...state,
        accountSettingsState: {
          ...state.accountSettingsState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case ACCOUNT_SETTINGS_UPDATE:
      return {
        ...state,
        accountSettingsUpdateState: {
          data: {},
          failure: '',
          isFetching: true,
        },
      };

    case success(ACCOUNT_SETTINGS_UPDATE):
      return {
        ...state,
        accountSettingsUpdateState: {
          ...state.accountSettingsUpdateState,
          data: action.data,
          isFetching: false,
        },
      };

    case failure(ACCOUNT_SETTINGS_UPDATE):
      return {
        ...state,
        accountSettingsUpdateState: {
          ...state.accountSettingsUpdateState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case NOTIFICATION_SETTINGS:
      return {
        ...state,
        notificationSettingsState: {
          data: [],
          failure: '',
          isFetching: true,
        },
      };

    case success(NOTIFICATION_SETTINGS):
      return {
        ...state,
        notificationSettingsState: {
          ...state.notificationSettingsState,
          data: action.data,
          isFetching: false,
        },
      };

    case failure(NOTIFICATION_SETTINGS):
      return {
        ...state,
        notificationSettingsState: {
          ...state.notificationSettingsState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case NOTIFICATION_SETTINGS_UPDATE1:
      return {
        ...state,
        notificationSettingsUpdateState: {
          data: [],
          failure: '',
          isFetching: true,
        },
      };

    case success(NOTIFICATION_SETTINGS_UPDATE1):
      return {
        ...state,
        notificationSettingsUpdateState: {
          ...state.notificationSettingsUpdateState,
          data: action.data,
          isFetching: false,
        },
      };

    case failure(NOTIFICATION_SETTINGS_UPDATE1):
      return {
        ...state,
        notificationSettingsUpdateState: {
          ...state.notificationSettingsUpdateState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case PAYMENT_CARDS:
      return {
        ...state,
        paymentCardList: {
          data: [],
          failure: '',
          isFetching: true,
        },
      };

    case success(PAYMENT_CARDS):
      let paymentMethodDefault = action.data.data.find(
        card => card?.metadata?.isDefault == 'true',
      );

      return {
        ...state,
        paymentCardList: {
          ...state.paymentCardList,
          data: action.data,
          isFetching: false,
        },
        paymentMethodDefault: {
          ...state.paymentMethodDefault,
          default: paymentMethodDefault
            ? paymentMethodDefault.id
            : Platform.OS == 'android'
            ? 'google-pay'
            : 'apple-pay',
          icon: paymentMethodDefault
            ? 'credit-card'
            : Platform.OS == 'android'
            ? 'google_pay'
            : 'apple_pay',
          state: paymentMethodDefault
            ? paymentMethodDefault.id
            : Platform.OS == 'android'
            ? 'googlePay'
            : 'applePay',
          title: paymentMethodDefault
            ? '**** ' + paymentMethodDefault.last4
            : Platform.OS == 'android'
            ? 'Google pay'
            : 'Apple pay',
          selectedCard: paymentMethodDefault
            ? {...paymentMethodDefault}
            : {id: null},
        },
      };

    case failure(PAYMENT_CARDS):
      return {
        ...state,
        paymentCardList: {
          ...state.paymentCardList,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case UPDATE_PAYMENT_METHOD:
      return {
        ...state,
        updatePaymentMethodState: {
          data: {},
          failure: '',
          isFetching: true,
        },
      };

    case success(UPDATE_PAYMENT_METHOD):
      return {
        ...state,
        updatePaymentMethodState: {
          ...state.updatePaymentMethodState,
          data: action.data,
          isFetching: false,
        },
      };

    case failure(UPDATE_PAYMENT_METHOD):
      return {
        ...state,
        updatePaymentMethodState: {
          ...state.updatePaymentMethodState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };
    case PAYMENT_DEFAULT:
      return {
        ...state,
        paymentMethodDefault: {
          ...state.paymentMethodDefault,
          ...action.response,
        },
      };
    case SEND_REPORT:
      return {
        ...state,
        sendUserReportState: {
          data: null,
          failure: '',
          isFetching: true,
        },
      };

    case CLEAR_REPORT:
      return {
        ...state,
        sendUserReportState: {
          data: null,
          failure: null,
          isFetching: false,
        },
      };

    case success(SEND_REPORT):
      return {
        ...state,
        sendUserReportState: {
          ...state.sendUserReportState,
          data: action.data,
          isFetching: false,
        },
      };

    case failure(SEND_REPORT):
      return {
        ...state,
        sendUserReportState: {
          ...state.sendUserReportState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case PAYMENT_BANKS:
      return {
        ...state,
        paymentBankList: {
          data: [],
          failure: '',
          isFetching: true,
        },
      };

    case success(PAYMENT_BANKS):
      return {
        ...state,
        paymentBankList: {
          ...state.paymentBankList,
          data: action.data,
          isFetching: false,
        },
      };

    case failure(PAYMENT_BANKS):
      return {
        ...state,
        paymentBankList: {
          ...state.paymentBankList,
          isFetching: false,
          failure: action.errorMsg,
        },
      };

    case CLEAR_USER:
      return {
        ...defaultState,
      };
    case FOLLOW_USER:
      return {
        ...state,
        followUpdateState: {
          isFetching: true,
          failure: '',
        },
      };
    case success(FOLLOW_USER):
      const resultF = {};
      resultF.isFollowing = '1';

      return {
        ...state,
        followUpdateState: {
          isFetching: false,
          failure: '',
        },
        userProductDetail: {
          data: {
            ...state.userProductDetail.data,
            ...resultF,
          },
        },
        information: {
          ...state.information,
          followingCount: state.information.followingCount + 1,
        },
      };
    case failure(FOLLOW_USER):
      return {
        ...state,
        followUpdateState: {
          isFetching: false,
          failure: action,
        },
      };
    case UNFOLLOW_USER:
      return {
        ...state,
        followUpdateState: {
          isFetching: true,
          failure: '',
        },
      };
    case success(UNFOLLOW_USER):
      const resultU = {};
      resultU.isFollowing = '0';

      return {
        ...state,
        followUpdateState: {
          isFetching: false,
          failure: '',
        },
        userProductDetail: {
          data: {
            ...state.userProductDetail.data,
            ...resultU,
          },
        },
        information: {
          ...state.information,
          followingCount: state.information.followingCount - 1,
        },
      };
    case failure(UNFOLLOW_USER):
      return {
        ...state,
        followUpdateState: {
          isFetching: false,
          failure: action,
        },
      };
    case ADDRESS_LIST:
      return {
        ...state,
        addressListState: {
          ...state.addressListState,
          isFetching: true,
          success: false,
          failure: '',
        },
      };
    case success(ADDRESS_LIST):
      return {
        ...state,
        addressListState: {
          ...state.addressListState,
          isFetching: false,
          success: true,
          failure: '',
          data: action.data.data,
        },
      };
    case failure(ADDRESS_LIST):
      return {
        ...state,
        addressListState: {
          ...state.addressListState,
          success: false,
          isFetching: false,
          failure: action.errorMsg,
        },
      };
    case ADD_ADDRESS_REMOVE_ERROR:
      return {
        ...state,
        addAddressState: {
          ...state.addAddressState,
          failure: '',
        },
      };
    case ADD_ADDRESS:
      return {
        ...state,
        addAddressState: {
          ...state.addAddressState,
          isFetching: true,
          success: false,
          failure: '',
        },
      };
    case success(ADD_ADDRESS):
      return {
        ...state,
        addAddressState: {
          ...state.addAddressState,
          isFetching: false,
          success: true,
          failure: '',
        },
      };
    case failure(ADD_ADDRESS):
      return {
        ...state,
        addAddressState: {
          ...state.addAddressState,
          isFetching: false,
          success: false,
          failure: action.errorMsg,
        },
      };
    case UPDATE_ADDRESS:
      return {
        ...state,
        addAddressState: {
          ...state.addAddressState,
          isFetching: true,
          success: false,
          failure: '',
        },
      };
    case success(UPDATE_ADDRESS):
      return {
        ...state,
        addAddressState: {
          ...state.addAddressState,
          isFetching: false,
          success: true,
          failure: '',
        },
      };
    case failure(UPDATE_ADDRESS):
      return {
        ...state,
        addAddressState: {
          ...state.addAddressState,
          isFetching: false,
          success: false,
          failure: action.errorMsg,
        },
      };
    case DELETE_ADDRESS:
      return {
        ...state,
        addAddressState: {
          ...state.addAddressState,
          isFetching: true,
          success: false,
          failure: '',
        },
      };
    case success(DELETE_ADDRESS):
      return {
        ...state,
        addressListState: {
          ...state.addressListState,
          data: state.addressListState.data.filter(
            addr => addr.id !== action.payload,
          ),
        },
        addAddressState: {
          ...state.addAddressState,
          isFetching: false,
          success: true,
          failure: '',
        },
      };
    case failure(DELETE_ADDRESS):
      return {
        ...state,
        addAddressState: {
          ...state.addAddressState,
          isFetching: false,
          success: false,
          failure: action.errorMsg,
        },
      };
    case LEAVE_REVIEW:
      return {
        ...state,
        leaveReviewState: {
          ...state.leaveReviewState,
          isFetching: true,
          success: false,
          failure: null,
        },
      };
    case success(LEAVE_REVIEW):
      return {
        ...state,
        leaveReviewState: {
          ...state.leaveReviewState,
          isFetching: false,
          success: true,
        },
      };
    case failure(LEAVE_REVIEW):
      return {
        ...state,
        leaveReviewState: {
          ...state.leaveReviewState,
          isFetching: false,
          success: false,
          failure: action.errorMsg,
        },
      };
    case SET_PHOTO_LIST:
      return {
        ...state,
        photosList: action.response,
      };
    case ADD_PHOTO_TO_LIST:
      return {
        ...state,
        photosList: [...state.photosList, action.response],
      };
    case REMOVE_PHOTO_FROM_LIST:
      const removePhotoList = state.photosList.filter(
        (photo, index) => photo.Key !== action.response,
      );
      return {
        ...state,
        photosList: removePhotoList,
      };
    case SET_CLAIM_PHOTO_LIST:
      return {
        ...state,
        claimPhotosList: action.response,
      };
    case ADD_CLAIM_PHOTO_TO_LIST:
      return {
        ...state,
        claimPhotosList: [...state.claimPhotosList, action.response],
      };
    case REMOVE_CLAIM_PHOTO_FROM_LIST:
      const removeClaimPhotList = state.claimPhotosList.filter(
        (photo, index) => photo.Key != action.payload,
      );
      return {
        ...state,
        claimPhotosList: removeClaimPhotList,
      };
    case CLEAR_IMAGE:
      return {
        ...state,
        photosList: [],
        claimPhotosList: [],
      };
    case GET_USER_STRIPE_HISTORY:
      return {
        ...state,
        userStripeDataState: {
          data: null,
          failure: '',
          isFetching: true,
        },
      };

    case success(GET_USER_STRIPE_HISTORY):
      return {
        ...state,
        userStripeDataState: {
          ...state.userStripeDataState,
          data: action.data,
          isFetching: false,
        },
      };

    case failure(GET_USER_STRIPE_HISTORY):
      return {
        ...state,
        userStripeDataState: {
          ...state.userStripeDataState,
          isFetching: false,
          failure: action.errorMsg,
        },
      };
    default:
      return state;
  }
};

export default reducer;
