import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import {selectForUserData} from '#modules/User/selectors';
import {Icon, SweetAlert} from '#components';

import {styles} from './styles';
import {UserInfo} from './UserInfo';
import {UserActivity} from './UserActivity';
import {
  clearBuyList,
  clearSellList,
  getBuyList,
  getSellList,
  getUserBuyList,
  getUserSellList,
  getUserValidCards,
} from '#modules/User/actions';
import {selectSellData} from '#modules/Sell/selectors';
import usePrevious from '#utils/usePrevious';
import SuccessModal from './SuccessModal';
import {clearUpdatePostStatus} from '#modules/Sell/actions';
import {BoostScreen} from './BoostScreen';
import {useFocusEffect} from '@react-navigation/native';

const onPressSetting = navigation => {
  navigation.navigate('AccountSetting');
};

const DashboardScreen = ({navigation, route}) => {
  const screen = route?.params?.fromScreen ?? null;
  const [nativeEvent, setNativeEvent] = useState({});
  const dispatch = useDispatch();
  const {
    information: userInfo,
    userBuyListState,
    userSellListState,
  } = useSelector(selectForUserData());

  const {updatePostStatus} = useSelector(selectSellData());
  const sellState = useSelector(selectSellData());
  const prevSellState = usePrevious(sellState);
  const [alertStatus, setAlertStatus] = useState({
    title: '',
    visible: false,
    message: '',
    type: '',
  });
  const [successModal, setSuccessModal] = useState({
    isVisible: false,
  });

  const boost = route?.params?.boost;
  const boostItem = route?.params?.boostItem;

  const acType = _.get(updatePostStatus, 'rediecrtParam.acType', '');
  const postName = _.get(updatePostStatus, 'rediecrtParam.postName', '');
  const [updateAlertVisible, setUpdateAlertVisible] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // dispatch(getUserInfo({ userId: userInfo.id }));
    dispatch(getUserValidCards(userInfo.id));
  }, [dispatch, userInfo.id]);

  useEffect(() => {
    if (screen === 'editPost') {
      setAlertStatus({
        title: 'Edit Listing',
        visible: true,
        message: "You've successfully updated the post",
        type: 'success',
      });
    }

    /**
     * @description Verify if navigation is coming from "mark as sold" screen and should display message
     * @return Void
     */
    const _verifyPopUpMessage = () => {
      const from = route?.params?.from ?? '';
      success = route?.params?.success ?? false;
      if (from === 'MarkAsSold' && success) {
        setSuccessModal({
          isVisible: true,
        });
      }
    };

    _verifyPopUpMessage();
  }, [navigation, screen]);

  useEffect(() => {
    if (count == 1) {
      if (sellState.success && !prevSellState?.success) {
        setAlertStatus({
          title: 'Listing Deleted',
          visible: true,
          message: 'Your listing has been deleted.',
          type: 'success',
          alertType: 'action',
        });
      }
    }
  }, [dispatch, prevSellState, sellState.success, userInfo.id]);

  const onScroll = event => {
    setNativeEvent(event.nativeEvent);
  };

  /**
   * @description Dismiss success modal
   * @return void
   */
  const handleSuccessModalDismiss = () => {
    setSuccessModal({
      isVisible: false,
    });
  };

  const prevUpdatePostStatus = usePrevious(updatePostStatus);

  const onAlertModalTouchOutside = () => {
    setAlertStatus({
      title: '',
      visible: false,
      message: '',
      type: '',
    });
    setUpdateAlertVisible(false);
    dispatch(clearUpdatePostStatus());
  };

  const loadBuyList = useCallback(
    (page, value) => {
      const buyParams = {
        type: 'buy',
        userId: userInfo.id,
        page: 1,
      };
      if (value == 'focus') {
        dispatch(getBuyList(buyParams, page));
      } else {
        dispatch(getUserBuyList(buyParams, page));
      }
    },
    [dispatch, userInfo.id],
  );

  const loadSellList = useCallback(
    (page, value) => {
      const sellParams = {
        type: 'sell',
        userId: userInfo.id,
        page: 1,
        isDashBoard: true,
      };
      if (value == 'focus') {
        dispatch(getSellList(sellParams, page));
      } else {
        dispatch(getUserSellList(sellParams, page));
      }
    },
    [dispatch, userInfo.id],
  );

  const reloadList = useCallback(() => {
    clearBuyList();
    clearSellList();
    loadBuyList(1);
    loadSellList(1);
  }, [loadBuyList, loadSellList]);

  useEffect(() => {
    if (route?.params?.type == 'Dashboard') {
      reloadList();
    }
  }, [reloadList]);

  useFocusEffect(
    useCallback(() => {
      const parameter = screen === 'editPost' ? 'editPost' : 'focus';
      if (
        !userBuyListState?.isFetching &&
        !userSellListState?.isFetching &&
        (userBuyListState?.total != 0 || userSellListState?.total != 0)
      ) {
        loadBuyList(1, parameter);
        loadSellList(1, parameter);
      }
    }, [navigation, userBuyListState?.total, userSellListState?.total, screen]),
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    });
    navigation.setOptions({
      isSellTab: route?.params?.isSellTab,
    });
  }, [navigation]);

  const headerRight = () => (
    <TouchableOpacity onPress={() => onPressSetting(navigation)}>
      <Icon icon="settings" style={styles.settingIcon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}>
        <UserInfo navigation={navigation} />
        {showBoostModal && (
          <BoostScreen
            boost
            boostItem={boostItem}
            item={showBoostModal}
            navigation={navigation}
            visible={showBoostModal ? true : false}
            closeModal={() => {
              setShowBoostModal(false);
            }}
          />
        )}
        <UserActivity
          navigation={navigation}
          userId={userInfo.id}
          boost={boost}
          boostItem={boostItem}
          updatePostStatus={updatePostStatus}
          prevUpdatePostStatus={prevUpdatePostStatus}
          showSellSection={route?.params?.showSellSection}
          successCount={setCount}
          route={route}
        />
      </ScrollView>
      <SuccessModal
        isVisible={successModal.isVisible}
        onPress={handleSuccessModalDismiss}
      />
      <SweetAlert
        title={alertStatus.title}
        message={alertStatus.message}
        type={alertStatus.type}
        dialogVisible={alertStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;
