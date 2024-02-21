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
  CLEAR_IDEAS,
  DELETE_IDEA_GLOBALLY,
  FOLLOWER_IDEAS,
  GET_ALBUM_IDEAS_RELATED_POST,
  GET_ALBUM_IDEAS_NEXT_RELATED_POST,
  GET_ALBUM_IDEAS_NEXT_SAVED_POST,
  GET_ALBUM_IDEAS_SAVED_POST,
  ADD_FAVORITE_RELATED_POST,
  REMOVE_FAVORITE_RELATED_POST
} from "./constants";

export const getAlbumsIdeas = ({ params }) => ({
  type: GET_ALBUMS_IDEAS,
  payload: params
});

export const fetchFollowerAlbumsIdeas = ({ params }) => ({
  type: FOLLOWER_IDEAS,
  payload: params
});

export const createAlbumIdea = payload => ({
  type: CREATE_ALBUM_IDEA,
  payload
});

export const savePostToAlbumIdea = payload => ({
  type: SAVE_POST_TO_ALBUM_IDEA,
  payload
});

export const getAlbumIdeasDetail = payload => ({
  type: GET_ALBUM_IDEAS_DETAIL,
  payload
});

export const getAlbumIdeasRelatedPost = payload => ({
  type: GET_ALBUM_IDEAS_RELATED_POST,
  payload
});

export const getAlbumIdeasNextRelatedPost = payload => ({
  type: GET_ALBUM_IDEAS_NEXT_RELATED_POST,
  payload
});

export const addFavoriteRelatedPost = payload => ({
  type: ADD_FAVORITE_RELATED_POST,
  data: payload
});

export const removeFavoriteRelatedPost = payload => ({
  type: REMOVE_FAVORITE_RELATED_POST,
  data: payload
});

export const getAlbumIdeasSavedPost = payload => ({
  type: GET_ALBUM_IDEAS_SAVED_POST,
  payload
});

export const getAlbumIdeasNextSavedPost = payload => ({
  type: GET_ALBUM_IDEAS_NEXT_SAVED_POST,
  payload
});

export const updateAlbumIdea = payload => ({
  type: UPDATE_ALBUM_IDEA,
  payload
});

export const deleteAlbumIdea = payload => ({
  type: DELETE_ALBUM_IDEA,
  payload
});

export const moveIdeaToAnotherAlbum = payload => ({
  type: MOVE_IDEA_TO_ANOTHER_ALBUM,
  payload
});

export const deleteIdeaFromAlbum = payload => ({
  type: DELETE_IDEA_FROM_ALBUM,
  payload
});

export const getIdeaAlbumDetail = payload => ({
  type: GET_IDEA_ALBUM_DETAIL,
  payload
});

export const clearIdeas = () => ({
  type: CLEAR_IDEAS
});

export const deleteIdeaGlobally = payload => ({
  type: DELETE_IDEA_GLOBALLY,
  payload
});
