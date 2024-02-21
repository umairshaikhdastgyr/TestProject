import React, { useEffect, useState } from "react";
import { FlatList, View, Text, Platform } from "react-native";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { styles } from "./styles";
import ProductItem from "../../Explore/MainScreen/views/ProductsList/product-tile";
import { deleteIdeaGlobally, getAlbumsIdeas } from "#modules/Ideas/actions";
import { getUserSellList } from "#modules/User/actions";
import usePrevious from "#utils/usePrevious";
import { userSelector } from "#modules/User/selectors";
import { SetFavoritePostFlowModals } from "#common-views";
import { selectPostsData } from "#modules/Posts/selectors";
import SmallLoader from "#components/Loader/SmallLoader";
import { getSupplierProductList } from "#modules/Catalog/actions";
import { selectCatalogData } from "#modules/Catalog/selectors";
import { MainAuthStackNavigation } from "../../../navigators/MainAuthStackNavigation";

export const PostItems = ({ navigation, sellerId, nativeEvent, user }) => {
  const {
    user: {
      userSellListState,
      information: { id },
    },
  } = useSelector(userSelector);
  const { productList } = useSelector(selectCatalogData());
  const dispatch = useDispatch();
  const { favoriteProduct, deleteFavorite } = useSelector(selectPostsData());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sellProducts, setSellProducts] = useState([]);
  const [postToFavorite, setPostToFavorite] = useState({});
  const [isVisibleFavoriteModal, setIsVisibleFavoriteModal] = useState(false);
  const PER_PAGE = 20;
  const prevUserSellListState = usePrevious(userSellListState);
  const prevFavoriteProduct = usePrevious(favoriteProduct);
  const prevDeleteFavorite = usePrevious(deleteFavorite);
  const loadData = (reqType) => {
    const sellParams = {
      page,
      perPage: PER_PAGE,
      sellerId,
      userId: sellerId,
      postStatus: "active",
      onlyWithImages: true,
      reqType,
      type: "sell",
      isDashBoard: false,
    };
    !userSellListState.isFetching &&
      dispatch(getSupplierProductList(sellerId, page, PER_PAGE));
  };

  useEffect(() => {
    loadData("first");
  }, []);

  useEffect(() => {
    if (
      userSellListState.success &&
      prevUserSellListState &&
      !prevUserSellListState.success
    ) {
      setSellProducts(
        userSellListState?.data?.filter((itemVal) => {
          if (
            itemVal?.productInfo?.PostStatus?.name == "active" ||
            itemVal?.productInfo?.PostStatus?.name == "Active" ||
            itemVal?.postDetail?.PostStatus?.name == "Active" ||
            itemVal?.postDetail?.PostStatus?.name == "active"
          ) {
            return true;
          }
          return false;
        })
      );
      userSellListState?.data?.length > 0 && setPage(page + 1);
      userSellListState?.data?.length == PER_PAGE
        ? setHasMore(true)
        : setHasMore(false);
    }
  }, [userSellListState]);

  useEffect(() => {
    if (
      favoriteProduct.data &&
      prevFavoriteProduct &&
      !prevFavoriteProduct.data
    ) {
      const userSellList = sellProducts;
      const updatedItem = favoriteProduct.data;
      const updatedList = userSellList
        ?.filter((itemVal) => {
          if (
            itemVal?.productInfo?.PostStatus?.name == "active" ||
            itemVal?.productInfo?.PostStatus?.name == "Active" ||
            itemVal?.postDetail?.PostStatus?.name == "Active" ||
            itemVal?.postDetail?.PostStatus?.name == "active"
          ) {
            return true;
          }
          return false;
        })
        .map((item) => {
          if (item.id === updatedItem.PostId) {
            return { ...item, isFavorite: true };
          }
          return item;
        });

      setSellProducts(updatedList);
    }
  }, [favoriteProduct.data]);

  useEffect(() => {
    if (deleteFavorite.data && prevDeleteFavorite && !prevDeleteFavorite.data) {
      const userSellList = sellProducts;
      const updatedItem = deleteFavorite.data;
      const updatedList = userSellList
        ?.filter((itemVal) => {
          if (
            itemVal?.productInfo?.PostStatus?.name == "active" ||
            itemVal?.productInfo?.PostStatus?.name == "Active" ||
            itemVal?.postDetail?.PostStatus?.name == "Active" ||
            itemVal?.postDetail?.PostStatus?.name == "active"
          ) {
            return true;
          }
          return false;
        })
        .map((item) => {
          if (item.id === updatedItem.postId) {
            return { ...item, isFavorite: false };
          }
          return item;
        });

      setSellProducts(updatedList);
      dispatch(getAlbumsIdeas({ params: { userId: id } }));
    }
  }, [deleteFavorite.data]);

  useEffect(() => {
    const { contentSize, layoutMeasurement, contentOffset } = nativeEvent;
    if (!contentOffset || !layoutMeasurement || !contentSize) return;
    const offset =
      Platform.OS === "ios"
        ? contentSize.height - layoutMeasurement.height + 50
        : contentSize.height - layoutMeasurement.height - 1;
    if (contentOffset.y > offset) {
      hasMore && loadData("notFirst");
    }
  }, [nativeEvent]);

  const handlePressLike = async (item) => {
    if (!id) {
      MainAuthStackNavigation(navigation);
      return;
    } else {
      if (item.isFavorite !== true) {
        setPostToFavorite({
          id: item.id,
          image: item?.productInfo?.Product.ProductImages[0]?.urlImage,
        });
        setIsVisibleFavoriteModal(true);
      } else {
        dispatch(
          deleteIdeaGlobally({
            postId: item.id,
            userId: id,
          })
        );
        dispatch(getSupplierProductList(sellerId, page, PER_PAGE));
      }
    }
  };
  useEffect(() => {
    if (postToFavorite.id) {
      if (id) setIsVisibleFavoriteModal(true);
      else {
        MainAuthStackNavigation(navigation);
      }
    }
  }, [postToFavorite.id]);

  return (
    <View style={styles.reviewContentContainer}>
      <Text style={styles.titleText}>
        {_.get(user, "firstName", "")}
        's Item
      </Text>
      {productList?.data?.length == 0 && (
        <>
          {productList.isFetching ? (
            <SmallLoader />
          ) : (
            <View style={styles.reviewItemContainer}>
              <Text style={styles.grayText}>
                {_.get(user, "firstName", "")} {_.get(user, "lastName", "")} has
                no products.
              </Text>
            </View>
          )}
        </>
      )}
      <FlatList
        style={styles.productsList}
        contentInset={{ bottom: 10 }}
        numColumns={2}
        keyExtractor={(item, index) => `key-${index}`}
        data={productList?.data}
        renderItem={({ item, index }) => {
          return (
            <ProductItem
              navigation={navigation}
              data={item}
              onPressLike={() => handlePressLike(item)}
            />
          );
        }}
        scrollEventThrottle={16}
        scrollEnabled={false}
      />

      <SetFavoritePostFlowModals
        post={postToFavorite}
        isVisible={isVisibleFavoriteModal}
        closeModal={() => {
          setIsVisibleFavoriteModal(false);
          dispatch(getSupplierProductList(sellerId, page, PER_PAGE));
          setPostToFavorite({});
        }}
      />
    </View>
  );
};
