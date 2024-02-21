import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Animated,
  View,
  RefreshControl,
  Dimensions,
  Platform,
} from "react-native";
import { Loader, EmptyState } from "#components";
import { SetFavoritePostFlowModals } from "#common-views";
import ProductItem from "./product-tile";
import { useActions } from "#utils";
import { selectPostsData } from "#modules/Posts/selectors";
import { selectUserData } from "#modules/User/selectors";
import { deleteIdeaGlobally, getAlbumsIdeas } from "#modules/Ideas/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExplorePosts } from "#modules/Posts/actions";
import { selectFiltersData } from "#modules/Filters/selectors";
import { isJsonString } from "#constants";
import { MainAuthStackNavigation } from "../../../../../navigators/MainAuthStackNavigation";
import { ExplorePageLoader } from "#components/SkeletonPlaceholderLoader";
import { FlashList } from "@shopify/flash-list";

const ProductsList = ({
  navigation,
  handleOnScroll,
  handleEndReached,
  setIsLoadData,
  paddingTop,
  handleOnRefresh,
  footerComponent,
  isRefreshing,
  isGetPostData,
  setIsEndReached,
}) => {
  /* Selectors */
  const { isFetchingPosts, postsList } = useSelector(selectPostsData());

  const { information: userInfo } = useSelector(selectUserData());
  const { filterValues } = useSelector(selectFiltersData());

  /* Actions */
  const actions = useActions({ deleteIdeaGlobally, getAlbumsIdeas });

  /* States */
  const [postToFavorite, setPostToFavorite] = useState({});
  const [isVisibleFavoriteModal, setIsVisibleFavoriteModal] = useState(false);
  const flatListRef = useRef(null);

  /* Effects */
  useEffect(() => {
    if (postToFavorite.id) {
      if (userInfo.id) setIsVisibleFavoriteModal(true);
      else {
        MainAuthStackNavigation(navigation);
      }
    }
  }, [postToFavorite.id]);

  useEffect(() => {
    if (isGetPostData == true) {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }
  }, [isGetPostData]);

  /* Methods */
  const handlePressLike = async (item) => {
    if (item.isFavorite !== true) {
      setPostToFavorite({
        id: item.id,
        image: item.Product.ProductImages[0].urlImage,
      });
    } else {
      await actions.deleteIdeaGlobally({
        postId: item.id,
        userId: userInfo.id,
      });
      // console.log('end');
      actions.getAlbumsIdeas({ params: { userId: userInfo.id } });
    }
  };
  const renderItem = ({ item, index }) => (
    <ProductItem
      key={`${item?.id}${index}`}
      navigation={navigation}
      data={item}
      index={index}
      onPressLike={() => handlePressLike(item)}
      userInfo={userInfo}
      postLength={postsList?.length}
    />
  );

  const keyExtractor = useCallback((item, index) => `${item?.id}${index}`, []);

  return (
    <>
      {isGetPostData && (
        <View
          style={{
            paddingVertical: isGetPostData
              ? 150
              : isRefreshing
              ? 0
              : paddingTop,
          }}
        >
          <ExplorePageLoader />
        </View>
      )}
      {!isFetchingPosts &&
        !isGetPostData &&
        (postsList === undefined || (postsList && postsList?.length === 0)) && (
          <View style={{ marginTop: 200 }}>
            <EmptyState icon="explore" text="No products for this filters" />
          </View>
        )}
      {!isGetPostData && postsList && postsList?.length > 0 && (
        <View style={{ marginTop: isRefreshing ? 150 : 0, flex: 1 }}>
          <FlashList
            ref={flatListRef}
            data={postsList}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={{
              paddingBottom: Platform.OS == "android" ? 60 : 0,
              paddingTop: isGetPostData
                ? Dimensions.get("screen").height + 500
                : isRefreshing
                ? 0
                : paddingTop,
              paddingLeft: 16,
            }}
            numColumns={2}
            onScroll={handleOnScroll}
            onEndReached={() => {
              handleEndReached();
              setIsLoadData(true);
            }}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                tintColor="#000000"
                refreshing={isRefreshing}
                onRefresh={handleOnRefresh}
              />
            }
            ListFooterComponent={footerComponent}
            estimatedItemSize={195}
          />
        </View>
      )}
      <SetFavoritePostFlowModals
        post={postToFavorite}
        isVisible={isVisibleFavoriteModal}
        closeModal={() => {
          setIsVisibleFavoriteModal(false);
          setPostToFavorite({});
        }}
      />
    </>
  );
};

export default ProductsList;
