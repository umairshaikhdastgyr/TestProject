import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { StyleSheet, View } from "react-native";
import { ProductsList, Loader, EmptyState } from "#components";
import { SetFavoritePostFlowModals } from "#common-views";
import { paddings } from "#styles/utilities";

import { useActions } from "#utils";
import { selectUserData } from "#modules/User/selectors";
import { deleteIdeaGlobally, getAlbumsIdeas } from "#modules/Ideas/actions";

const CatalogProducts = ({ navigation, catalogProducts }) => {
  const productsCount = catalogProducts?.data?.Posts?.length ?? 0;

  /* Selectors */
  const { information: userInfo } = useSelector(selectUserData());

  /* Actions */
  const actions = useActions({ deleteIdeaGlobally, getAlbumsIdeas });

  /* States */
  const [postToFavorite, setPostToFavorite] = useState({});
  const [isVisibleFavoriteModal, setIsVisibleFavoriteModal] = useState(false);

  /* Effects */
  useEffect(() => {
    if (postToFavorite.id) {
      if (userInfo.id) {
        setIsVisibleFavoriteModal(true);
      } else {
        navigation.navigate("MainAuth");
      }
    }
  }, [navigation, postToFavorite.id, userInfo.id]);

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
      actions.getAlbumsIdeas({ params: { userId: userInfo.id } });
    }
  };

  return (
    <>
      <View style={styles.productsContainer}>
        {catalogProducts.isFetching && <Loader />}
        {!catalogProducts.isFetching && productsCount === 0 && (
          <EmptyState icon="goods" text="No product" />
        )}
        {!catalogProducts.isFetching && productsCount > 0 && (
          <ProductsList
            scrollEnabled
            list={catalogProducts?.data?.Posts}
            onPressItem={(item) =>
              navigation.navigate("ProductDetail", {
                postId: item.id,
                postData: item,
                key: `PostDetail${item.id}`,
              })
            }
            onPressLike={(item) => handlePressLike(item)}
            contentContainerStyle={{ ...paddings["p-3"] }}
          />
        )}
      </View>
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

const styles = StyleSheet.create({
  productsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CatalogProducts;
