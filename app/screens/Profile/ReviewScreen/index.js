import React, { useState, useEffect } from "react";
import { View, FlatList, Platform, SafeAreaView } from "react-native";
import _ from "lodash";
import { BallIndicator } from "react-native-indicators";
import { getUserReview } from "#services/apiUsers";
import { Utilities } from "#styles";
import { Colors } from "#themes";
import Tabs from "./Tabs";
import { styles } from "./styles";
import { ReviewItem } from "./ReviewItem";
import { StarRatingView } from "./StarRatingView";
import { Label } from "#components";
import { useSelector } from "react-redux";
import { userSelector } from "#modules/User/selectors";

const tabs = [
  { id: "all", name: "All" },
  { id: "positive", name: "Positive" },
  { id: "negative", name: "Negative" },
];

const ReviewScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState(tabs[1].id);
  const [poReview, setPoReview] = useState([]);
  const [neReview, setNeReview] = useState([]);
  const [allReview, setAllReview] = useState([]);

  const [isFetchingPO, setFetchingPO] = useState(true);
  const [isFetchingNE, setFetchingNE] = useState(true);
  const [isFetchingAll, setFetchingAll] = useState(true);
  const [initialFetching, setInitialFetching] = useState(true);

  const [poPage, setPOPage] = useState(1);
  const [nePage, setNEPage] = useState(1);
  const [allPage, setAllPage] = useState(1);

  const [hasMorePO, setHasMorePO] = useState(true);
  const [hasMoreNE, setHasMoreNE] = useState(true);
  const [hasMoreALL, setHasMoreALL] = useState(true);

  const [allNativeEvent, setAllNativeEvent] = useState({});
  const [poNativeEvent, setPoNativeEvent] = useState({});
  const [neNativeEvent, setNeNativeEvent] = useState({});

  const userID = route?.params?.id;

  const { user } = useSelector(userSelector);

  const location = _.get(user.information, "location", null);

  useEffect(() => {
    let isSubscribed = true;
    const fetchPositiveReview = async () => {
      const param = {
        rating: 3,
        direction: "above",
        perPage: 20,
        page: poPage,
      };
      setFetchingPO(true);
      const res = await getUserReview({ userID, param });
      const errorMsg = _.get(res, "result.content.message", null);
      if (isSubscribed) {
        if (errorMsg) {
          return alert(errorMsg);
        }
        setFetchingPO(false);
        setInitialFetching(false);

        setPoReview(res.data);
        if (poReview?.length == res?.total) {
          setHasMorePO(false);
        } else {
          setPOPage(poPage + 1);
        }
      }
    };

    const fetchNegativeReview = async () => {
      const param = {
        rating: 3,
        direction: "below",
        perPage: 20,
        page: nePage,
      };
      setFetchingNE(true);
      const res = await getUserReview({ userID, param });
      const errorMsg = _.get(res, "result.content.message", null);
      if (isSubscribed) {
        if (errorMsg) {
          return alert(errorMsg);
        }
        setFetchingNE(false);
        setNeReview(res.data);

        if (neReview?.length == res?.total) {
          setHasMoreNE(false);
        } else {
          setNEPage(nePage + 1);
        }
      }
    };

    const fetchAllReview = async () => {
      const param = {
        perPage: 20,
        page: allPage,
      };
      setFetchingAll(true);
      const res = await getUserReview({ userID, param });
      const errorMsg = _.get(res, "result.content.message", null);
      if (isSubscribed) {
        if (errorMsg) {
          return alert(errorMsg);
        }
        setFetchingAll(false);
        setAllReview(res.data);

        if (allReview?.length == res?.total) {
          setHasMoreALL(false);
        } else {
          setAllPage(allPage + 1);
        }
      }
    };

    fetchPositiveReview();
    fetchNegativeReview();
    fetchAllReview();
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    const { contentSize, layoutMeasurement, contentOffset } = allNativeEvent;
    if (!contentOffset || !layoutMeasurement || !contentSize) return;
    const offset =
      Platform.OS === "ios"
        ? contentSize.height - layoutMeasurement.height + 50
        : contentSize.height - layoutMeasurement.height - 1;
    if (contentOffset.y > offset) {
      if (!isFetchingAll && hasMoreALL) {
        const fetchAllReview = async () => {
          const param = {
            perPage: 20,
            page: allPage,
          };
          setFetchingAll(true);
          const res = await getUserReview({ userID, param });

          const errorMsg = _.get(res, "result.content.message", null);
          if (errorMsg) {
            // return alert(errorMsg);
          }
          setFetchingAll(false);
          setAllReview([...allReview, ...res.data]);
          if (allReview?.length == res?.total) {
            setHasMoreALL(false);
          } else {
            setAllPage(allPage + 1);
          }
        };
        fetchAllReview();
      }
    }
  }, [allNativeEvent]);

  useEffect(() => {
    const { contentSize, layoutMeasurement, contentOffset } = poNativeEvent;
    if (!contentOffset || !layoutMeasurement || !contentSize) return;
    const offset =
      Platform.OS === "ios"
        ? contentSize.height - layoutMeasurement.height + 50
        : contentSize.height - layoutMeasurement.height - 1;
    if (contentOffset.y > offset) {
      if (!isFetchingPO && hasMorePO) {
        const fetchPositiveReview = async () => {
          const param = {
            rating: 3,
            direction: "above",
            perPage: 20,
            page: poPage,
          };
          setFetchingPO(true);
          const res = await getUserReview({ userID, param });
          const errorMsg = _.get(res, "result.content.message", null);
          if (errorMsg) {
            return alert(errorMsg);
          }
          setFetchingPO(false);
          setPoReview([...poReview, ...res.data]);
          if (poReview?.length == res?.total) {
            setHasMorePO(false);
            return;
          } else if (poReview?.length != res?.total) {
            setPOPage(poPage + 1);
          }
        };
        fetchPositiveReview();
      }
    }
  }, [poNativeEvent]);

  useEffect(() => {
    const { contentSize, layoutMeasurement, contentOffset } = neNativeEvent;
    if (!contentOffset || !layoutMeasurement || !contentSize) return;
    const offset =
      Platform.OS === "ios"
        ? contentSize.height - layoutMeasurement.height + 50
        : contentSize.height - layoutMeasurement.height - 1;
    if (contentOffset.y > offset) {
      if (!isFetchingNE && hasMoreNE) {
        const fetchNegativeReview = async () => {
          const param = {
            rating: 3,
            direction: "below",
            perPage: 20,
            page: nePage,
          };
          setFetchingNE(true);
          const res = await getUserReview({ userID, param });
          const errorMsg = _.get(res, "result.content.message", null);
          if (errorMsg) {
            return alert(errorMsg);
          }
          setFetchingNE(false);
          setNeReview([...neReview, ...res.data]);
          if (neReview?.length == res?.total) {
            setHasMoreNE(false);
            return;
          } else {
            setNEPage(nePage + 1);
          }
        };
        fetchNegativeReview();
      }
    }
  }, [neNativeEvent]);

  const onAllScroll = ({ nativeEvent }) => {
    setAllNativeEvent(nativeEvent);
  };

  const onPoScroll = ({ nativeEvent }) => {
    setPoNativeEvent(nativeEvent);
  };

  const onNeScroll = ({ nativeEvent }) => {
    setNeNativeEvent(nativeEvent);
  };

  const name = route?.params?.name ?? "My Review's";

  const EmptyBoard = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Label size="medium" style={styles.grayText}>
        {name === "My Review's"
          ? "You has no reviews."
          : "The user has no reviews."}
      </Label>
    </View>
  );

  const reviews = route?.params?.reviews ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      {reviews > 0 && (
        <StarRatingView
          reviews={reviews}
          rating={route?.params?.rating ?? 0}
        />
      )}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {!initialFetching && (
        <View style={styles.contentContainer}>
          {activeTab === tabs[0].id && (
            <>
              <FlatList
                data={allReview}
                keyExtractor={(item, index) => `key-${index}`}
                renderItem={(data) =>
                  ReviewItem(data, navigation, location, userID)
                }
                style={styles.listView}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                onScroll={onAllScroll}
                ListEmptyComponent={() => EmptyBoard()}
              />
              {isFetchingAll && (
                <View style={{ height: 40 }}>
                  <View style={Utilities.style.activityContainer1}>
                    <BallIndicator size={30} color={Colors.active} />
                  </View>
                </View>
              )}
            </>
          )}
          {activeTab === tabs[1].id && (
            <>
              <FlatList
                data={poReview}
                keyExtractor={(item, index) => `key-${index}`}
                renderItem={(data) =>
                  ReviewItem(data, navigation, location, userID)
                }
                style={styles.listView}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                onScroll={onPoScroll}
                ListEmptyComponent={() => EmptyBoard()}
              />
              {isFetchingPO && (
                <View style={{ height: 40 }}>
                  <View style={Utilities.style.activityContainer1}>
                    <BallIndicator size={30} color={Colors.active} />
                  </View>
                </View>
              )}
            </>
          )}
          {activeTab === tabs[2].id && (
            <>
              <FlatList
                data={neReview}
                keyExtractor={(item, index) => `key-${index}`}
                renderItem={(data) =>
                  ReviewItem(data, navigation, location, userID)
                }
                style={styles.listView}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                onScroll={onNeScroll}
                ListEmptyComponent={() => EmptyBoard()}
              />
              {isFetchingNE && (
                <View style={{ height: 40 }}>
                  <View style={Utilities.style.activityContainer1}>
                    <BallIndicator size={30} color={Colors.active} />
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      )}
      {initialFetching && (
        <View style={Utilities.style.activityContainer1}>
          <BallIndicator size={30} color={Colors.active} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ReviewScreen;
