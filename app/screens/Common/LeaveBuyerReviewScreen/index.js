import React, { useState, useEffect } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { flex, safeAreaNotchHelper } from "#styles/utilities";
import { useActions } from "#utils";
import { leaveReview } from "#modules/User/actions";
import { SweetAlert } from "#components";
import { selectUserData } from "#modules/User/selectors";
import RatingSection from "./rating-section";
import ExperienceSection from "./experience-section";
import CommentSection from "./comment-section";
import Footer from "./Footer";
import { Label } from "#components";

const { height } = Dimensions.get("window");

const LeaveBuyerReviewScreen = ({ navigation, route }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [experience, setExperience] = useState([]);
  const [alertStatus, setAlertStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });

  const { leaveReviewState } = useSelector(selectUserData());
  const [count, setCount] = useState(0);

  useEffect(() => {
    setAlertStatus({
      title: "",
      message: "",
      visible: false,
      type: "",
    });
  }, []);

  useEffect(() => {
    if (count == 1) {
      if (!leaveReviewState.isFetching) {
        if (leaveReviewState.success) {
          setAlertStatus({
            title: "",
            message: `Thanks for reviewing ${buyerName}! Your review has been submitted.`,
            visible: true,
            type: "success",
          });
          setCount(0);
        }
      }
    }
  }, [navigation, leaveReviewState]);
  const actions = useActions({
    leaveReview,
  });

  const orderId = route?.params?.orderId;
  const postId = route?.params?.postId;
  const buyerName = route?.params?.buyerName;
  const reviewed = route?.params?.reviewed;
  const buyerId = route?.params?.buyerId;

  const handleSubmit = () => {
    actions.leaveReview({
      rating,
      comment,
      experience: experience?.[0],
      postId,
      orderId,
      reviewingUserId: buyerId,
    });
    setCount(count + 1);
  };

  const enableSubmitButton = () => {
    return rating && comment && experience;
  };

  const onAlertModalTouchOutside = () => {
    setAlertStatus({
      title: "",
      visible: false,
      message: "",
      type: "",
    });
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={flex.grow1}>
        <KeyboardAwareScrollView extraHeight={120}>
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
                buyerName={buyerName}
                showForSeller
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
                buyerName={buyerName}
                setExperience={setExperience}
              />
              <Text
                style={{
                  borderBottomWidth: 0.7,
                  borderBottomColor: "#B9B9B9",
                  marginHorizontal: 20,
                }}
              ></Text>

              <CommentSection comment={comment} setComment={setComment} />
            </>
          )}
        </KeyboardAwareScrollView>
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

export default LeaveBuyerReviewScreen;
