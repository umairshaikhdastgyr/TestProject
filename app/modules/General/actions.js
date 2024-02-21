import { GET_CONTENT_INFO, SEND_FEEDBACK, SEND_EXPRESSION } from "./constants";

export const getContent = payload => ({
  type: GET_CONTENT_INFO,
  payload
});

export const sendFeedback = payload => ({
  type: SEND_FEEDBACK,
  payload
});

export const sendExpression = payload => ({
  type: SEND_EXPRESSION,
  payload
});
