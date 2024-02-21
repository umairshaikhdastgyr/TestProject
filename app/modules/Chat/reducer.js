import moment from 'moment';
import { success, failure } from '../utils';

import {
  SET_CHAT_DATA,
  RECEIVE_CHAT_MSG,
  CLEAR_CHAT,
  SEND_MESSAGE,
  RECEIVE_CONVERSATIONS,
  GET_CHAT_DATA,
  CLEAR_BADGE,
  SEEN_CONVERSATION,
  UPDATE_CONVERSATION_VISIBILITY,
} from './constants';

const defaultState = {
  isFetching: false,
  chatInfo: {},
  errorMsg: '',
  conversationToSeen: '',
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_CHAT_DATA:
      return {
        ...state,
        isFetching: false,
      };
    case success(SET_CHAT_DATA):
      return {
        ...state,
        isFetching: false,
      };
    case failure(SET_CHAT_DATA):
      return {
        ...state,
        isFetching: false,
      };
    case RECEIVE_CHAT_MSG:
      return {
        ...state,
        isFetching: true,
      };
    case success(RECEIVE_CHAT_MSG):
      return {
        ...state,
        chatInfo: action.newData,
        errorMsg: '',
        isFetching: false,
      };
    case failure(RECEIVE_CHAT_MSG):
      return {
        ...state,
        errorMsg: action,
        isFetching: false,
      };
    case CLEAR_CHAT:
      return {
        ...defaultState,
      };
    case SEND_MESSAGE:
      return {
        ...state,
        errorMsg: '',
        isFetching: true,
      };
    case success(SEND_MESSAGE):
      return {
        ...state,
        chatInfo: action.newData,
        errorMsg: '',
        isFetching: false,
      };
    case failure(SEND_MESSAGE):
      return {
        ...state,
        isFetching: false,
        errorMsg: action,
      };
    case RECEIVE_CONVERSATIONS:
      return {
        ...state,
        errorMsg: '',
        isFetching: true,
      };
    case success(RECEIVE_CONVERSATIONS):
      return {
        ...state,
        errorMsg: '',
        chatInfo: action.newData,
        isFetching: false,
      };
    case failure(RECEIVE_CONVERSATIONS):
      return {
        ...state,
        errorMsg: action,
        isFetching: false,
      };
    case GET_CHAT_DATA:
      return {
        ...state,
        errorMsg: '',
        isFetching: true,
      };
    case success(GET_CHAT_DATA):
      return {
        ...state,
        errorMsg: '',
        chatInfo: action.newData,
        isFetching: false,
      };
    case failure(GET_CHAT_DATA):
      return {
        ...state,
        errorMsg: action,
        isFetching: false,
      };
    case CLEAR_BADGE:
      return {
        ...state,
        errorMsg: '',
        isFetching: false,
      };
    case success(CLEAR_BADGE):
      return {
        ...state,
        errorMsg: '',
        chatInfo: action.newData,
        isFetching: false,
      };
    case failure(CLEAR_BADGE):
      return {
        ...state,
        errorMsg: '',
        isFetching: false,
      };
    case SEEN_CONVERSATION:
      return {
        ...state,
        errorMsg: '',
        conversationToSeen: '',
      };
    case success(SEEN_CONVERSATION):
      return {
        ...state,
        errorMsg: '',
        conversationToSeen: action.conversationId,
        chatInfo: action.newData ? action.newData : state.chatInfo,
      };
    case UPDATE_CONVERSATION_VISIBILITY:
      return {
        ...state,
        errorMsg: '',

      };
    case success(UPDATE_CONVERSATION_VISIBILITY):
      return {
        ...state,
        errorMsg: '',
        chatInfo: action.newData ? action.newData : state.chatInfo,
      };
    default:
      return state;
  }
};

export default reducer;
