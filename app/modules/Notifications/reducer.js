import moment from 'moment';
import { success, failure } from '../utils';

import {
  SET_TOKEN_DATA,
  GET_TOKEN_DATA,
  CLEAR_NOTIFICATIONS,
  DELETE_TOKEN,
  SET_NOTIFICATIONS,
} from './constants';

const defaultState = {
  isFetching: false,
  notificationInfo: {},
  errorMsg: '',
  deviceToken: '',
  notificationList: {
    isFetching: false,
    newNotification: [],
    oldNotification: [],
    newNotificationCout: 0,
    failure: null,
  },
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_TOKEN_DATA:
      return {
        ...state,
        isFetching: true,
      };
    case success(GET_TOKEN_DATA):
      return {
        ...state,
        deviceToken: action.token,
        isFetching: false,
      };
    case failure(GET_TOKEN_DATA):
      return {
        ...state,
        errorMsg: action.errorMsg,
        isFetching: false,
      };
    case SET_TOKEN_DATA:
      return {
        ...state,
        isFetching: true,
      };
    case success(SET_TOKEN_DATA):
      return {
        ...state,
        deviceToken: action.token,
        isFetching: false,
      };
    case failure(SET_TOKEN_DATA):
      return {
        ...state,
        errorMsg: action,
        isFetching: false,
      };
    case CLEAR_NOTIFICATIONS:
      return {
        ...state,
        errorMsg: '',
        isFetching: false,
        deviceToken: '',
        notificationInfo: {},
        notificationList: {
          isFetching: true,
          newNotification: [],
          oldNotification: [],
          newNotificationCout: 0,
          failure: null,
        },
      };
    case failure(CLEAR_NOTIFICATIONS):
      return {
        ...state,
        errorMsg: '',
        isFetching: false,
        deviceToken: '',
        notificationInfo: {},
        notificationList: {
          isFetching: true,
          newNotification: [],
          oldNotification: [],
          newNotificationCout: 0,
          failure: null,
        },
      };
    case DELETE_TOKEN:
      return {
        ...state,
        isFetching: true,
      };
    case success(DELETE_TOKEN):
      return {
        ...state,
        deviceToken: '',
        isFetching: false,
      };
    case failure(DELETE_TOKEN):
      return {
        ...state,
        errorMsg: action,
        isFetching: false,
      };

    case SET_NOTIFICATIONS:
      return {
        ...state,
        notificationList: {
          ...state.notificationList,
          isFetching: true,
          failure: null,
        },
      };
    case success(SET_NOTIFICATIONS):
      const { userInfo } = action;
      let newNotification = [];
      let oldNotification = [];
      let count = 0;
      action?.data?.data?.forEach?.((notif)=>{
          if(notif?.createdAt && moment(notif?.createdAt).format('MM-DD-yyyy')==moment().format('MM-DD-yyyy')){
            newNotification.push(notif);
          }else{
            oldNotification.push(notif);
          } 
          if(!notif?.views){
            count++
          }

      })
      return {
        ...state,
        notificationList:{
          newNotification,
          oldNotification,
          newNotificationCout:count
        }
      };

    case failure(SET_NOTIFICATIONS):
      return {
        ...state,
        notificationList: {
          ...state.notificationList,
          isFetching: false,
          failure: action.errorMsg,
        },
      };
    default:
      return state;
  }
};

export default reducer;
