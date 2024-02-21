import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Heading, ProductsList, Loader, EmptyState } from "#components";
import { SetFavoritePostFlowModals } from "#common-views";
import Tabs from "../components/tabs";
import { paddings, margins } from "#styles/utilities";
import { Colors } from "#themes";

import { useActions } from "#utils";
import { selectPostsData } from "#modules/Posts/selectors";
import { selectUserData } from "#modules/User/selectors";
import { deleteIdeaGlobally, getAlbumsIdeas } from "#modules/Ideas/actions";
import { MainAuthStackNavigation } from "../../../../navigators/MainAuthStackNavigation";
import { SimilarAndNearByProductLoader } from "#components/SkeletonPlaceholderLoader";
import colors from "#themes/colors";

const OtherProducts = ({
  navigation,
  handleOnBack,
  postDetail,
  nearbyPosts,
  nearLoader,
  isSupplier,
  similarPosts,
  similarLoader,
  isFetchingNextSimilarPagePosts = false,
  updateLatestSimilarPosts = () => {},
}) => {
  /* Selectors */
  const { information: userInfo } = useSelector(selectUserData());

  /* Actions */
  const actions = useActions({ deleteIdeaGlobally, getAlbumsIdeas });

  /* States */
  const [activeTab, setActiveTab] = useState("similar");
  const [postToFavorite, setPostToFavorite] = useState({});
  const [isVisibleFavoriteModal, setIsVisibleFavoriteModal] = useState(false);
  const tabs = [
    { id: "similar", name: "Similar" },
    { id: "nearby", name: "Nearby" },
  ];

  /* Effects */
  useEffect(() => {
    if (postToFavorite.id) {
      if (userInfo.id) setIsVisibleFavoriteModal(true);
      else navigation.navigate("MainAuth");
    }
  }, [postToFavorite.id]);

  const handlePressLike = async (item) => {
    if (userInfo.id) {
      if (item?.isFavorite != true) {
        setPostToFavorite({
          id: item.id,
          image: item.Product.ProductImages[0].urlImage,
        });
      } else {
        await actions.deleteIdeaGlobally({
          postId: item?.id,
          userId: userInfo.id,
        });
        const latestSimilarData = [...similarPosts?.data]?.map((obj) => {
          if (obj?.id == item.id) {
            return { ...obj, isFavorite: false };
          } else {
            return obj;
          }
        });
        updateLatestSimilarPosts({
          ...similarPosts,
          data: latestSimilarData,
        });
        actions.getAlbumsIdeas({ params: { userId: userInfo.id } });
      }
    } else {
      MainAuthStackNavigation(navigation);
    }
  };
  return (
    <>
      <View style={styles.header}>
        <Heading type="bodyText" style={margins["mb-3"]}>
          {isSupplier ? "Other Similar Products" : "Other Products"}
        </Heading>
        {!isSupplier && (
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </View>
      <View style={styles.moreProductsContainer}>
        {activeTab === "similar" && (
          <>
            {similarPosts && similarPosts?.data?.length === 0 && (
              <EmptyState icon="goods" text="No similar products" />
            )}
            {similarPosts && similarPosts?.data?.length > 0 && (
              <ProductsList
                scrollEnabled={false}
                list={similarPosts.data}
                onPressItem={(item, imageVal) => {
                  const finalProductImages = item?.Product?.ProductImages?.map(
                    (obj) => {
                      const findObj = imageVal?.find((el) => el?.id == obj?.id);
                      if (findObj) {
                        return findObj;
                      } else {
                        return obj;
                      }
                    }
                  );
                  navigation.push("ProductDetail", {
                    postId: item.id,
                    onBack: handleOnBack,
                    postData: {
                      ...item,
                      Product: {
                        ...item?.Product,
                        ProductImages: finalProductImages,
                      },
                    },
                    updatedProductImages: finalProductImages,
                    key: `PostDetail${item.id}`,
                  });
                }}
                onPressLike={(item) => handlePressLike(item)}
                // handleEndReached={handleSimilarEndReached}
                // onEndReachedThreshold={0.5}
              />
            )}
            {similarLoader && (
              <View style={{ marginTop: 20 }}>
                <SimilarAndNearByProductLoader />
              </View>
            )}
          </>
        )}
        {activeTab === "nearby" && (
          <>
            {nearbyPosts && nearbyPosts?.list?.length === 0 && (
              <EmptyState icon="localization" text="No nearby products" />
            )}
            {nearbyPosts && nearbyPosts?.list?.length > 0 && (
              <ProductsList
                scrollEnabled={false}
                list={nearbyPosts.list}
                onPressItem={(item, imageVal) => {
                  const finalProductImages = item?.Product?.ProductImages?.map(
                    (obj) => {
                      const findObj = imageVal?.find((el) => el?.id == obj?.id);
                      if (findObj) {
                        return findObj;
                      } else {
                        return obj;
                      }
                    }
                  );
                  navigation.push("ProductDetail", {
                    postId: item.id,
                    onBack: handleOnBack,
                    postData: {
                      ...item,
                      Product: {
                        ...item?.Product,
                        ProductImages: finalProductImages,
                      },
                    },
                    updatedProductImages: finalProductImages,
                    key: `PostDetail${item.id}`,
                  });
                }}
                onPressLike={(item) => handlePressLike(item)}
              />
            )}
            {nearLoader?.isFetching && (
              <View style={{ marginTop: 20 }}>
                <SimilarAndNearByProductLoader />
              </View>
            )}
          </>
        )}
        {isFetchingNextSimilarPagePosts && (
          <ActivityIndicator
            style={{ marginBottom: 10 }}
            color={colors.primary}
          />
        )}
      </View>
      <SetFavoritePostFlowModals
        post={postToFavorite}
        isVisible={isVisibleFavoriteModal}
        closeModal={(withSuccess) => {
          if (withSuccess) {
            const latestSimilarData = [...similarPosts?.data]?.map((obj) => {
              if (obj?.id == postToFavorite?.id) {
                return { ...obj, isFavorite: true };
              } else {
                return obj;
              }
            });
            updateLatestSimilarPosts({
              ...similarPosts,
              data: latestSimilarData,
            });
          }
          console.log("withSuccess=======> ", withSuccess);
          setIsVisibleFavoriteModal(false);
          setPostToFavorite({});
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    ...paddings["px-3"],
    ...paddings["py-5"],
    paddingBottom: 0,
  },
  moreProductsContainer: {
    backgroundColor: Colors.creamBackground,
    flex: 1,
  },
});

export default OtherProducts;
