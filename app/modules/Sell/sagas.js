import {call, put, takeLatest} from 'redux-saga/effects';

import {Platform} from 'react-native';

import _ from 'lodash';
import {getListingType as getListingTypeApi} from '#services/api';
import {
  getMakeList as getMakeListApi,
  getDeliveryMethods as getDeliveryMethodsApi,
} from '#services/apiCatalog';
import {
  getPosts as getPostsApi,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  createPost as createPostApi,
  updatePost as updatePostApi,
  createImageToPost as createImageToPostApi,
  deletePost as deletePostApi,
  deleteProduct as deleteProductApi,
  deleteImageFromPost as deleteImageFromPostApi,
  getMinimumShippingRate as getMinimumShippingRateApi,
  getEstimateTime as getEstimateTimeApi,
  updatePostImage,
} from '#services/apiPosts';

import {fetchSellProductList} from '../User/sagas';
import {getPostDetail as getPostDetailApi} from '#services/apiPosts';

import {shippingRate as shippingRateApi} from '#services/apiOrders';

import {
  GET_LISTING_TYPE,
  GET_MAKE_LIST,
  GET_DELIVERY_METHODS,
  SYNC_SERVER,
  GET_POSTS_DRAFT,
  GET_POSTS_DRAFT_NEXT_PAGE,
  DELETE_POST,
  DELETE_PRODUCT,
  UPDATE_POST_STATUS,
  GET_SHIPPING_RATE,
  GET_MINIMUM_SHIPPING_RATE,
  GET_ESTIMATE_TIME,
  ADD_BOOST_ITEM,
} from './constants';
import {success, failure} from '../utils';

function* fetchListingType() {
  const response = yield call(getListingTypeApi);
  yield put({type: success(GET_LISTING_TYPE), response});
}

function* fetchMakeList({type, payload}) {
  const response = yield call(getMakeListApi, payload);
  yield put({type: success(type), response});
}

function* getDeliveryMethods({type, payload}) {
  const response = yield call(getDeliveryMethodsApi, payload);

  // console.log("zzzzpppp");
  // console.log(response);
  if (response.error) {
    yield put({type: failure(type), response});
  } else {
    yield put({type: success(type), response});
  }
}

function* syncServer({type, payload}) {
  var newPostId = '';
  const dataToProduct = {};
  const dataToPost = {};
  dataToProduct.userId = payload.userId;

  const responseFromServers = {postId: '', productId: '', images: []};

  if (payload?.formData?.productId) {
    dataToProduct.productId = payload.formData.productId;
    dataToPost.product = payload.formData.productId;
  }
  if (payload?.formData?.postTitle) {
    dataToProduct.title = payload.formData.postTitle;
  }
  if (payload?.formData?.postDescription) {
    dataToProduct.description = payload.formData.postDescription;
  }

  dataToProduct.customProperties = {};
  dataToProduct.customProperties.origin = 'app';

  if (Object.keys(payload.formData.customProperties).length > 0) {
    dataToProduct.customProperties = payload.formData.customProperties;
  }

  if (Object.keys(payload.formData.listingType).length > 0) {
    dataToProduct.customProperties.listingType = payload.formData.listingType;
  }

  if (Object.keys(payload.formData.category).length > 0) {
    dataToProduct.customProperties.category = {};
    dataToProduct.customProperties.category.id = payload.formData.category.id;
    dataToProduct.customProperties.category.name =
      payload.formData.category.name;
  }

  if (Object.keys(payload.formData.productStatus).length > 0) {
    dataToProduct.productStatus = payload.formData.productStatus.id;
  }
  if (Object.keys(payload.formData.subCategory).length > 0) {
    dataToProduct.category = payload.formData.subCategory.id;
  }
  if (payload.draft) {
    dataToProduct.customProperties.lastScreen = payload.lastScreen;
    payload.formData.postStatus.name = 'Draft';
  }
  if (payload.formData.postStatus.name === 'Draft') {
    dataToProduct.customProperties.lastScreen = payload.lastScreen;
  }
  dataToPost.userId = payload.userId;

  if (payload?.formData?.postId) {
    dataToPost.postId = payload.formData.postId;
  }
  if (Object.keys(payload.formData.location).length > 0) {
    dataToPost.location = payload.formData.location.googleObj;
  }
  if (payload?.formData?.price) {
    dataToPost.initialPrice = Number(payload.formData.price);
  }
  dataToPost.isNegotiable = payload.formData.isNegotiable;
  dataToPost.shareOnFacebook = payload.formData.shareOnFacebook;
  dataToPost.availableQuantity = 1;
  dataToPost.quantityForSale = 1;

  if (Object.keys(payload.formData.postStatus).length > 0) {
    dataToPost.postStatus = payload.formData.postStatus.id;
  }
  if (payload.formData.deliveryMethodsSelected.length > 0) {
    dataToPost.deliveryMethods = payload.formData.deliveryMethodsSelected;

    let paymentMethods = [];
    for (let i = 0; i < dataToPost.deliveryMethods.length; i++) {
      dataToPost.deliveryMethods[i].DeliveryMethodPerPost = {};
      dataToPost.deliveryMethods[i].DeliveryMethodPerPost.customProperties =
        dataToPost.deliveryMethods[i].deliveryCustomProperties;
      if (
        dataToPost.deliveryMethods[i].DeliveryMethodPerPost.customProperties ===
          undefined ||
        dataToPost.deliveryMethods[i].DeliveryMethodPerPost.customProperties ===
          null
      ) {
        dataToPost.deliveryMethods[i].DeliveryMethodPerPost.customProperties =
          {};
      }
      dataToPost.deliveryMethods[
        i
      ].DeliveryMethodPerPost.customProperties.PaymentMethods =
        dataToPost.deliveryMethods[i].PaymentMethods;

      for (
        let j = 0;
        j < dataToPost?.deliveryMethods[i]?.PaymentMethods?.length;
        j++
      ) {
        paymentMethods.push(dataToPost.deliveryMethods[i].PaymentMethods[j]);
      }
    }

    paymentMethods = paymentMethods.filter(
      (element, index, self) =>
        index === self.findIndex(t => t.id === element.id),
    );

    dataToPost.paymentMethods = paymentMethods;
  }

  dataToPost.customProperties = {};
  dataToPost.customProperties.origin = 'app';
  dataToPost.customProperties.lastScreen = '3';
  dataToPost.customProperties = {
    ...dataToPost.customProperties,
    ...payload.formData.customProperties,
  };
  switch (payload.formData.condition[0]) {
    case 1:
      dataToPost.itemCondition = 'e86c9f39-f8a9-481a-b622-5beb4afa6956';
      break;
    case 2:
      dataToPost.itemCondition = '4993e897-45c4-493d-954d-eaa48a4e60c6';
      break;
    case 3:
      dataToPost.itemCondition = '33b2f829-2f4f-4df8-add7-9054793b5225';
      break;
    case 4:
      dataToPost.itemCondition = 'fd6e8d14-e0ba-4321-8efd-1bba4f9b0033';
      break;
    case 5:
      dataToPost.itemCondition = 'eb734308-4fbf-48fe-9c76-3907c5f0e645';
      break;
  }

  if (payload.formData && payload.formData.productId === '') {
    // must create
    const responseA = yield call(createProductApi, {params: dataToProduct});

    if (responseA.error) {
      // error found
      yield put({type: failure(type), response: responseA});
      return;
    }
    // success
    responseFromServers.productId = responseA.data.id;
    dataToPost.product = responseA.data.id;
  } else {
    // must update
    dataToProduct.categoryId = dataToProduct.category;
    dataToProduct.productStatusId = dataToProduct.productStatus;

    const responseB = yield call(updateProductApi, {
      productId: dataToProduct.productId,
      params: dataToProduct,
    });

    if (responseB.error) {
      // error found
      yield put({type: failure(type), response: responseB});
      return;
    }
    // success
    responseFromServers.productId = payload.formData.productId;
  }

  if (payload.formData && payload.formData.postId === '') {
    // must create

    const responseC = yield call(createPostApi, {params: dataToPost});

    if (responseC.error) {
      // error found

      yield put({type: failure(type), response: responseC});
      return;
    }
    newPostId = responseC.data.id;
    // const postDetail = yield call(getPostDetailApi, {
    //   postId: responseC.data.id,
    //   params: {
    //     lat: 0,
    //     lng: 0,
    //     userId: payload.userId,
    //   },
    // });
    // success
    responseFromServers.postId = responseC.data.id;
    // responseFromServers.newCreatePost = postDetail.data;
  } else {
    // must update
    dataToPost.itemConditionId = dataToPost.itemCondition;
    dataToPost.postStatusId = dataToPost.postStatus;
    const responseD = yield call(updatePostApi, {
      postId: dataToPost.postId,
      params: dataToPost,
    });

    const updatedImage = payload.photosList?.map((item, index) => {
      const imageData = {
        id: item.id,
        productId: responseFromServers.productId,
        order: index + 1,
        type: item?.type,
        image: item?.image,
        uri: item?.uri
      };
      return imageData;
    });
    const getUndefinedImage = updatedImage?.filter(
      val => val?.type !== 'from-server' && val?.id == undefined,
    );
    let imageDataId;
    if (getUndefinedImage?.length > 0) {
      imageDataId = yield call(createImageToPostApi, {
        productId: responseFromServers.productId,
        photosList: getUndefinedImage,
      });
    }
    let count = 0;
    const removeUndefinedImage = updatedImage?.map(item => {
      if (item.id == undefined) {
        const imageData = {
          id: imageDataId?.data[count]?.id,
          productId: item?.productId,
          order: item?.order,
        };
        count = count + 1;
        return imageData;
      } else {
        const imageData = {
          id: item.id,
          productId: item?.productId,
          order: item?.order,
        };
        return imageData;
      }
    });
    if (removeUndefinedImage?.length > 0) {
      const imageData = yield call(updatePostImage, {
        params: removeUndefinedImage,
      });
      let countImag = 0;
      payload.photosList = payload.photosList.map((item, index) => {
        if (item.type !== 'from-server') {
          const data = {
            id: imageDataId?.data[countImag]?.id,
            image: imageDataId?.data[countImag]?.urlImage,
            savIndex: index,
            type: 'from-server',
            uri: imageDataId?.data[countImag]?.urlImage,
          };
          countImag = countImag + 1;
          return data;
        } else {
          return item;
        }
      });
    }
    if (responseD.error) {
      // error found

      yield put({type: failure(type), response: responseD});
      return;
    }
    // success
    responseFromServers.postId = payload.formData.postId;
  }
  if (payload.formData && payload.photosList && payload.photosList.length > 0) {
    if (payload.formData.productId === '') {
      const responseImg = yield call(createImageToPostApi, {
        productId: responseFromServers.productId,
        photosList: payload.photosList,
      });
      responseFromServers.images.push(responseImg);
    } else {
      // update product

      // must delete previous
      const imgsToDelete = [];
      // TODO
      if (payload.photosListInServer.length > 0) {
        const localPicsFromServer = payload.photosList.filter(
          item => item.type === 'from-server',
        );

        for (let i = 0; i < payload.photosListInServer.length; i++) {
          if (
            !localPicsFromServer.find(
              item => item.id === payload.photosListInServer[i].id,
            )
          ) {
            // delete task
            const responseImg = yield call(deleteImageFromPostApi, {
              productId: responseFromServers.productId,
              imageId: payload.photosListInServer[i].id,
              maintainImages: localPicsFromServer
                ?.map(item => item?.id)
                .toString(),
            });
            const updateImageDataAfterDelete = localPicsFromServer.map(
              (val, index) => {
                const data = {
                  id: val?.id,
                  productId: responseFromServers?.productId,
                  order: index + 1,
                };
                return data;
              },
            );
            const removeUndefinedImage = updateImageDataAfterDelete?.filter(
              val => val?.id != undefined,
            );
            if (removeUndefinedImage?.length > 0) {
              yield call(updatePostImage, {
                params: removeUndefinedImage,
              });
            }
          }
        }
      }

      // must add images
      const imgsToAdd = payload.photosList.filter(
        item => item.type !== 'from-server',
      );
      // TODO
      // for (let i = 0; i < imgsToAdd.length; i++) {
      //   let fileURI = "";
      //   if (imgsToAdd[i].type === "taken-photo") {
      //     if (Platform.OS === "ios") {
      //       fileURI = `data:image/jpeg;base64,${imgsToAdd[i].image}`;
      //     } else {
      //       fileURI = imgsToAdd[i].uri;
      //     }
      //   } else if (Platform.OS === "ios") {
      //     fileURI = imgsToAdd[i].image;
      //   } else {
      //     fileURI = imgsToAdd[i].uri;
      //   }
      if (imgsToAdd?.length > 0) {
        const responseImg = yield call(createImageToPostApi, {
          productId: responseFromServers.productId,
          photosList: imgsToAdd,
        });
        responseFromServers.images.push(responseImg);
      }
    }
  }
  if (newPostId == '') {
    newPostId = payload?.formData?.postId;
  }
  const postDetailforBoost = yield call(getPostDetailApi, {
    postId: newPostId,
    params: {
      lat: 0,
      lng: 0,
      userId: payload.userId,
    },
  });

  yield put({type: ADD_BOOST_ITEM, response: postDetailforBoost.data});
  yield put({type: success(type), response: responseFromServers});
}

function* getPostsDraft({type, payload}) {
  payload.v2 = false;
  const data = yield call(getPostsApi, payload);
  if (!data.error) {
    yield put({type: success(type), response: data});
  } else {
    yield put({type: failure(type), response: data});
  }
}

function* deleteProduct({type, payload}) {
  const data = yield call(deleteProductApi, payload);
  if (!data.error) {
    yield put({type: success(type), response: data});
  } else {
    yield put({type: failure(type), response: data});
  }
}

function* deletePost({type, payload}) {
  const data = yield call(deletePostApi, payload);

  // yield call(fetchSellProductList, {
  //   type: "USER_SELL_LIST",
  //   payload: {
  //     page: 1,
  //     perPage: 8,
  //     type: "buy",
  //     userId: payload.userId,
  //   },
  // });

  if (!data.error) {
    const dataA = yield call(deleteProductApi, payload);

    if (!dataA.error) {
      yield put({type: success(type), response: dataA});
    } else {
      yield put({type: failure(type), response: dataA});
    }
  } else {
    yield put({type: failure(type), response: data});
  }
}

function* updatePostStatus({type, payload}) {
  const data = yield call(updatePostApi, payload);
  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    yield put({type: failure(type), errorMsg});
  } else {
    const error = _.get(data, 'error', null);
    if (error) {
      yield put({type: failure(type), errorMsg: error});
    } else {
      yield put({
        type: success(type),
        data,
        rediecrtParam: payload.rediecrtParam,
      });
    }
  }
}

function* getShippingRate({type, payload}) {
  const data = yield call(shippingRateApi, payload);
  const errorMsg = _.get(data, 'result.content.message', null);
  if (errorMsg) {
    if (typeof errorMsg !== 'string') {
      yield put({type: failure(type), errorMsg});
    }

    try {
      const errDet = JSON.parse(errorMsg);
      const errorDetail = _.get(
        errDet,
        'error.detail.Errors.ErrorDetail.PrimaryErrorCode.Description',
        null,
      );
      yield put({
        type: failure(type),
        errorMsg: errorDetail || 'Unexpected error',
      });
    } catch (err) {
      yield put({
        type: failure(type),
        errorMsg: errorMsg || 'Unexpected error',
      });
    }
  } else {
    const error = _.get(data, 'error.error', null);
    if (error) {
      yield put({type: failure(type), errorMsg: error});
    } else {
      yield put({
        type: success(type),
        data,
        rediecrtParam: payload.rediecrtParam,
      });
    }
  }
}

function* getMinimumShippingRate({type, payload}) {
  const response = yield call(getMinimumShippingRateApi, payload);
  if (response.error) {
    yield put({type: failure(type), response});
  } else {
    yield put({type: success(type), response});
  }
}

function* getEstimateTime({type, payload}) {
  const response = yield call(getEstimateTimeApi, payload);
  if (response.error) {
    yield put({type: failure(type), response});
  } else {
    yield put({type: success(type), response});
  }
}

export default function* actionWatcher() {
  yield takeLatest(GET_LISTING_TYPE, fetchListingType);
  yield takeLatest(GET_MAKE_LIST, fetchMakeList);
  yield takeLatest(GET_DELIVERY_METHODS, getDeliveryMethods);
  yield takeLatest(SYNC_SERVER, syncServer);
  yield takeLatest(GET_POSTS_DRAFT, getPostsDraft);
  yield takeLatest(GET_POSTS_DRAFT_NEXT_PAGE, getPostsDraft);
  yield takeLatest(DELETE_PRODUCT, deleteProduct);
  yield takeLatest(DELETE_POST, deletePost);
  yield takeLatest(UPDATE_POST_STATUS, updatePostStatus);
  yield takeLatest(GET_SHIPPING_RATE, getShippingRate);
  yield takeLatest(GET_MINIMUM_SHIPPING_RATE, getMinimumShippingRate);
  yield takeLatest(GET_ESTIMATE_TIME, getEstimateTime);
}
