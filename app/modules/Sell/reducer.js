import { success, failure } from "../utils";

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
  GET_SHIPPING_RATE,
  CLEAR_DELIVERY_METHODS,
  GET_MINIMUM_SHIPPING_RATE,
  COPY_FORM_DATA,
  COPY_PHOTO_LIST,
  GET_ESTIMATE_TIME,
  CLEAR_UPDATE_POST_STATUS,
  SAVE_POST_DETAIL,
  POST_IMAGE_UPLOAD,
  SERVER_SYNC_SUCCESS,
  IS_POST_IMAGE_UPLOAD,
  IS_CHANGE_POST_DETAIL,
} from "./constants";

const defaultState = {
  draftsList: [],
  postDetailforBoost: {},
  isFetchingDrafts: false,
  isFetchingDraftsMorePage: false,
  noMorePostsDrafts: false,
  isFetchingServer: false,
  errorFromServer: "",
  isFetchingListingType: true,
  listingTypeList: [],
  isExistPhotoData: false,
  photosList: [],
  photosListInServer: [],
  deliveryMethods: {
    isFetching: false,
    data: [],
    error: "",
  },
  formData: {
    postId: "",
    productId: "",
    listingType: {},
    category: {},
    subCategory: {},
    postTitle: "",
    postDescription: "",
    userLocation: {
      latitude: "",
      longitude: "",
    },
    location: {},
    condition: [1],
    price: "",
    isNegotiable: false,
    shareOnFacebook: false,
    deliveryMethodsSelected: [],
    paymentMethodsSelected: [],
    customProperties: {},
    postStatus: { id: "a0a6d994-e31a-4cd7-a107-7c630e5e1c90", name: "Draft" },
    productStatus: {
      id: "a6d85682-c1f5-408f-8ef9-fffb6f0ddb48",
      name: "Draft",
    },
    success: false,
    error: null,
  },
  optionsFromBack: {
    make: {
      isFetching: true,
      list: [],
    },
  },
  updatePostStatus: {
    isFetching: false,
    data: null,
    failure: null,
    rediecrtParam: null,
  },
  shippingRate: {
    isFetching: false,
    data: null,
    failure: null,
  },
  estimateTime: {
    isFetching: false,
    data: null,
    failure: null,
  },
  minShippingRate: {
    isFetching: false,
    data: null,
    failure: null,
  },
  copyFormData: null,
  copyPhotoList: null,
  success: false,
  isPostImageUpload: false,
  postImageUploaded: [],
  savePostDetailData: {},
  isChangePostDetail: false,
};

const reducer = (
  state = defaultState,
  { type, response, data, errorMsg, rediecrtParam }
) => {
  switch (type) {
    case GET_LISTING_TYPE:
      return {
        ...state,
        isFetchingListingType: true,
        listingTypeList: [],
      };

    case success(GET_LISTING_TYPE):
      return {
        ...state,
        isFetchingListingType: false,
        listingTypeList: response.data,
      };

    case CLEAR_LISTING_TYPE:
      return {
        ...state,
        isFetchingListingType: false,
        listingTypeList: [],
      };

    case ADD_PHOTO_TO_LIST:
      return {
        ...state,
        photosList: [...state.photosList, ...[response]],
      };
    case REMOVE_PHOTO_FROM_LIST: {
      return {
        ...state,
        photosList: [...state.photosList].filter(
          (photo, index) => index !== response.index
        ),
      };
    }
    case ADD_BOOST_ITEM:
      return {
        ...state,
        postDetailforBoost: response,
      };
    case CLEAR_SELL:
      return {
        ...defaultState,
        draftsList: [...state.draftsList],
        listingTypeList: [...state.listingTypeList],
        postDetailforBoost: state.postDetailforBoost,
        copyPhotoList: null,
        copyFormData: null,
      };

    case SET_FORM_VALUE:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...response,
        },
      };

    case success(GET_MAKE_LIST):
      return {
        ...state,
        optionsFromBack: {
          ...state.optionsFromBack,
          make: {
            isFetching: false,
            list: response.data,
          },
        },
      };

    case SET_PHOTO_LIST:
      return {
        ...state,
        photosList: response,
      };

    case SET_PHOTO_LIST_FROM_SERVER:
      return {
        ...state,
        photosListInServer: response,
      };

    case GET_DELIVERY_METHODS:
      return {
        ...state,
        deliveryMethods: {
          isFetching: true,
        },
      };

    case CLEAR_DELIVERY_METHODS:
      return {
        ...state,
        deliveryMethods: {
          isFetching: false,
          data: [],
        },
      };

    case success(GET_DELIVERY_METHODS):
      return {
        ...state,
        deliveryMethods: {
          isFetching: false,
          data: response.data,
        },
      };
    case failure(GET_DELIVERY_METHODS):
      return {
        ...state,
        deliveryMethods: {
          isFetching: false,
          error: response.error,
        },
      };

    case SYNC_SERVER:
      return {
        ...state,
        formData: {
          ...state.formData,
          success: false,
          error: null,
        },
        isFetchingServer: true,
      };
    case success(SYNC_SERVER):
      return {
        ...state,
        isFetchingServer: false,
        errorFromServer: "",
        formData: {
          ...state.formData,
          ...response,
          success: true,
        },
      };
    case failure(SYNC_SERVER):
      return {
        ...state,
        isFetchingServer: false,
        errorFromServer: response.error,
        formData: {
          ...state.formData,
          success: false,
          error: response.error,
        },
      };

    case SERVER_SYNC_SUCCESS:
      return {
        ...state,
        isFetchingServer: false,
        errorFromServer: "",
        formData: {
          ...state.formData,
          ...response,
          success: true,
        },
      };

    case GET_POSTS_DRAFT:
      return {
        ...state,
        isFetchingDrafts: true,
      };

    case success(GET_POSTS_DRAFT):
      if (response.data && response.data.length) {
        const newDraftResp = response.data.filter?.((item) => {
          if (item?.PostStatus?.name != "Draft") {
            return false;
          }
          return !item?.Product?.ProductImages[0] ||
            !item?.Product?.ProductImages[0].urlImage
            ? false
            : true;
        });
        return {
          ...state,
          isFetchingDrafts: false,
          noMorePostsDrafts: false,
          draftsList: newDraftResp,
        };
      } else {
        return {
          ...state,
          isFetchingDrafts: false,
          noMorePostsDrafts: false,
          draftsList: [],
        };
      }
    case GET_POSTS_DRAFT_NEXT_PAGE:
      return {
        ...state,
        isFetchingDraftsMorePage: true,
      };

    case success(GET_POSTS_DRAFT_NEXT_PAGE):
      if (response.data && response.data.length) {
        const newDraftResp = response.data.filter?.((item) => {
          if (item?.PostStatus?.name != "Draft") {
            return false;
          }
          return !item?.Product?.ProductImages[0] ||
            !item?.Product?.ProductImages[0].urlImage
            ? false
            : true;
        });

        return {
          ...state,
          isFetchingDraftsMorePage: false,
          noMorePostsDrafts: response.data.length === 0,
          draftsList: [...state.draftsList, ...newDraftResp],
        };
      } else {
        return {
          ...state,
          isFetchingDraftsMorePage: false,
          noMorePostsDrafts: response.data.length === 0,
          draftsList: [...state.draftsList],
        };
      }

    case DELETE_POST:
      return {
        ...state,
        success: false,
        isFetchingServer: true,
      };
    case success(DELETE_POST):
      return {
        ...state,
        success: true,
        isFetchingServer: false,
      };
    case failure(DELETE_POST):
      return {
        ...state,
        isFetchingServer: false,
      };

    case SET_NEW_FORM:
      return {
        ...state,
        formData: {
          ...defaultState.formData,
          ...response,
        },
      };
    case CLEAR_UPDATE_POST_STATUS:
      return {
        ...state,
        updatePostStatus: {
          ...state.updatePostStatus,
          isFetching: false,
          data: null,
          rediecrtParam: null,
        },
      };
    case UPDATE_POST_STATUS:
      return {
        ...state,
        updatePostStatus: {
          ...state.updatePostStatus,
          isFetching: true,
          data: null,
          rediecrtParam: null,
        },
      };
    case success(UPDATE_POST_STATUS):
      return {
        ...state,
        updatePostStatus: {
          ...state.updatePostStatus,
          isFetching: false,
          failure: "",
          data,
          rediecrtParam,
        },
      };
    case failure(UPDATE_POST_STATUS):
      return {
        ...state,
        updatePostStatus: {
          ...state.updatePostStatus,
          isFetching: false,
          failure: errorMsg,
        },
      };
    case GET_SHIPPING_RATE:
      return {
        ...state,
        shippingRate: {
          ...state.shippingRate,
          isFetching: true,
          data: null,
          failure: null,
        },
      };
    case success(GET_SHIPPING_RATE):
      return {
        ...state,
        shippingRate: {
          ...state.shippingRate,
          isFetching: false,
          failure: "",
          data,
        },
      };
    case failure(GET_SHIPPING_RATE):
      return {
        ...state,
        shippingRate: {
          ...state.shippingRate,
          isFetching: false,
          failure: errorMsg,
        },
      };
    case GET_MINIMUM_SHIPPING_RATE:
      return {
        ...state,
        minShippingRate: {
          ...state.minShippingRate,
          isFetching: true,
          data: null,
          failure: null,
        },
      };
    case success(GET_MINIMUM_SHIPPING_RATE):
      return {
        ...state,
        minShippingRate: {
          ...state.minShippingRate,
          isFetching: false,
          failure: "",
          data: response,
        },
      };
    case failure(GET_MINIMUM_SHIPPING_RATE):
      return {
        ...state,
        minShippingRate: {
          ...state.minShippingRate,
          isFetching: false,
          failure: errorMsg,
        },
      };
    case GET_ESTIMATE_TIME:
      return {
        ...state,
        estimateTime: {
          ...state.estimateTime,
          isFetching: true,
          data: null,
          failure: null,
        },
      };
    case success(GET_ESTIMATE_TIME):
      return {
        ...state,
        estimateTime: {
          ...state.estimateTime,
          isFetching: false,
          failure: "",
          data: response,
        },
      };
    case failure(GET_ESTIMATE_TIME):
      return {
        ...state,
        estimateTime: {
          ...state.estimateTime,
          isFetching: false,
          failure: errorMsg,
        },
      };
    case COPY_PHOTO_LIST:
      return {
        ...state,
        copyPhotoList: response,
      };
    case COPY_FORM_DATA:
      return {
        ...state,
        copyFormData: response,
      };
    case POST_IMAGE_UPLOAD:
      return {
        ...state,
        postImageUploaded: response,
      };
    case IS_POST_IMAGE_UPLOAD:
      return {
        ...state,
        isPostImageUpload: response,
      };
    case SAVE_POST_DETAIL:
      return {
        ...state,
        savePostDetailData: response,
      };
    case IS_CHANGE_POST_DETAIL:
      return {
        ...state,
        isChangePostDetail: response,
      };

    default:
      return state;
  }
};

export default reducer;
