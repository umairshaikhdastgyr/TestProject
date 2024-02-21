import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { flex, safeAreaNotchHelper } from "#styles/utilities";
import { useActions } from "#utils";
import { leaveReview } from "#modules/User/actions";
import { setPhotoList } from "#modules/Sell/actions";
import { SweetAlert } from "#components";
import { selectUserData } from "#modules/User/selectors";
import RatingSection from "./rating-section";
import ExperienceSection from "./experience-section";
import CommentSection from "./comment-section";
import Footer from "./Footer";
import { Label } from "#components";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { addProductReview } from "#modules/ProductReview/actions";
import { selectReviewsData } from "#modules/ProductReview/selectors";
import { CommonActions } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const LeaveReviewScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFromProductReview = route?.params?.isFromProductReview;
  const productReview = route?.params?.productReview;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [experience, setExperience] = useState([]);
  const [alertStatus, setAlertStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });
  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(0);

  const { leaveReviewState } = useSelector(selectUserData());
  const { addProductReviewResult } = useSelector(selectReviewsData());

  useEffect(() => {
    navigation.addListener("focus", () => {
      setAlertStatus({
        title: "",
        message: "",
        visible: false,
        type: "",
      });
    });
  }, [leaveReviewState]);

  const actions = useActions({
    leaveReview,
    setPhotoList,
  });

  useEffect(() => {
    if (count == 1) {
      if (addProductReviewResult.failure) {
        setAlertStatus({
          title: "Add Review Unsuccessful",
          message: addProductReviewResult.failure.content.message,
          type: "error",
          visible: true,
        });
        setCount(0);
        actions.setPhotoList([]);
      }
      if (isFromProductReview && addProductReviewResult.data) {
        setAlertStatus({
          title: "Review submitted!",
          message:
            "Thanks for leaving a review. It will be approved and posted.",
          visible: true,
          type: "success",
        });
        actions.setPhotoList([]);
        setCount(0);
      } else {
        if (!leaveReviewState.isFetching) {
          if (leaveReviewState.success) {
            setAlertStatus({
              title: "",
              message: `Thanks for reviewing ${sellerName}! Your review has been submitted.`,
              visible: true,
              type: "success",
            });
            setCount(0);
          }
        }
      }
    }
  }, [navigation, leaveReviewState, addProductReviewResult]);

  const orderId = route?.params?.orderId;
  const postId = route?.params?.postId;
  const sellerName = route?.params?.sellerName;
  const reviewed = route?.params?.reviewed;
  const sellerId = route?.params?.sellerId;

  const handleSubmit = async () => {
    setLoader(true);
    if (isFromProductReview) {
      dispatch(
        addProductReview(
          productReview.productId,
          productReview.userId,
          productReview.rating,
          productReview.reviewTitle,
          productReview.reviewComment,
          productReview.size,
          productReview.uploadedImages,
          productReview.orderId
        )
      );
    }
    actions.leaveReview({
      rating,
      comment,
      experience: experience?.[0],
      postId,
      orderId,
      // sellerId,
      reviewingUserId: sellerId,
    });
    setLoader(false);
    setCount(count + 1);
  };

  const enableSubmitButton = () => {
    return rating && comment && experience;
  };

  const onAlertModalTouchOutside = () => {
    //here
    setAlertStatus({
      title: "",
      visible: false,
      message: "",
      type: "",
    });

    navigation.dispatch((state) => {
      const routes = state.routes.filter(
        (r) => r.name !== "LeaveReview" || r.name !== "LeaveProductReview"
      );
      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
    navigation.navigate("Dashboard");
  };

  return (
    <>
      <SafeAreaView style={flex.grow1}>
        {loader && <ScreenLoader />}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <KeyboardAwareScrollView style={{ paddingBottom: 120 }}>
            {/* {reviewed == true ? ( */}
            {false ? (
              <Label
                bold
                size="medium"
                style={{ fontSize: 15, textAlign: "center", marginTop: 48 }}
              >
                You already reviewed on this seller
              </Label>
            ) : (
              <>
                <RatingSection
                  sellerName={sellerName}
                  rating={rating}
                  setRating={setRating}
                />
                <Text
                  style={{
                    borderBottomWidth: 0.7,
                    borderBottomColor: "#B9B9B9",
                    marginHorizontal: 20,
                  }}
                ></Text>

                <ExperienceSection
                  experience={experience}
                  sellerName={sellerName}
                  setExperience={setExperience}
                />
                <Text
                  style={{
                    borderBottomWidth: 0.7,
                    borderBottomColor: "#B9B9B9",
                    marginHorizontal: 20,
                    marginTop: -25,
                    marginBottom: 25,
                  }}
                ></Text>

                <CommentSection comment={comment} setComment={setComment} />
              </>
            )}
          </KeyboardAwareScrollView>
        </ScrollView>
        <Footer
          disabled={!enableSubmitButton()}
          reviewed={reviewed}
          handleSubmit={handleSubmit}
        />
      </SafeAreaView>
      <SweetAlert
        title={alertStatus.title}
        message={alertStatus.message}
        type={alertStatus.type}
        dialogVisible={alertStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        onDone={onAlertModalTouchOutside}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default LeaveReviewScreen;
