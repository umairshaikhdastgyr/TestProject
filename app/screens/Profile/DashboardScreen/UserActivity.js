import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { styles } from "./styles";
import { BuyList } from "./BuyList";
import { SellList } from "./SellList";
import Tabs from "./Tabs";
import { userSelector } from "#modules/User/selectors";
import { BoostScreen } from "./BoostScreen";
import PostUpdateAlert from "#components/PostUpdateAlert";
import { clearUpdatePostStatus } from "#modules/Sell/actions";
import {
  clearBuyList,
  clearSellList,
  getBuyNextPage,
  getSellNextPage,
  getUserBuyList,
  getUserSellList,
} from "#modules/User/actions";
import { getPostDetail } from "#services/apiPosts";
import { useFocusEffect } from "@react-navigation/native";

const tabs = [
  { id: "buy", name: "Buy" },
  { id: "sell", name: "Sell" },
];

export const UserActivity = ({
  navigation,
  boost,
  updatePostStatus,
  showSellSection,
  userId,
  boostItem,
  successCount,
  route,
}) => {
  const screen = route?.params?.fromScreen ?? null;
  const dispatch = useDispatch();
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [boostStatus, setBoostStatus] = useState(false);
  const [updateAlertVisible, setUpdateAlertVisible] = useState(false);
  const [updateAlertVisible2, setUpdateAlertVisible2] = useState(false);
  const [buyPage, setBuyPage] = useState(1);
  const [sellPage, setSellPage] = useState(1);
  const [count, setCount] = useState(0);

  const {
    user: {
      userBuyListState,
      userSellListState,
      isFetchingNextPageBuyList,
      noMoreBuyList,
      isFetchingNextPageSellList,
      noMoreSellList,
    },
  } = useSelector(userSelector);

  useEffect(() => {
    if (boost === "true") {
      setBoostStatus(true);
      setShowBoostModal(boostItem);
    }
  }, [boost]);

  useFocusEffect(
    useCallback(() => {
      setBuyPage(1);
      setSellPage(1);
    }, [])
  );

  const loadBuyList = useCallback(
    (page) => {
      const buyParams = {
        type: "buy",
        userId: userId,
        page: page,
      };
      dispatch(getUserBuyList(buyParams, page));
    },
    [dispatch, userId]
  );

  const loadSellList = useCallback(
    (page) => {
      const sellParams = {
        type: "sell",
        userId: userId,
        page: page,
        isDashBoard: true,
      };
      setSellPage(page);
      dispatch(getUserSellList(sellParams, page));
    },
    [dispatch, userId]
  );

  const reloadList = useCallback(() => {
    clearBuyList();
    clearSellList();
    loadBuyList(buyPage);
    loadSellList(sellPage);
  }, [loadBuyList, loadSellList]);

  const onEndReached = () => {
    if (
      !isFetchingNextPageBuyList &&
      !noMoreBuyList &&
      userBuyListState?.total > userBuyListState?.data?.length
    ) {
      const buyParams = {
        type: "buy",
        userId: userId,
        page: buyPage + 1,
      };
      dispatch(getBuyNextPage(buyParams, buyPage + 1));
      setBuyPage(buyPage + 1);
      return;
    }
  };

  const onEndSellReached = () => {
    if (
      !isFetchingNextPageSellList &&
      !noMoreSellList &&
      userSellListState?.total > userSellListState?.data?.length
    ) {
      const sellParams = {
        type: "sell",
        userId: userId,
        page: sellPage + 1,
      };
      dispatch(getSellNextPage(sellParams, sellPage + 1));
      setSellPage(sellPage + 1);
      return;
    }
  };

  useEffect(() => {
    if (updatePostStatus.rediecrtParam) {
      if (updateAlertVisible2) {
        setCount(count + 1);
        setUpdateAlertVisible(true);
        setUpdateAlertVisible2(false);
      }
    } else if (updatePostStatus.rediecrtParam == null) {
      setUpdateAlertVisible2(true);
    }
  }, [
    updatePostStatus,
    updatePostStatus.rediecrtParam,
    userSellListState?.data,
  ]);

  const onAlertModalTouchOutside = () => {
    setCount(0);
    setUpdateAlertVisible(false);
    setUpdateAlertVisible2(false);
    dispatch(clearUpdatePostStatus());
  };

  const deActivateSuccessAction = async (type) => {
    setCount(0);
    setUpdateAlertVisible(false);
    setUpdateAlertVisible2(false);
    if (type === "view") {
      navigation.navigate("ProductDetail", {
        postId: updatePostStatus?.rediecrtParam?.postId,
        params: updatePostStatus.rediecrtParam,
        isFromDashboard: true,
      });
    }
    if (type === "boost") {
      // const post = userSellListState?.data?.find(
      //   (d) => {
      //     return d.postId === updatePostStatus?.rediecrtParam?.postId}
      // );
      const postDetail = await getPostDetail({
        postId: updatePostStatus?.rediecrtParam?.postId,
        params: {
          lat: 0,
          lng: 0,
          userId: userId,
        },
      });
      setShowBoostModal(postDetail?.data);
      setBoostStatus(true);
    }
  };

  const [activeTab, setActiveTab] = useState(
    screen === "explore" || screen === "editPost" || showSellSection
      ? tabs[1].id
      : tabs[0].id
  );

  const handleBoostItem = async (value) => {
    const postDetail = await getPostDetail({
      postId: value?.postId,
      params: {
        lat: 0,
        lng: 0,
        userId: userId,
      },
    });
    setShowBoostModal(postDetail?.data);
  };
  return (
    <View style={styles.activityContainer}>
      <Text style={styles.titleText}>Your Activity</Text>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
      {activeTab === "buy" ? (
        <BuyList
          products={userBuyListState.data}
          isFetching={userBuyListState.isFetching}
          navigation={navigation}
          reloadList={reloadList}
          onEndReached={onEndReached}
          isFetchingNextPageBuyList={isFetchingNextPageBuyList}
        />
      ) : (
        <SellList
          products={userSellListState.data}
          isFetching={userSellListState.isFetching}
          navigation={navigation}
          loadSellData={() => {
            loadSellList(1);
          }}
          showBoost={(item) => {
            handleBoostItem(item);
          }}
          reloadList={reloadList}
          onEndReached={onEndSellReached}
          isFetchingNextPageSellList={isFetchingNextPageSellList}
          successCount={successCount}
        />
      )}

      {count == 1 && (
        <PostUpdateAlert
          onTouchOutside={onAlertModalTouchOutside}
          onBtAPressed={() => deActivateSuccessAction("view")}
          onBtBPressed={() => deActivateSuccessAction("boost")}
          dialogVisible={updateAlertVisible}
          type="reactivated"
          postName={updatePostStatus?.rediecrtParam?.postName}
        />
      )}
      {boostStatus && (
        <BoostScreen
          item={showBoostModal}
          navigation={navigation}
          boost={true}
          visible={showBoostModal && !updateAlertVisible ? true : false}
          closeModal={() => {
            reloadList();
            setBoostStatus(false);
            setShowBoostModal(false);
          }}
        />
      )}

      {showBoostModal && (
        <BoostScreen
          item={showBoostModal}
          navigation={navigation}
          boost={true}
          visible={showBoostModal ? true : false}
          closeModal={() => {
            reloadList();
            setBoostStatus(false);
            setShowBoostModal(false);
          }}
        />
      )}
    </View>
  );
};
