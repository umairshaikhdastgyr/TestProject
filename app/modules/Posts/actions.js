import {
  GET_POSTS,
  GET_OFFLINE_POSTS,
  GET_POSTS_NEXT_PAGE,
  GET_POST_DETAIL,
  GET_SIMILAR_POSTS,
  GET_NEARBY_POSTS,
  CLEAR_POSTS,
  GET_EXPLORE_POSTS,
  POST_LOADER,
} from './constants';

export const getPosts = (payload) => ({
  type: GET_POSTS,
  data: payload,
});

export const postsLoader = (payload) => ({
  type: POST_LOADER,
  data: payload,
});

export const getOfflinePosts = payload => ({
  type: GET_OFFLINE_POSTS,
  data: payload,
});

export const getExplorePosts = payload => ({
  type: GET_EXPLORE_POSTS,
  data: payload,
});

export const getPostNextPage = (payload) => ({
  type: GET_POSTS_NEXT_PAGE,
  data: payload,
});

export const getPostDetail = payload => ({
  type: GET_POST_DETAIL,
  payload,
});

export const getSimilarPosts = ({ filters }) => ({
  type: GET_SIMILAR_POSTS,
  payload: filters,
});

export const getNearbyPosts = ({ filters }) => ({
  type: GET_NEARBY_POSTS,
  payload: filters,
});

export const clearPosts = () => ({
  type: CLEAR_POSTS,
});
