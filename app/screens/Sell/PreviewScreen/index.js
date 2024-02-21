import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  SafeAreaView,
  View,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import {FooterAction, SweetDialog, FullScreenLoader} from '#components';
import {safeAreaViewWhite, safeAreaNotchHelper} from '#styles/utilities';
import {selectSellData} from '#modules/Sell/selectors';
import {selectUserData} from '#modules/User/selectors';
import {
  setFormValue,
  clearSell,
  syncServer,
  getPostsDraft,
  getEstimateTime,
  savePostDetail,
  syncServerSuccess,
  setBoostItem,
  postImageUpload,
  isPostImageUploaded,
  setPhotoList,
  changePostDetail,
} from '#modules/Sell/actions';
import ItemDetails from '#screens/Common/ProductDetailScreen/sections/item-details';
import ItemLocation from './sections/location';
import ItemPictures from './sections/item-pictures';
import {useActions} from '#utils';
import {ShareDialog} from 'react-native-fbsdk';
import useCheckNetworkInfo from '../../../hooks/useCheckNetworkInfo';
import {createPost, getPostDetail} from '#services/apiPosts';
import {updatePost} from '#services/apiPosts';
import {
  clearImage,
  setClaimPhotoList,
  setReturnPhotoList,
} from '#modules/User/actions';

let refFormData;
let refPhotoList;
let refCopyFormData;
let refCopyPhotoList;

const PreviewScreen = ({navigation, route}) => {
  const dispatch = useDispatch();

  const categoryType = route.params['category-type'];
  const isNormal = route?.params?.isNormal;
  const isDraft = route?.params?.isDraft;
  /* Selectors */
  const {
    formData,
    photosList,
    isFetchingServer,
    photosListInServer,
    copyFormData,
    copyPhotoList,
    estimateTime,
    savePostDetailData,
    isPostImageUpload,
    isChangePostDetail,
  } = useSelector(selectSellData());
  const {information: userInfo} = useSelector(selectUserData());
  const [conType, setConType] = useState(undefined);
  const {internetAvailable} = useCheckNetworkInfo();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (internetAvailable === true) {
      if (!conType) {
        setConType(true);
      }
    } else if (internetAvailable === false) {
      setConType(false);
    }
  }, [internetAvailable]);
  /* Actions */
  const actions = useActions({
    setFormValue,
    clearSell,
    syncServer,
    getPostsDraft,
    getEstimateTime,
  });

  useEffect(() => {
    refFormData = formData;
  }, [formData]);
  useEffect(() => {
    refPhotoList = photosList;
  }, [photosList]);
  useEffect(() => {
    refCopyPhotoList = copyPhotoList;
  }, [copyPhotoList]);
  useEffect(() => {
    refCopyFormData = copyFormData;
  }, [copyFormData]);

  const handleClosePreviewClick = () => {
    if (fromScreen === 'profile') {
      navigation.navigate('Dashboard');
      return;
    }
    if (refCopyPhotoList || refCopyFormData) {
      if (checkDisableStatus()) {
        actions.clearSell();
        if (route?.params?.isDashboard) {
          navigation.navigate('Dashboard', {
            fromScreen: 'explore',
            showSellSection: true,
            isSellTab: true,
          });
        } else {
          navigation.navigate('ExploreMain');
        }
      } else {
        if (isChangePostDetail == true) {
          setDialogVisible(true);
        } else {
          handleBackButton();
        }
      }
    } else {
      if (isChangePostDetail == true) {
        setDialogVisible(true);
      } else {
        handleBackButton();
      }
    }
  };

  const handleBackButton = () => {
    dispatch(savePostDetail({}));
    dispatch(isPostImageUploaded(false));
    dispatch(postImageUpload([]));
    actions.clearSell();
    if (route?.params?.isDashboard) {
      navigation.navigate('Dashboard', {
        fromScreen: 'explore',
        showSellSection: true,
        isSellTab: true,
      });
    } else {
      navigation.navigate('ExploreMain');
    }
  };

  const checkDisableStatus = () => {
    if (
      refPhotoList.length > 0 &&
      JSON.stringify(refPhotoList) !== JSON.stringify(refCopyPhotoList)
    ) {
      return false;
    }

    if (
      JSON.stringify(refFormData.listingType) !==
      JSON.stringify(refCopyFormData.listingType)
    ) {
      return false;
    }

    if (
      JSON.stringify(refFormData.subCategory) !==
      JSON.stringify(refCopyFormData.subCategory)
    ) {
      return false;
    }

    if (refFormData.postTitle !== refCopyFormData.postTitle) {
      return false;
    }

    if (refFormData.postDescription !== refCopyFormData.postDescription) {
      return false;
    }

    if (
      JSON.stringify(refFormData.location) !==
      JSON.stringify(refCopyFormData.location)
    ) {
      return false;
    }

    if (refFormData.price !== refCopyFormData.price) {
      return false;
    }

    if (refFormData.isNegotiable !== refCopyFormData.isNegotiable) {
      return false;
    }

    if (
      refCopyFormData.condition &&
      refFormData.condition &&
      refFormData.condition.length > 0 &&
      refFormData?.condition[0] !== refCopyFormData?.condition[0]
    ) {
      return false;
    }

    if (JSON.stringify(refPhotoList) !== JSON.stringify(refCopyPhotoList)) {
      return false;
    }

    if (JSON.stringify(refFormData) !== JSON.stringify(refCopyFormData)) {
      //return false;
    }

    if (refFormData.listingType.name === 'Vehicle') {
      if (
        JSON.stringify(refFormData.customProperties) !==
        JSON.stringify(refCopyFormData.customProperties)
      ) {
        return false;
      }
    }

    if (refFormData.listingType.name !== 'Vehicle') {
      if (
        JSON.stringify(refFormData.deliveryMethodsSelected) !==
        JSON.stringify(refCopyFormData.deliveryMethodsSelected)
      ) {
        //Left validate valid item

        return false;
      }
    }
    return true;
  };

  const [dialogVisible, setDialogVisible] = useState(false);
  const [checkingServer, setCheckingServer] = useState(false);
  const [publishToServer, setPublishToServer] = useState(false);

  const [postDetail, setPostDetail] = useState({});
  const fromScreen = route?.params?.screen ?? null;

  useEffect(() => {
    actions.getEstimateTime();
    return () => {
      if (route?.params?.isDraft && route?.params?.isDashboard) {
        actions.clearSell();
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({categoryType: formData.listingType.name});
      navigation.setParams({handleClosePreviewClick});
    }, [isChangePostDetail]),
  );

  const subCategoryIsSelected = () => {
    if (formData?.subCategory?.id) {
      return true;
    }
    return false;
  };

  const priceIsZero = () => {
    if (Number(formData.price) == 0) {
      return true;
    } else {
      return false;
    }
  };

  const conditionIsNotSelected = () => {
    if (formData?.condition?.length > 0) {
      return true;
    }

    return false;
  };

  const prepraidShippingLabelIsNotComplete = () => {
    if (Object.keys(postDetail).length > 0) {
      const homitagshipping = postDetail?.DeliveryMethods?.find(
        deliveryMethodSelected =>
          deliveryMethodSelected.code === 'homitagshipping',
      );

      if (homitagshipping !== undefined) {
        const {width, height, weight, length} =
          postDetail?.Product?.customProperties;
        if (
          homitagshipping?.deliveryCustomProperties?.optionsAvailable[0]
            ?.providers == undefined ||
          homitagshipping?.deliveryCustomProperties?.optionsAvailable[0]
            ?.providers?.length === 0 ||
          width == null ||
          height == null ||
          weight == null ||
          length == null
        ) {
          return true;
        } else {
          false;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const noDeliveryMethodSelected = () => {
    if (postDetail?.PaymentMethods?.length == 0) {
      return true;
    } else {
      return false;
    }
  };
  const handleDisableButton = () => {
    if (
      !conType ||
      photosList?.length == 0 ||
      formData?.postTitle?.length == 0 ||
      formData?.postDescription?.length == 0 ||
      subCategoryIsSelected() == false ||
      priceIsZero() ||
      conditionIsNotSelected() == false ||
      prepraidShippingLabelIsNotComplete() === true ||
      noDeliveryMethodSelected()
    ) {
      return true;
    } else {
      return false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const handleBackButton = () => {
        if (formData.listingType.name === 'Vehicle') {
          navigation.navigate('DeliveryMethod', {
            'category-type': 'Vehicle',
          });
        } else {
          navigation.navigate('DeliveryMethod', {
            'category-type': categoryType,
          });
        }
        setDialogVisible(false);
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton,
      );
      return () => subscription.remove();
    }, []),
  );

  useEffect(() => {
    const prevPost = {};
    prevPost.description = formData.postDescription;
    prevPost.distance = 0;
    prevPost.title = formData.postTitle;
    prevPost.initialPrice = formData.price;
    prevPost.id = 0;
    prevPost.isFavorite = false;
    prevPost.Product = {};
    prevPost.Product.Category = formData.subCategory;
    prevPost.Product.customProperties = formData.customProperties;
    prevPost.createdAt = new Date();

    const paymentMethods = [];
    for (let i = 0; i < formData.deliveryMethodsSelected.length; i++) {
      if (
        formData.deliveryMethodsSelected[i].PaymentMethods &&
        formData.deliveryMethodsSelected[i].PaymentMethods.length > 0
      ) {
        for (
          let j = 0;
          j < formData.deliveryMethodsSelected[i].PaymentMethods.length;
          j++
        ) {
          if (paymentMethods.length === 0) {
            paymentMethods.push(
              formData.deliveryMethodsSelected[i].PaymentMethods[j],
            );
          } else if (
            !paymentMethods.find(
              ele =>
                ele.id ===
                formData.deliveryMethodsSelected[i].PaymentMethods[j].id,
            )
          ) {
            paymentMethods.push(
              formData.deliveryMethodsSelected[i].PaymentMethods[j],
            );
          }
        }
      }
    }

    const contition = {};
    prevPost.PaymentMethods = paymentMethods;
    switch (formData.condition[0]) {
      case 1:
        contition.name = 'New';
        break;
      case 2:
        contition.name = 'Like new';
        break;
      case 3:
        contition.name = 'Never used';
        break;
      case 4:
        contition.name = 'Used';
        break;
      case 5:
        contition.name = 'Acceptable';
        break;
    }
    prevPost.ItemCondition = contition;
    prevPost.DeliveryMethods = formData.deliveryMethodsSelected;
    prevPost.PostStatus = {
      name: formData.postStatus.name,
    };
    prevPost.productId = formData.productId;

    for (let i = 0; i < prevPost.DeliveryMethods.length; i++) {
      prevPost.DeliveryMethods[i].DeliveryMethodPerPost = {};
      prevPost.DeliveryMethods[i].DeliveryMethodPerPost.customProperties =
        prevPost.DeliveryMethods[i].deliveryCustomProperties;
    }

    setPostDetail(prevPost);
  }, [formData]);

  useEffect(() => {
    if (isFetchingServer === false && checkingServer === true) {
      setCheckingServer(false);
      actions.clearSell();

      actions.getPostsDraft({
        filters: {
          sellerId: userInfo.id,
          postStatus: 'Draft',
          page: 1,
          perPage: 20,
        },
      });
      navigation.navigate('ExploreMain');
    }

    if (isFetchingServer === false && publishToServer === true) {
      handleExplorePage();
    }
  }, [isFetchingServer]);

  const handleExplorePage = (value = {}) => {
    let dataForm;
    if (Object.keys(value)?.length > 0) {
      dataForm = {...formData, ...value};
    } else {
      dataForm = {...formData};
    }

    actions.getPostsDraft({
      filters: {
        sellerId: userInfo.id,
        postStatus: 'Draft',
        page: 1,
        perPage: 20,
      },
    });

    if (fromScreen === 'profile') {
      navigation.navigate('Dashboard', {fromScreen: 'editPost'});
    } else {
      if (dataForm.shareOnFacebook) {
        redirectToExplore(dataForm);
        setTimeout(
          () => {
            //actions.clearSell();
            setPublishToServer(false);
            shareLinkWithShareDialog(dataForm);
          },
          Platform.OS === 'ios' ? 500 : 0,
        );
      } else {
        // actions.clearSell();
        setPublishToServer(false);
        redirectToExplore(dataForm);
      }
    }
  };

  const redirectToExplore = dataForm => {
    actions.clearSell();
    navigation.navigate('ExploreMain', {
      fromSell: true,
      sellPostId: dataForm.postId,
      sellPostTitle: dataForm.postTitle,
      // shareFaceBook: dataForm.shareOnFacebook,
    });
    dispatch(savePostDetail({}));
    dispatch(isPostImageUploaded(false));
    dispatch(postImageUpload([]));
    dispatch(setPhotoList([]));
    dispatch(setClaimPhotoList([]));
    dispatch(setReturnPhotoList([]));
  };

  const shareLinkWithShareDialog = dataForm => {
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: `https://www.homitag.com/mobile/${dataForm.id}`,
      quote: `${dataForm.postTitle}\n${dataForm.postDescription}`,
    };

    ShareDialog.canShow(shareLinkContent)
      .then(function (canShow) {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }
      })
      .then(
        result => {
          if (result.isCancelled) {
            /// CANCELLED
            redirectToExplore(dataForm);
          } else {
            /// SUCCESS
            redirectToExplore(dataForm);
          }
        },
        error => {
          /// ERROR
          redirectToExplore(dataForm);
        },
      );
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onMainButtonPressed = () => {
    setDialogVisible(false);

    setCheckingServer(true);
    actions.syncServer({
      formData,
      draft: true,
      photosList,
      userId: userInfo.id,
      photosListInServer,
      lastScreen: route.name,
    });
    dispatch(savePostDetail({}));
    dispatch(isPostImageUploaded(false));
    dispatch(postImageUpload([]));
    dispatch(changePostDetail(false));
  };

  const onSecondaryButtonPressed = () => {
    setDialogVisible(false);
    navigation.navigate('ExploreMain');
    dispatch(savePostDetail({}));
    dispatch(isPostImageUploaded(false));
    dispatch(postImageUpload([]));
    dispatch(changePostDetail(false));
    actions.clearSell();
    dispatch(clearImage());
  };

  const publishAction = async () => {
    setPublishToServer(true);
    const newFormData = formData;
    if (fromScreen !== 'profile') {
      newFormData.postStatus = {
        id: '3c50efb7-419a-4446-8cb8-c8f45e1bcb8c',
        name: 'Active',
      };
      newFormData.productStatus = {
        id: 'bafb5ca5-341e-4f35-b6a1-a9ec6fe89cd3',
        name: 'Active',
      };
    }
    if (isNormal == true || isDraft == true) {
      handlePostButton();
    } else {
      actions.syncServer({
        formData: newFormData,
        photosList,
        userId: userInfo.id,
        photosListInServer,
      });
    }
  };

  const handlePostButton = async () => {
    setLoader(true);
    const dataToPost = {};
    dataToPost.product = formData?.productId
      ? formData?.productId
      : savePostDetailData?.productId;
    dataToPost.userId = userInfo.id;

    if (formData?.postId) {
      dataToPost.postId = formData.postId;
    }
    if (Object.keys(formData.location).length > 0) {
      dataToPost.location = formData.location.googleObj;
    }
    if (formData?.price) {
      dataToPost.initialPrice = Number(formData.price);
    }
    dataToPost.isNegotiable = formData.isNegotiable;
    dataToPost.shareOnFacebook = formData.shareOnFacebook;
    dataToPost.availableQuantity = 1;
    dataToPost.quantityForSale = 1;

    dataToPost.postStatus = '3c50efb7-419a-4446-8cb8-c8f45e1bcb8c';
    if (formData.deliveryMethodsSelected.length > 0) {
      dataToPost.deliveryMethods = formData.deliveryMethodsSelected;

      let paymentMethods = [];
      for (let i = 0; i < dataToPost.deliveryMethods.length; i++) {
        dataToPost.deliveryMethods[i].DeliveryMethodPerPost = {};
        dataToPost.deliveryMethods[i].DeliveryMethodPerPost.customProperties =
          dataToPost.deliveryMethods[i].deliveryCustomProperties;
        if (
          dataToPost.deliveryMethods[i].DeliveryMethodPerPost
            .customProperties === undefined ||
          dataToPost.deliveryMethods[i].DeliveryMethodPerPost
            .customProperties === null
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
      ...formData.customProperties,
    };
    switch (formData.condition[0]) {
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

    if (formData && formData.postId === '') {
      const res = await createPost({params: dataToPost});
      if (res && Object.keys(res?.data)?.length > 0 && res?.data?.id) {
        handleGetPostDetail(res);
      } else {
        setLoader(false);
      }
    } else {
      dataToPost.itemConditionId = dataToPost.itemCondition;
      dataToPost.postStatusId = dataToPost.postStatus;
      const responseD = await updatePost({
        postId: dataToPost.postId,
        params: dataToPost,
      });
      if (responseD?.status == 200 || responseD?.success == true) {
        handleGetPostDetail({data: {id: formData.postId}});
      } else {
        setLoader(false);
      }
    }
  };

  const handleGetPostDetail = async res => {
    const responseFromServers = {postId: '', productId: '', images: []};

    const postDetailforBoost = await getPostDetail({
      postId: res?.data?.id,
      params: {
        lat: 0,
        lng: 0,
        userId: userInfo.id,
      },
    });
    responseFromServers.productId = formData?.productId
      ? formData?.productId
      : savePostDetailData?.productId;
    responseFromServers.postId = res?.data?.id;
    responseFromServers.images = photosList;

    dispatch(syncServerSuccess(responseFromServers));
    dispatch(setBoostItem(postDetailforBoost?.data));
    setLoader(false);
    handleExplorePage(responseFromServers);
  };

  const handleEditButton = () => {
    if (fromScreen === 'profile') {
      navigation.navigate('PostEditorProfile', {
        'category-type': undefined,
        screen: 'profile',
      });
    } else {
      actions.setFormValue(formData);
      navigation.navigate('PostEditor', {
        'category-type': categoryType,
        isPreviewScreen: true,
      });
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: headerLeft,
    });
  }, [navigation]);

  const headerLeft = () => {
    if (isDraft) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          if (
            formData.listingType.name === 'Vehicle' ||
            formData.listingType.name === 'Vehicle'
          ) {
            navigation.navigate('SellPrice', {
              'category-type': 'Vehicle',
            });
          } else {
            navigation.navigate('DeliveryMethod', {
              'category-type': formData.listingType.name,
            });
          }
        }}
        style={{paddingHorizontal: 5}}>
        <Icon
          name="chevron-left"
          size={37}
          color="#959595"
          style={{marginLeft: -18}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <ScrollView style={{flexGrow: 1}}>
          <ItemPictures postPics={photosList} />
          <ItemDetails
            navigation={navigation}
            latLng={{lat: 0, lng: 0}}
            postDetail={postDetail}
            readOnly
            screenType="preview"
            formData={formData}
            estimateTime={estimateTime.data}
          />
          <ItemLocation navigation={navigation} location={formData.location} />
          {/* <View style={styles.shareContainer}>
            <Heading type="bodyText" style={[{ flex: 1, marginTop: 3 }]}>
              Share on Facebook?
            </Heading>
            <CheckBox
              label=""
              theme="alter"
              selected={formData.shareOnFacebook}
              onChange={(value) => {
                actions.setFormValue({
                  shareOnFacebook: !formData.shareOnFacebook,
                });
              }}
            />
          </View> */}
        </ScrollView>
        <FooterAction
          mainButtonProperties={{
            label: 'Post',
            disabled: handleDisableButton(),
            onPress: () => {
              if (conType === false) {
                return;
              }
              publishAction();
            },
          }}
          secondaryButtonProperties={{
            label: 'Edit',
            onPress: () => handleEditButton(),
          }}
        />
      </SafeAreaView>
      <SweetDialog
        title="Save Draft"
        message="Want to save your post for later?"
        type="two"
        mainBtTitle="Save for Later"
        secondaryBtTitle="No Thanks"
        dialogVisible={dialogVisible}
        onTouchOutside={onModalTouchOutside}
        onMainButtonPressed={onMainButtonPressed}
        onSecondaryButtonPressed={onSecondaryButtonPressed}
      />
      <FullScreenLoader
        isVisible={isFetchingServer || loader || isPostImageUpload}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};
export default PreviewScreen;
