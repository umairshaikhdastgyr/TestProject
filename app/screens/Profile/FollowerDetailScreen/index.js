import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  TouchableOpacity,
  View,
  ScrollView,
  Share,
  Modal,
  SafeAreaView,
} from "react-native";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import ActionSheet from "react-native-actionsheet";
import { Button, Icon, Label, SweetAlert } from "#components";
import { styles } from "./styles";
import { UserInfo } from "./UserInfo";
import { ReviewContent } from "./ReviewContent";
import { IdeaBoard } from "./IdeaBoard";
import { PostItems } from "./PostItems";
import {
  getUserReview,
  getFollowerDetails,
  followUser,
  unfollowUser,
  getFollowerValidCards,
  clearUserReport,
  getUserInfo,
} from "#modules/User/actions";
import { margins } from "#styles/utilities";
import { fetchFollowerAlbumsIdeas } from "#modules/Ideas/actions";
import { userSelector } from "#modules/User/selectors";
import { selectIdeasData } from "#modules/Ideas/selectors";
import ShareSheet from "#components/Share";
import usePrevious from "#utils/usePrevious";
import { getFirebaseLink } from "#utils";
import { showMessage } from "react-native-flash-message";
import { MainAuthStackNavigation } from "../../../navigators/MainAuthStackNavigation";

const FollowerDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const GetUserInfo = (user) => dispatch(getUserInfo(user));
  const followerData = route?.params?.data ?? null;
  const fromData = route?.params?.from ?? null;
  const [showModal, setShowModal] = useState(false);
  const userToGet = followerData?.id ?? "";
  const {
    user: {
      information: { id: currentUserId, email },
      userProductDetail,
      userReviewsState,
      followerDetailState,
      sendUserReportState,
    },
  } = useSelector(userSelector);
  const prevSendUserReportState = usePrevious(sendUserReportState);
  const { followerAlbum } = useSelector(selectIdeasData());
  const [visibleShare, setVisibleShare] = useState(false);
  const firstName = _.get(followerData, "firstName", "Undefined");
  const lastName = _.get(followerData, "lastName", "Undefined");
  const [shareOptions, setshareOptions] = useState({
    title: "Homitag app",
    message: `I invite u to meet ${firstName} ${lastName} in Homitag App!`,
    url: "",
    subject: "Share Link",
    social: Share.Soc, //  for email
  });

  const updateShareOptions = async () => {
    const link = await getFirebaseLink(`?supplierId=${followerData?.id}`);
    setshareOptions({
      title: "Homitag app",
      message: `I invite u to meet ${firstName} ${lastName} in Homitag App!`,
      url: link,
      subject: "Share Link",
      social: Share.Soc, //  for email
    });
  };
  let MoreActionSheetRef = useRef(null);
  const loadInitialData = useCallback(() => {
    const reviewParams = {
      perPage: 2,
      page: 1,
    };

    const ideaParams = {
      perPage: 1,
      page: 1,
      userId: userToGet,
      isPrivate: false,
    };
    GetUserInfo({
      userId: userToGet,
      params: { light: true, followedUser: currentUserId },
    });
    dispatch(getFollowerDetails({ userId: userToGet, userToGet }));
    dispatch(getUserReview({ userID: userToGet, param: reviewParams }));
    dispatch(fetchFollowerAlbumsIdeas({ params: ideaParams }));
    dispatch(getFollowerValidCards(userToGet));
  }, [dispatch, userToGet]);

  const onShare = () => {
    setVisibleShare(true);
  };

  const showMore = () => {
    if (!currentUserId) {
      setShowModal(true);
      return;
    } else {
      MoreActionSheetRef?.current?.show();
    }
  };

  useEffect(() => {
    setVisibleShare(false);
    updateShareOptions();
  }, []);

  const [nativeEvent, setNativeEvent] = useState({});
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const onScroll = (event) => {
    setNativeEvent(event.nativeEvent);
  };

  const actionSheetData = {
    1: ["Report Seller", "Cancel"],
    2: ["Unfollow", "Report Seller", "Cancel"],
    3: ["Unfollow", "Block", "Report Seller", "Cancel"],
  };

  const [reportedStatus, setReportedStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (sendUserReportState.data && !prevSendUserReportState?.data) {
      setReportedStatus({
        title: "Success",
        visible: true,
        message: "You've reported successfully",
        type: "success",
      });
    }
    if (sendUserReportState.data == null) {
      setReportedStatus({
        title: "",
        visible: false,
        message: "",
        type: "",
      });
    }
  }, [prevSendUserReportState, sendUserReportState]);

  useEffect(() => {
    if (sendUserReportState.failure && !prevSendUserReportState?.failure) {
      setReportedStatus({
        title: "Oops!",
        visible: true,
        message: JSON.stringify(sendUserReportState.failure),
        type: "error",
      });
    }
    if (sendUserReportState.failure == null) {
      setReportedStatus({
        title: "",
        visible: false,
        message: "",
        type: "",
      });
    }
  }, [prevSendUserReportState, sendUserReportState.failure]);

  const unfollowAction = async () => {
    dispatch(
      unfollowUser({
        userID: currentUserId,
        userToFollow: userToGet,
      })
    );

    setTimeout(() => {
      dispatch(getFollowerDetails({ userId: userToGet, userToGet }));
    }, 500);
  };

  const followAction = async () => {
    dispatch(
      followUser({
        userID: currentUserId,
        userToFollow: userToGet,
      })
    );

    setTimeout(() => {
      dispatch(getFollowerDetails({ userId: userToGet, userToGet }));
    }, 500);
  };

  const onActionSheetMore = (index, dataIndex) => {
    switch (actionSheetData[dataIndex][index]) {
      case "Report Seller":
        navigation.navigate("ReportScreen", {
          type: "Report Seller",
          name: `${firstName} ${lastName}`,
          reportedUserId: userToGet,
        });
        break;
      case "Unfollow":
        unfollowAction();
        break;
      case "Help":
        navigation.navigate("HelpFeedback");
        break;
      case "Block":
        showMessage({
          message: `${firstName} ${lastName} blocked successfully.`,
          type: "success",
        });
        navigation.navigate("ProfileMain");
        break;
      case "Cancel":
        // alert("Cancel");
        break;
      default:
        break;
    }
  };

  const onAlertModalTouchOutside = () => {
    setReportedStatus({
      title: "",
      visible: false,
      message: "",
      type: "",
    });
    dispatch(clearUserReport());
  };

  const data = route?.params?.data ?? null;
  const rating = parseFloat(_.get(followerDetailState, "data.rating", 0));

  const isFollowing = _.get(userProductDetail, "data.isFollowing", "0") !== "0";

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    });
  }, [navigation]);

  const headerRight = () => (
    <View style={styles.headerRightContainer}>
      <TouchableOpacity
        style={styles.rightIconContainer}
        onPress={() => {
          onShare();
        }}
      >
        <Icon icon="share" color="grey" style={styles.moreIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.rightIconContainer1}
        onPress={() => showMore()}
      >
        <Icon icon="more" color="grey" style={styles.moreIcon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView scrollEventThrottle={16} onScroll={onScroll}>
        <UserInfo
          navigation={navigation}
          info={data}
          userInfoData={followerDetailState}
          followerData={userProductDetail}
          unfollowAction={unfollowAction}
          followAction={followAction}
          isFollowVisible={userToGet !== currentUserId}
          currentUserId={currentUserId}
        />
        <ReviewContent
          navigation={navigation}
          data={userReviewsState.data}
          loading={userReviewsState.isFetching}
          userId={userToGet}
          reviewCount={
            followerDetailState.data && followerDetailState.data.reviews
          }
          rating={rating}
          firstName={firstName}
          lastName={lastName}
        />
        <IdeaBoard
          navigation={navigation}
          data={followerAlbum.list}
          loading={followerAlbum.isFetching}
          userId={userToGet}
          firstName={firstName}
          lastName={lastName}
        />
        <PostItems
          navigation={navigation}
          nativeEvent={nativeEvent}
          sellerId={_.get(data, "id", null)}
          user={data}
        />
      </ScrollView>
      {/* <ActionSheet
        ref={(o) => {
          MoreActionSheet = o;
        }}
        options={actionSheetData[1]}
        destructiveButtonIndex={3}
        cancelButtonIndex={3}
        onPress={(index) => onActionSheetMore(index, 1)}
      /> */}
      <ActionSheet
        ref={MoreActionSheetRef}
        options={
          email == "nikunjp01@mailinator.com"
            ? actionSheetData[3]
            : isFollowing
            ? actionSheetData[2]
            : actionSheetData[1]
        }
        destructiveButtonIndex={
          email == "nikunjp01@mailinator.com"
            ? actionSheetData[3].length - 1
            : isFollowing
            ? actionSheetData[2].length - 1
            : actionSheetData[1].length - 1
        }
        cancelButtonIndex={
          email == "nikunjp01@mailinator.com"
            ? actionSheetData[3].length - 1
            : isFollowing
            ? actionSheetData[2].length - 1
            : actionSheetData[1].length - 1
        }
        onPress={(index) =>
          onActionSheetMore(
            index,
            email == "nikunjp01@mailinator.com" ? 3 : isFollowing ? 2 : 1
          )
        }
      />
      <ShareSheet
        visible={visibleShare}
        setVisibleShare={setVisibleShare}
        title="Share Profile"
        shareOptions={shareOptions}
      />
      <SweetAlert
        title={reportedStatus.title}
        message={reportedStatus.message}
        type={reportedStatus.type}
        dialogVisible={reportedStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
      <Modal
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: "#00000060",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "90%",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <View style={[margins["mb-3"]]}>
              <Label size="large" style={{ textAlign: "center" }}>
                You need to login first. Do you want to login?
              </Label>
            </View>
            <Button
              label="Yes"
              style={[margins["mb-3"]]}
              onPress={async () => {
                await setShowModal((prevState) => !prevState);
                MainAuthStackNavigation(navigation);
              }}
            />
            <Button
              label="No"
              theme="secondary"
              onPress={() => setShowModal(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FollowerDetailScreen;
