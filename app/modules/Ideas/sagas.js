import {call, put, takeLatest} from 'redux-saga/effects';

import {
  getAlbumsIdeas as getAlbumsIdeasApi,
  postAlbumIdea as postAlbumIdeaApi,
  postSavePostToAlbumIdea as postSavePostToAlbumIdeaApi,
  getAlbumIdeasDetail as getAlbumIdeasDetailApi,
  patchAlbumIdea as patchAlbumIdeaApi,
  deleteAlbumIdea as deleteAlbumIdeaApi,
  patchMoveIdeaToAnotherAlbum as patchMoveIdeaToAnotherAlbumApi,
  deleteIdeaFromAlbum as deleteIdeaFromAlbumApi,
  getIdeaAlbumDetail as getIdeaAlbumDetailApi,
  deleteIdeaGlobally as deleteIdeaGloballyApi,
  getAlbumIdeasRelatedPost,
  getAlbumIdeasSavedPost,
} from '#services/apiIdeas';
import {
  GET_ALBUMS_IDEAS,
  CREATE_ALBUM_IDEA,
  SAVE_POST_TO_ALBUM_IDEA,
  GET_ALBUM_IDEAS_DETAIL,
  UPDATE_ALBUM_IDEA,
  DELETE_ALBUM_IDEA,
  MOVE_IDEA_TO_ANOTHER_ALBUM,
  DELETE_IDEA_FROM_ALBUM,
  GET_IDEA_ALBUM_DETAIL,
  DELETE_IDEA_GLOBALLY,
  FOLLOWER_IDEAS,
  GET_ALBUM_IDEAS_RELATED_POST,
  GET_ALBUM_IDEAS_NEXT_RELATED_POST,
  GET_ALBUM_IDEAS_SAVED_POST,
  GET_ALBUM_IDEAS_NEXT_SAVED_POST,
} from './constants';
import {success, failure} from '../utils';

function* fetchAlbumsIdeas({type, payload}) {
  const data = yield call(getAlbumsIdeasApi, payload);
  if (!data.error) {
    yield put({type: success(type), data});
  } else {
    yield put({type: failure(type), data});
  }
}

function* fetchFollowerAlbumsIdeas({type, payload}) {
  const data = yield call(getAlbumsIdeasApi, payload);
  if (!data.error) {
    yield put({type: success(type), data});
  } else {
    yield put({type: failure(type), data});
  }
}

function* postAlbumIdea({type, payload}) {
  let data = yield call(postAlbumIdeaApi, payload);
  if (!data.error) {
    data.Posts = [];
    yield put({type: success(type), data});
  } else {
    yield put({type: failure(type), data});
  }
}

function* savePostToAlbumIdea({type, payload}) {
  const data = yield call(postSavePostToAlbumIdeaApi, payload);
  //yield put({ type: "UPDATE_USER_SELL", data: null });
  if (!data.error) {
    yield put({type: success(type), data: {...data, ...payload}});
    yield put({type: 'UPDATE_USER_SELL_LIST', data: {...data}});
  } else {
    yield put({type: failure(type), data});
  }
}

function* fetchAlbumIdeasDetail({type, payload}) {
  const data = yield call(getAlbumIdeasDetailApi, payload);
  if (!data.error) {
    yield put({type: success(type), data});
  } else {
    yield put({type: failure(type), data});
  }
}

function* fetchAlbumSavedPost({type, payload}) {
  const data = yield call(getAlbumIdeasSavedPost, payload);
  if (!data.error) {
    yield put({type: success(type), data});
  } else {
    yield put({type: failure(type), data});
  }
}

function* fetchAlbumRelatedPost({type, payload}) {
  const data = yield call(getAlbumIdeasRelatedPost, payload);
  if (!data.error) {
    yield put({type: success(type), data});
  } else {
    yield put({type: failure(type), data});
  }
}

function* patchAlbumIdea({type, payload}) {
  const data = yield call(patchAlbumIdeaApi, payload);
  if (!data.error) {
    yield put({type: success(type), data});
  } else {
    yield put({type: failure(type), data});
  }
}

function* deleteAlbumIdea({type, payload}) {
  yield call(deleteAlbumIdeaApi, payload);
  yield put({type: success(type), data: {id: payload.ideasAlbumId}});
}

function* patchMoveIdeaToAnotherAlbum({type, payload}) {
  const data = yield call(patchMoveIdeaToAnotherAlbumApi, payload);
  if (!data.error) {
    yield put({type: success(type), data: {...data, ...payload}});
  } else {
    yield put({type: failure(type), data});
  }
}

function* deleteIdeaFromAlbum({type, payload}) {
  yield call(deleteIdeaFromAlbumApi, payload);
  yield put({
    type: success(type),
    data: payload,
  });
}

function* getIdeaAlbumDetail({type, payload}) {
  const data = yield call(getIdeaAlbumDetailApi, payload);
  if (!data.error) {
    yield put({type: success(type), data});
  } else {
    yield put({type: failure(type), data});
  }
}

function* deleteIdeaGlobally({type, payload}) {
  yield call(deleteIdeaGloballyApi, payload);
  yield put({
    type: success(type),
    data: payload,
  });
}

export default function* actionWatcher() {
  yield takeLatest(GET_ALBUMS_IDEAS, fetchAlbumsIdeas);
  yield takeLatest(FOLLOWER_IDEAS, fetchFollowerAlbumsIdeas);
  yield takeLatest(CREATE_ALBUM_IDEA, postAlbumIdea);
  yield takeLatest(SAVE_POST_TO_ALBUM_IDEA, savePostToAlbumIdea);
  yield takeLatest(GET_ALBUM_IDEAS_DETAIL, fetchAlbumIdeasDetail);
  yield takeLatest(GET_ALBUM_IDEAS_SAVED_POST, fetchAlbumSavedPost);
  yield takeLatest(GET_ALBUM_IDEAS_NEXT_SAVED_POST, fetchAlbumSavedPost);
  yield takeLatest(GET_ALBUM_IDEAS_RELATED_POST, fetchAlbumRelatedPost);
  yield takeLatest(GET_ALBUM_IDEAS_NEXT_RELATED_POST, fetchAlbumRelatedPost);
  yield takeLatest(UPDATE_ALBUM_IDEA, patchAlbumIdea);
  yield takeLatest(DELETE_ALBUM_IDEA, deleteAlbumIdea);
  yield takeLatest(MOVE_IDEA_TO_ANOTHER_ALBUM, patchMoveIdeaToAnotherAlbum);
  yield takeLatest(DELETE_IDEA_FROM_ALBUM, deleteIdeaFromAlbum);
  yield takeLatest(GET_IDEA_ALBUM_DETAIL, getIdeaAlbumDetail);
  yield takeLatest(DELETE_IDEA_GLOBALLY, deleteIdeaGlobally);
}
