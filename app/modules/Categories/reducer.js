import { success } from "../utils";

import {
  GET_CATEGORIES,
  GET_CATEGORY_DETAILS,
  CLEAR_CATEGORIES,
  GET_EXPLORE_CATEGORIES,
} from "./constants";

const defaultState = {
  isFetchingCategories: true,
  categoriesList: [],
  categoryDetails: {
    isFetching: true,
    subCategories: [],
  },
};

const reducer = (state = defaultState, { type, response }) => {
  switch (type) {
    case GET_CATEGORIES:
      return {
        ...state,
        isFetchingCategories: false,
        categoriesList: response.data,
      };
    // case success(GET_CATEGORIES):
    //   return {
    //     ...state,
    //     isFetchingCategories: false,
    //     categoriesList: response.data,
    //   };

    case GET_EXPLORE_CATEGORIES:
      return {
        ...state,
        categoriesList: response,
        isFetchingCategories: false,
      };

    case GET_CATEGORY_DETAILS:
      return {
        ...state,
        categoryDetails: {
          ...state.categoryDetails,
          isFetching: true,
        },
      };
    case success(GET_CATEGORY_DETAILS):
      return {
        ...state,
        categoryDetails: {
          ...state.categoryDetails,
          isFetching: false,
          subCategories: response.data,
        },
      };
    case CLEAR_CATEGORIES:
      return {
        ...defaultState,
      };
    default:
      return state;
  }
};

export default reducer;
