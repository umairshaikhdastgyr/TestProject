import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getPosts as getPostsApi,
  getPostDetail as getPostDetailApi,
} from '#services/apiPosts';
import {
  GET_POSTS,
  GET_POSTS_NEXT_PAGE,
  GET_POST_DETAIL,
  GET_SIMILAR_POSTS,
  GET_NEARBY_POSTS,
} from './constants';

import { success, failure } from '../utils';

function* fetchPosts({ type, payload }) {
  if(type == "GET_POSTS" || type == "GET_POSTS_NEXT_PAGE" ){
    payload.v2 = true
  }
  const data = yield call(getPostsApi, payload);
  if (!data.error) {
    yield put({ type: success(type), data });
  } else {
    yield put({ type: failure(type), data });
  }
}

function* fetchPostDetail({ type, payload }) {
  const data = yield call(getPostDetailApi, {
    postId: payload.postId,
    params: payload.params,
  });

  if (!data.error) {
    yield put({ type: success(type), data });
  } else {
    yield put({ type: failure(type), data });
  }
}

export default function* actionWatcher() {
  // yield takeLatest(GET_POSTS, fetchPosts);
  // yield takeLatest(GET_POSTS_NEXT_PAGE, fetchPosts);
  yield takeLatest(GET_SIMILAR_POSTS, fetchPosts);
  yield takeLatest(GET_NEARBY_POSTS, fetchPosts);
  yield takeLatest(GET_POST_DETAIL, fetchPostDetail);
}
