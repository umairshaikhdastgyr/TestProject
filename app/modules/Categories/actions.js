import {
  GET_CATEGORIES,
  GET_CATEGORY_DETAILS,
  CLEAR_CATEGORIES,
  GET_EXPLORE_CATEGORIES,
} from './constants';

export const getCategories = (payload) => ({
  type: GET_CATEGORIES,
  response: payload,
});

export const getExploreCategories = (payload) => ({
  type: GET_EXPLORE_CATEGORIES,
  response: payload,
});

export const getCategoryDetails = payload => ({
  type: GET_CATEGORY_DETAILS,
  payload,
});

export const clearCategories = () => ({
  type: CLEAR_CATEGORIES,
});
