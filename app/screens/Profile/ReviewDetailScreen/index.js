import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import * as Progress from "react-native-progress";
import ActionSheet from "react-native-actionsheet";
import StarRating from "react-native-star-rating";
import moment from "moment";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "#modules/User/selectors";
import { CachedImage, Icon, SweetAlert } from "#components";
import Icons from "#assets/icons";
import { capitalize } from "#utils";
import { Colors } from "#themes";
import { styles } from "./styles";
import usePrevious from "#utils/usePrevious";
import { clearUserReport } from "#modules/User/actions";

let actionSheetRef;

const ReviewDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const {
    user: { sendUserReportState, information },
  } = useSelector(userSelector);
  const [reportedStatus, setReportedStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });
  const prevSendUserReportState = usePrevious(sendUserReportState);

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

  const showMore = () => {
    actionSheetRef.show();
  };
  const item = route?.params?.data ?? null;
  const address = route?.params?.location ?? null;
  const reviewUserId = route?.params?.reviewUserId ?? null;
  const title = _.get(item, "reviewData.experience", "Undefined");
  const comment = _.get(item, "reviewData.comment", "Undefined");
  // const address = ""
  const rating = parseFloat(_.get(item, "reviewData.rating", 0));
  const date = new Date(_.get(item, "updatedAt", null));
  const firstName = _.get(item, "firstName", "Undefined");
  const lastName = _.get(item, "lastName", "Undefined");
  const photoURI = _.get(item, "profilepictureurl", null);

  const onPressActionSheet = (index) => {
    const reviewId = _.get(item, "id", "Undefined");
    switch (index) {
      case 0:
        navigation.navigate("ReportScreen", {
          type: "Report Review",
          reviewId,
          name: `${firstName} ${lastName}`,
        });
        break;

      case 1:
        navigation.navigate("ReportScreen", {
          type: "Report User",
          reportedUserId: item.reviewData.reviewingUserId,
          name: `${firstName} ${lastName}`,
        });
        break;
      case 2:
        navigation.navigate("HelpFeedback");
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

  if (information?.id == reviewUserId) {
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: headerRight,
      });
    }, [navigation]);
  }

  const headerRight = () => (
    <>
      {information?.id == reviewUserId && (
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={() => showMore()}
        >
          <Icon icon="more" color="grey" style={styles.moreIcon} />
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.reviewItemContainer}>
        <View style={styles.space} />
        <Text style={styles.blackBoldText}>{capitalize(title)}</Text>
        <View style={styles.separator} />
        <StarRating
          iconSet="Ionicons"
          maxStars={5}
          rating={rating}
          fullStarColor={Colors.active}
          disabled
          starSize={20}
          fullStar={Icons.star_active}
          emptyStar={Icons.star_grey}
          halfStar={Icons["half-star"]}
        />
        <View style={styles.separator} />
        <Text style={styles.grayText}>{comment}</Text>
        <View style={styles.separator} />
        <Text style={styles.grayText}>{moment(date).format("DD-MM-YYYY")}</Text>
        <View style={styles.space} />
        <View style={styles.reviewerContainer}>
          <View style={styles.reviewerImgContainer}>
            {photoURI ? (
              <CachedImage
                source={{ uri: photoURI }}
                style={styles.reviewerImg}
                indicator={Progress.Pie}
                indicatorProps={{
                  size: 30,
                  borderWidth: 0,
                  color: Colors.primary,
                  unfilledColor: Colors.white,
                }}
              />
            ) : (
              <CachedImage
                source={require("../../../assets/images/img_placeholder.jpg")}
                style={styles.reviewerImg}
                indicator={Progress.Pie}
                indicatorProps={{
                  size: 30,
                  borderWidth: 0,
                  color: Colors.primary,
                  unfilledColor: Colors.white,
                }}
              />
            )}
          </View>
          <View style={styles.reviewerSubContainer}>
            <Text style={styles.blackMediumText}>
              {`${firstName} ${lastName}`}
            </Text>
            <Text style={styles.grayText1}>{address}</Text>
          </View>
        </View>
        <View style={styles.space} />
      </View>
      <ActionSheet
        ref={(o) => (actionSheetRef = o)}
        options={["Report Review", "Report User", "Help", "Cancel"]}
        cancelButtonIndex={3}
        onPress={onPressActionSheet}
      />
      <SweetAlert
        title={reportedStatus.title}
        message={reportedStatus.message}
        type={reportedStatus.type}
        dialogVisible={reportedStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
    </SafeAreaView>
  );
};

export default ReviewDetailScreen;
