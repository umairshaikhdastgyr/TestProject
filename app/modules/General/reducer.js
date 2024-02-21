import _ from "lodash";
import { success, failure } from "../utils";
import { GET_CONTENT_INFO, SEND_FEEDBACK, SEND_EXPRESSION } from "./constants";

const defaultState = {
  contentState: {
    isFetching: false,
    data: [],
    failure: ""
  },
  sendFeedbackState: {
    isFetching: false,
    data: null,
    failure: ""
  },
  sendExpressionState: {
    isFetching: false,
    data: null,
    failure: ""
  }
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_CONTENT_INFO:
      return {
        ...state,
        contentState: {
          data: [],
          failure: "",
          isFetching: true
        }
      };
    case success(GET_CONTENT_INFO):
      return {
        ...state,
        contentState: {
          ...state.contentState,
          data: action.data,
          isFetching: false
        }
      };

    case failure(GET_CONTENT_INFO):
      return {
        ...state,
        contentState: {
          ...state.contentState,
          isFetching: false,
          failure: action.errorMsg
        }
      };

    case SEND_FEEDBACK:
      return {
        ...state,
        sendFeedbackState: {
          data: null,
          failure: "",
          isFetching: true
        }
      };
    case success(SEND_FEEDBACK):
      return {
        ...state,
        sendFeedbackState: {
          ...state.sendFeedbackState,
          data: action.data,
          isFetching: false
        }
      };

    case failure(SEND_FEEDBACK):
      return {
        ...state,
        sendFeedbackState: {
          ...state.sendFeedbackState,
          isFetching: false,
          failure: action.errorMsg
        }
      };

    case SEND_EXPRESSION:
      return {
        ...state,
        sendExpressionState: {
          data: null,
          failure: "",
          isFetching: true
        }
      };
    case success(SEND_EXPRESSION):
      return {
        ...state,
        sendExpressionState: {
          ...state.sendExpressionState,
          data: action.data,
          isFetching: false
        }
      };

    case failure(SEND_EXPRESSION):
      return {
        ...state,
        sendExpressionState: {
          ...state.sendExpressionState,
          isFetching: false,
          failure: action.errorMsg
        }
      };
    default:
      return state;
  }
};

export default reducer;
