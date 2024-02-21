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

export const getChatData = () => ({
  type: GET_CHAT_DATA,
});

export const setChatData = payload => ({
  type: SET_CHAT_DATA,
  payload,
});

export const receiveChatMsg = (payload, userId) => ({
  type: RECEIVE_CHAT_MSG,
  payload,
  userId,
});

export const clearChat = () => ({
  type: CLEAR_CHAT,
});

export const sendMessage = payload => ({
  type: SEND_MESSAGE,
  payload,
});

export const receiveConversations = payload => ({
  type: RECEIVE_CONVERSATIONS,
  payload,
});

export const clearBadges = payload => ({
  type: CLEAR_BADGE,
  payload,
});

export const seenConversation = payload => ({
  type: SEEN_CONVERSATION,
  payload,
});

export const updateConversationVisiblity = payload => ({
  type: UPDATE_CONVERSATION_VISIBILITY,
  payload,
});
