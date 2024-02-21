import {
  GET_LISTING_TYPE,
  CLEAR_LISTING_TYPE,
  CLEAR_SELL,
  ADD_PHOTO_TO_LIST,
  REMOVE_PHOTO_FROM_LIST,
  SET_FORM_VALUE,
  GET_MAKE_LIST,
  SET_PHOTO_LIST,
  GET_DELIVERY_METHODS,
  SYNC_SERVER,
  GET_POSTS_DRAFT,
  GET_POSTS_DRAFT_NEXT_PAGE,
  DELETE_POST,
  DELETE_PRODUCT,
  ADD_BOOST_ITEM,
  SET_NEW_FORM,
  SET_PHOTO_LIST_FROM_SERVER,
  UPDATE_POST_STATUS,
  CLEAR_UPDATE_POST_STATUS,
  GET_SHIPPING_RATE,
  CLEAR_DELIVERY_METHODS,
  GET_MINIMUM_SHIPPING_RATE,
  COPY_FORM_DATA,
  COPY_PHOTO_LIST,
  GET_ESTIMATE_TIME,
  SAVE_POST_DETAIL,
  POST_IMAGE_UPLOAD,
  SERVER_SYNC_SUCCESS,
  IS_POST_IMAGE_UPLOAD,
  IS_CHANGE_POST_DETAIL,
} from "./constants";

export const getListingType = () => ({
  type: GET_LISTING_TYPE,
});

export const getEstimateTime = () => ({
  type: GET_ESTIMATE_TIME,
});
export const clearListingType = () => ({
  type: CLEAR_LISTING_TYPE,
});

export const clearSell = () => ({
  type: CLEAR_SELL,
});
export const getMinimumShipRate = (payload) => ({
  type: GET_MINIMUM_SHIPPING_RATE,
  payload,
});

export const addPhotoToList = (payload) => ({
  type: ADD_PHOTO_TO_LIST,
  response: payload,
});

export const setCopyFormData = (payload) => ({
  type: COPY_FORM_DATA,
  response: payload,
});

export const setCopyPhotoList = (payload) => ({
  type: COPY_PHOTO_LIST,
  response: payload,
});

export const removePhotoFromList = ({ index }) => ({
  type: REMOVE_PHOTO_FROM_LIST,
  response: { index },
});

export const setFormValue = (payload) => ({
  type: SET_FORM_VALUE,
  response: payload,
});

export const getMakeList = (payload) => ({
  type: GET_MAKE_LIST,
  payload,
});

export const setPhotoList = (payload) => ({
  type: SET_PHOTO_LIST,
  response: payload,
});
export const setBoostItem = (payload) => ({
  type: ADD_BOOST_ITEM,
  response: payload,
});

export const getDeliveryMethods = (payload) => ({
  type: GET_DELIVERY_METHODS,
  payload,
});

export const clearDeliveryMethods = (payload) => ({
  type: CLEAR_DELIVERY_METHODS,
  payload,
});

export const syncServer = (payload) => ({
  type: SYNC_SERVER,
  payload,
});

export const syncServerSuccess = (payload) => ({
  type: SERVER_SYNC_SUCCESS,
  response: payload,
});

export const getPostsDraft = ({ filters }) => ({
  type: GET_POSTS_DRAFT,
  payload: filters,
});

export const getPostsDraftNextPage = ({ filters }) => ({
  type: GET_POSTS_DRAFT_NEXT_PAGE,
  payload: filters,
});

export const deletePost = (payload) => ({
  type: DELETE_POST,
  payload,
});

export const deleteProduct = (payload) => ({
  type: DELETE_PRODUCT,
  payload,
});

export const setNewForm = (payload) => ({
  type: SET_NEW_FORM,
  response: payload,
});

export const setPhotoListFromServer = (payload) => ({
  type: SET_PHOTO_LIST_FROM_SERVER,
  response: payload,
});

export const updatePostStatus = (payload) => ({
  type: UPDATE_POST_STATUS,
  payload,
});

export const clearUpdatePostStatus = () => ({
  type: CLEAR_UPDATE_POST_STATUS,
});

export const getShipRate = (payload) => ({
  type: GET_SHIPPING_RATE,
  payload,
});

export const postImageUpload = (payload) => ({
  type: POST_IMAGE_UPLOAD,
  response: payload,
});

export const isPostImageUploaded = (payload) => ({
  type: IS_POST_IMAGE_UPLOAD,
  response: payload,
});

export const savePostDetail = (payload) => ({
  type: SAVE_POST_DETAIL,
  response: payload,
});
export const changePostDetail = (payload) => {
  return {
    type: IS_CHANGE_POST_DETAIL,
    response: payload,
  };
};
