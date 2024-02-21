import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  StyleSheet,
  SafeAreaView,
  View,
  Modal,
  Text,
  BackHandler,
} from "react-native";

import {
  Button,
  BodyText,
  Link,
  StepsBar,
  FooterAction,
  Icon,
  ProductsList,
  SweetDialog,
  FullScreenLoader,
} from "#components";
import { safeAreaView, safeAreaNotchHelper, flex } from "#styles/utilities";
import { Colors, Fonts } from "#themes";
import { selectSellData } from "#modules/Sell/selectors";
import { selectUserData } from "#modules/User/selectors";
import { selectCategoriesData } from "#modules/Categories/selectors";
import {
  getPostsDraft,
  getPostsDraftNextPage,
  deletePost,
  setPhotoList,
  setNewForm,
  setPhotoListFromServer,
  clearSell,
  setCopyFormData,
  setCopyPhotoList,
  savePostDetail,
  isPostImageUploaded,
  postImageUpload,
} from "#modules/Sell/actions";

import { useActions, getMapObjectFromGoogleObj } from "#utils";
import { postDetailFormData } from "#constants";
import { useFocusEffect } from "@react-navigation/native";

const DraftsScreen = ({ navigation, route }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [draftListVisible, setDraftListVisible] = useState(false);

  const [deletingItem, setDeletingItem] = useState(false);
  const [dialogDeleteVisible, setDialogDeleteVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});

  /* Selectors */
  const {
    formData,
    photosList,
    draftsList,
    isFetchingDraftsMorePage,
    noMorePostsDrafts,
    isFetchingServer,
  } = useSelector(selectSellData());
  const { information: userInfo } = useSelector(selectUserData());
  const { categoriesList } = useSelector(selectCategoriesData());

  const dispatch = useDispatch();

  /* Actions */
  const actions = useActions({
    getPostsDraft,
    getPostsDraftNextPage,
    deletePost,
    setPhotoList,
    setNewForm,
    setPhotoListFromServer,
    clearSell,
    setCopyFormData,
    setCopyPhotoList,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleCloseDraftsClick });
    }, [])
  );

  useEffect(() => {
    if (isFetchingServer === false && deletingItem === true) {
      // must reload listing
      setCurrentPage(1);
      setDeletingItem(false);
      actions.getPostsDraft({
        filters: {
          sellerId: userInfo.id,
          postStatus: "Draft",
          page: 1,
          perPage: 20,
        },
      });
    }
  }, [isFetchingServer, deletingItem]);

  const handleCloseDraftsClick = () => {
    dispatch(savePostDetail({}));
    dispatch(isPostImageUploaded(false));
    dispatch(postImageUpload([]));
    actions.clearSell();
    navigation.goBack();
  };

  const handleOnEndReached = (event) => {
    if (!isFetchingDraftsMorePage && !noMorePostsDrafts) {
      actions.getPostsDraftNextPage({
        filters: {
          sellerId: userInfo.id,
          postStatus: "Draft",
          page: currentPage + 1,
          perPage: 20,
        },
      });
      setCurrentPage(currentPage + 1);
    }
  };

  const onModalDeleteTouchOutside = () => {
    setDialogDeleteVisible(false);
  };

  const loadData = (data) => {
    const newFormData = {};
    const newPhotosList = [];
    let lastScreen = null;
    for (let i = 1; i < data?.Product?.ProductImages?.length; i++) {
      newPhotosList.push({
        type: "from-server",
        image: data?.Product?.ProductImages[i]?.urlImage,
        uri: data?.Product?.ProductImages[i]?.urlImage,
        id: data?.Product?.ProductImages[i]?.id,
      });
    }

    actions.setPhotoList(newPhotosList);
    actions.setPhotoListFromServer(newPhotosList);

    newFormData.postId = data?.id;
    newFormData.productId = data?.Product?.id;

    // listing types:
    if (
      data?.Product?.customProperties &&
      data?.Product?.customProperties?.lastScreen
    ) {
      lastScreen = data?.Product?.customProperties?.lastScreen;
    }

    if (
      data?.Product?.customProperties &&
      data?.Product?.customProperties?.listingType
    ) {
      newFormData.listingType = data?.Product?.customProperties?.listingType;
    }

    // Category:
    if (
      data?.Product?.customProperties &&
      data?.Product?.customProperties?.category
    ) {
      newFormData.category = categoriesList?.find(
        (item) => item?.id === data?.Product?.customProperties?.category?.id
      );
    }

    // subCategory:
    if (data?.Product?.Category && data?.Product?.Category?.id) {
      const subCat = newFormData?.category?.childCategory?.find(
        (item) => item?.id === data?.Product?.Category?.id
      );
      if (subCat) {
        newFormData.subCategory = subCat;
      } else {
        newFormData.subCategory = data?.Product?.Category;
      }
    }

    // postDetails
    if (data?.title !== null || data?.Product?.title !== null) {
      newFormData.postTitle = data?.title ? data?.title : data?.Product?.title;
    } else {
      newFormData.postTitle = "";
    }

    if (data?.description !== null || data?.Product?.description !== null) {
      newFormData.postDescription = data.description
        ? data?.description
        : data?.Product?.description;
    } else {
      newFormData.postDescription = "";
    }

    if (data.location !== null) {
      newFormData.location = getMapObjectFromGoogleObj(data?.location);
    } else {
      newFormData.location = {};
    }

    switch (data?.itemConditionId) {
      case "e86c9f39-f8a9-481a-b622-5beb4afa6956":
        newFormData.condition = [1];
        break;
      case "4993e897-45c4-493d-954d-eaa48a4e60c6":
        newFormData.condition = [2];
        break;
      case "33b2f829-2f4f-4df8-add7-9054793b5225":
        newFormData.condition = [3];
        break;
      case "fd6e8d14-e0ba-4321-8efd-1bba4f9b0033":
        newFormData.condition = [4];
        break;
      case "eb734308-4fbf-48fe-9c76-3907c5f0e645":
        newFormData.condition = [5];
        break;
    }

    if (data?.initialPrice !== null) {
      newFormData.price = data?.initialPrice;
    } else {
      newFormData.price = "";
    }

    newFormData.isNegotiable = data?.isNegotiable;

    newFormData.customProperties = data?.Product?.customProperties;

    newFormData.deliveryMethodsSelected = data?.DeliveryMethods;

    for (let i = 0; i < newFormData.deliveryMethodsSelected.length; i++) {
      newFormData.deliveryMethodsSelected[i].deliveryCustomProperties = {};
      newFormData.deliveryMethodsSelected[i].deliveryCustomProperties =
        newFormData.deliveryMethodsSelected[
          i
        ].DeliveryMethodPerPost.customProperties;

      if (
        newFormData.deliveryMethodsSelected[i].DeliveryMethodPerPost &&
        newFormData.deliveryMethodsSelected[i].DeliveryMethodPerPost
          .customProperties &&
        newFormData.deliveryMethodsSelected[i].DeliveryMethodPerPost
          .customProperties.PaymentMethods
      ) {
        newFormData.deliveryMethodsSelected[i].PaymentMethods = {};
        newFormData.deliveryMethodsSelected[i].PaymentMethods =
          newFormData.deliveryMethodsSelected[
            i
          ].DeliveryMethodPerPost.customProperties.PaymentMethods;

        delete newFormData.deliveryMethodsSelected[i].deliveryCustomProperties
          .PaymentMethods;
      } else {
        newFormData.deliveryMethodsSelected[i].PaymentMethods =
          data?.PaymentMethods;
      }
    }

    newFormData.paymentMethodsSelected = data?.PaymentMethods;

    newFormData.postStatus = data?.PostStatus;

    newFormData.shareOnFacebook = data?.shareOnFacebook;

    actions.setPhotoList(newPhotosList);
    actions.setNewForm(newFormData);
    actions.setCopyPhotoList(newPhotosList);
    actions.setCopyFormData(newFormData);

    if (lastScreen) {
      navigation.navigate(lastScreen, {
        "category-type":
          newFormData?.listingType?.name === "Vehicle" ? "Vehicle" : "Goods",
        isDraft: true,
      });
      const dataToProduct = {};
      const getDataToProduct = postDetailFormData(userInfo, formData);
      Object.assign(dataToProduct, getDataToProduct);
      dataToProduct.photosList = data?.Product?.ProductImages;
      dispatch(
        savePostDetail({
          productId: data?.Product?.id,
          ...dataToProduct,
        })
      );
    } else {
      navigation.goBack();
    }
  };

  const onMainButtonDeletePressed = () => {
    setDialogDeleteVisible(false);
    // TODO
    if (Object.keys(itemToDelete).length > 0) {
      actions.deletePost({
        productId: itemToDelete.productId,
        postId: itemToDelete.id,
        userId: userInfo.id,
      });
      setDeletingItem(true);
      actions.clearSell();
      setTimeout(
        () =>
          actions.getPostsDraft({
            filters: {
              sellerId: userInfo.id,
              postStatus: "Draft",
              page: 1,
              perPage: 20,
            },
          }),
        2500
      );
    }
    dispatch(
      getPostsDraft({
        filters: {
          sellerId: userInfo.id,
          postStatus: "Draft",
          page: 1,
          perPage: 20,
        },
      })
    );
  };

  const onSecondaryButtonDeletePressed = () => {
    setItemToDelete({});
    setDialogDeleteVisible(false);
  };

  const EmptyComponent = () => (
    <View style={{ flex: 1, marginTop: 80, alignItems: "center" }}>
      <BodyText align="center" style={{ marginBottom: 60 }}>
        You have no saved Drafts
      </BodyText>
      <Button
        label="Back to Post"
        size="large"
        theme="secondary"
        onPress={() => {
          navigation.goBack();
        }}
        style={[{ flex: 1, width: "80%" }]}
      />
    </View>
  );

  return (
    <>
      <SafeAreaView style={safeAreaView}>
        <View style={{ flex: 1 }}>
          <ProductsList
            scrollEnabled
            list={draftsList}
            onPressItem={(item) => loadData(item)}
            handleOnEndReached={handleOnEndReached}
            onEndReachedThreshold={0.5}
            favoriteIcon={false}
            deleteOption
            onPressDelete={(item) => {
              setItemToDelete(item);
              setDialogDeleteVisible(true);
            }}
            ListEmptyComponent={EmptyComponent()}
            type="draft"
          />
        </View>
        <SweetDialog
          title="Delete Draft"
          message="Are you sure you want to delete this draft?"
          type="two"
          mainBtTitle="Delete Draft"
          secondaryBtTitle="Cancel"
          dialogVisible={dialogDeleteVisible}
          onTouchOutside={onModalDeleteTouchOutside}
          onMainButtonPressed={onMainButtonDeletePressed}
          onSecondaryButtonPressed={onSecondaryButtonDeletePressed}
        />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
      <FullScreenLoader isVisible={isFetchingServer} />
    </>
  );
};

const styles = StyleSheet.create({});

export default DraftsScreen;
