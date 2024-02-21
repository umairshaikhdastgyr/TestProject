import React, { useEffect, useCallback, useState } from "react";
import { View, FlatList, SafeAreaView } from "react-native";
import Header from "./components/header";
import ReviewCard from "./components/review-card";
import Footer from "./components/footer";
import { paddings, flex } from "#styles/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  getReviews,
  getNextReviews,
  getVerifiedPurchaseInfo,
} from "#modules/ProductReview/actions";
import { selectReviewsData } from "#modules/ProductReview/selectors";
import SmallLoader from "#components/Loader/SmallLoader";
import { EmptyState } from "#components";
import { selectUserData } from "#modules/User/selectors";

const ProductReviewsScreen = ({ navigation, route }) => {
  const [page, setPage] = useState(1);
  const { reviews, verifiedPurchaseInfo } = useSelector(selectReviewsData());
  const { information: userInfo } = useSelector(selectUserData());
  const productId = route?.params?.productId;
  const productDetail = route?.params?.productDetail;
  const prodStatus = route?.params?.prodStatus;

  const totalOrder = verifiedPurchaseInfo?.total ?? 0;
  const currentTotalReview = reviews?.data?.length ?? 0;
  const [matchReview, setMatchReview] = useState([]);

  useEffect(() => {
    if (reviews?.data.length > 0) {
      const checkId = reviews.data.filter(
        (item) => item.userId === userInfo.id
      );
      setMatchReview(checkId);
    }
  }, [userInfo, reviews.data]);

  console.log(reviews.data[0]);
  const dispatch = useDispatch();

  const fetchReviews = useCallback(
    (currentPage) => {
      dispatch(getReviews(productId, currentPage, 8));
    },
    [dispatch, productId]
  );

  const fetchVerifiedPurchaseInfo = useCallback(() => {
    dispatch(getVerifiedPurchaseInfo(userInfo.id, productId));
  }, [dispatch, productId, userInfo.id]);

  const handleOnPageFocus = useCallback(() => {
    fetchReviews(1);
    fetchVerifiedPurchaseInfo();
  }, [fetchReviews, fetchVerifiedPurchaseInfo]);

  useFocusEffect(
    useCallback(() => {
      handleOnPageFocus();
    }, [handleOnPageFocus])
  );

  const handleEndReached = () => {
    if (currentTotalReview < reviews.total) {
      dispatch(getNextReviews(productId, page + 1, 8));
      setPage(page + 1);
    }
  };

  return (
    <SafeAreaView style={[flex.justifyContentSpace, flex.grow1]}>
      <Header navigation={navigation} />

      <View style={[paddings["p-4"], flex.grow1, flex.justifyContentCenter]}>
        {reviews.isFetching && !reviews?.data && <SmallLoader />}

        {reviews.data && (
          <FlatList
            data={reviews?.data ?? []}
            renderItem={({ item }) => <ReviewCard review={item} />}
            keyExtractor={(item, index) => item + index}
            ListEmptyComponent={
              reviews.isFetching ? (
                <></>
              ) : (
                <EmptyState icon="star" text="No review yet" />
              )
            }
            onEndReached={handleEndReached}
          />
        )}
      </View>
      {/* {reviews.data < 1 && ( */}
      {totalOrder && !matchReview.length ? (
        <Footer
          handleSubmit={() =>
            navigation.navigate("LeaveProductReview", {
              productDetail: productDetail,
              productId,
            })
          }
        />
      ) : null}
    </SafeAreaView>
  );
};

export default ProductReviewsScreen;
