import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Platform,
  Modal,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useActions} from '#utils';

import {styles} from './styles';
import {
  getBoostPackages,
  getUserBoostPackage,
  boostPurchaseSuccess,
  boostPurchase,
} from '#services/apiUsers';
import {userSelector} from '#modules/User/selectors';
import colors from '#themes/colors';
import fonts from '#themes/fonts';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import Imgs from '#assets/images';
import {Button, SweetAlert} from '#components';
import PaymentMethodElement from '../../Buy/PaymentConfirmationScreen/payment-method-element';
import {selectOrderData} from '#modules/Orders/selectors';
import {setPaymentDefault} from '#modules/Orders/actions';
import {
  getPaymentCards,
  getUserBuyList,
  getUserSellList,
} from '#modules/User/actions';
import PaymentMethods from '#screens/Common/PaymentMethods';
import stripe from 'tipsi-stripe';
import {selectUserData} from '#modules/User/selectors';

export const BoostScreen = ({closeModal, visible, item, navigation, boost}) => {
  const dispatch = useDispatch();
  const [selectedBoost, setSelectedBoost] = useState(null);
  const [boostPackages, setboostPackages] = useState([]);
  const [paymentModalVisible, showPaymentModal] = useState(false);

  const [isBoosted, showBoosted] = useState(false);
  const [buttonLoading, showButtonLoading] = useState(false);
  const [defaultCard, setDefaultCard] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(true);

  const {
    information: userInfo,
    userProductDetail,
    paymentMethodDefault,
  } = useSelector(selectUserData());

  const {paymentDefault} = useSelector(selectOrderData());
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  /* Actions */
  const actions = useActions({
    setPaymentDefault,
    getPaymentCards,
  });

  const goToPaymentScreen = () => {
    // navigation.navigate("PaymentScreen", {
    //   screen: "boostScreen",
    // });
  };
  const {
    user: {userBuyListState, userSellListState, information, paymentCardList},
  } = useSelector(userSelector);

  useEffect(() => {
    getBoostPackages().then(resp => {
      setboostPackages(resp.data);
    });

    getUserBoostPackage(information.id).then(response => {
      console.log(response);
    });

    actions.getPaymentCards({userId: information?.id, type: 'card'});
  }, []);
  useEffect(() => {
    setSelectedPaymentMethod(
      paymentDefault?.default ? paymentDefault : paymentMethodDefault,
    );
  }, [paymentMethodDefault]);

  const loadBuyList = useCallback(
    page => {
      const buyParams = {
        type: 'buy',
        userId: userInfo.id,
        page: 1,
      };
      dispatch(getUserBuyList(buyParams, page));
    },
    [dispatch, userInfo.id],
  );

  const loadSellList = useCallback(
    page => {
      const sellParams = {
        type: 'sell',
        userId: userInfo.id,
        page: 1,
        isDashBoard: true,
      };
      dispatch(getUserSellList(sellParams, page));
    },
    [dispatch, userInfo.id],
  );

  useEffect(() => {
    return () => {
      console.log('load dashboard item');
      loadBuyList();
      loadSellList();
    };
  }, []);

  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        style={styles.boostModal}
        onRequestClose={() => {
          showButtonLoading(false);
        }}>
        <SafeAreaView style={styles.container}>
          <View style={{flex: 1, backgroundColor: colors.white}}>
            <View
              style={{
                elevation: 3,
                backgroundColor: '#ffffff',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 15,
                flexDirection: 'row',
              }}>
              <Text style={{marginRight: 30}}></Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: fonts.family.semiBold,
                  fontSize: 16,
                }}>
                Boost item
              </Text>
              <Ionicons
                onPress={() => {
                  closeModal();
                }}
                name="close"
                size={25}
                color="#969696"
              />
            </View>
            <View>
              <View style={{alignItems: 'center', marginTop: 30}}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      elevation: 1,
                      width: 60,
                      height: 60,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    {item?.Product?.ProductImages.length > 0 ? (
                      <Image
                        source={{
                          uri: item?.Product?.ProductImages?.[0].urlImage,
                        }}
                        style={{width: 60, height: 60}}
                        resizeMode="cover"
                      />
                    ) : null}
                  </View>
                  <View style={{marginLeft: 18}}>
                    <Text
                      style={{
                        fontFamily: fonts.family.semiBold,
                        color: colors.black,
                        fontSize: 18,
                        marginTop: 5,
                      }}>
                      {item?.Product?.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.family.semiBold,
                        color: colors.green,
                        fontSize: 20,
                        marginTop: 2.5,
                      }}>
                      {`$${item?.initialPrice}`}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{paddingHorizontal: 15, marginTop: 50}}>
                <Text
                  style={{
                    color: colors.black,
                    fontFamily: fonts.family.semiBold,
                    fontSize: 16,
                  }}>
                  Choose a boost package
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}>
                  {boostPackages?.map((item, index) => {
                    if (index > 2) {
                      return null;
                    }
                    return (
                      <TouchableOpacity
                        key={index + 'boost'}
                        onPress={() => {
                          setSelectedBoost(index);
                        }}
                        style={{
                          borderRadius: 7.5,
                          overflow: 'hidden',
                          width: '32%',
                          borderWidth: 1,
                          borderColor:
                            selectedBoost == index
                              ? colors.green
                              : colors.darkGrey2,
                        }}>
                        <View
                          style={{
                            backgroundColor:
                              selectedBoost == index
                                ? colors.green
                                : colors.darkGrey2,
                            paddingVertical: 10,
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: fonts.family.semiBold,
                              color: colors.white,
                              fontSize: 16,
                            }}
                            numberOfLines={1}>
                            {`${item.Name}`}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignItems: 'center',
                            paddingTop: 20,
                            paddingBottom: 15,
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <Image
                              tintColor={
                                selectedBoost == index
                                  ? colors.green
                                  : colors.darkGrey2
                              }
                              source={Imgs.boost}
                              style={{width: 30, height: 30}}
                              resizeMode="contain"
                            />
                            {index ? (
                              <Image
                                tintColor={
                                  selectedBoost == index
                                    ? colors.green
                                    : colors.darkGrey2
                                }
                                source={Imgs.boost}
                                style={{
                                  width: 27.5,
                                  height: 27.5,
                                  bottom: 7.5,
                                }}
                                resizeMode="contain"
                              />
                            ) : null}
                            {index > 1 ? (
                              <Image
                                tintColor={
                                  selectedBoost == index
                                    ? colors.green
                                    : colors.darkGrey2
                                }
                                source={Imgs.boost}
                                style={{width: 30, height: 30}}
                                resizeMode="contain"
                              />
                            ) : null}
                          </View>

                          <Text
                            style={{
                              fontFamily: fonts.family.semiBold,
                              color:
                                selectedBoost == index
                                  ? colors.green
                                  : colors.darkGrey2,
                              fontSize: 16,
                              marginTop: 15,
                            }}
                            numberOfLines={1}>
                            {`${item.PricePerBoost}/each`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text
                  style={{
                    fontFamily: fonts.family.regular,
                    color: colors.gray,
                    fontSize: 16,
                    textAlign: 'center',
                    marginTop: 30,
                  }}>
                  {`Boosting your item will increase your chances of selling by 30%`}
                </Text>

                {selectedPaymentMethod && (
                  <PaymentMethodElement
                    icon={
                      paymentMethodDefault.icon
                        ? paymentMethodDefault.icon == 'credit-card'
                          ? paymentMethodDefault?.selectedCard?.brand.toLowerCase()
                          : paymentMethodDefault.icon
                        : paymentDefault.icon
                    }
                    title={
                      paymentMethodDefault.title
                        ? paymentMethodDefault.title
                        : paymentDefault.title
                    }
                    leftLabel="Pay using"
                    onPress={() => {
                      showPaymentModal(true);
                      setDefaultCard(false);
                      showButtonLoading(false);
                    }}
                    type={'done'}
                  />
                )}
                <View
                  style={{
                    marginTop: 10,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.family.semiBold,
                      color: colors.black,
                    }}>
                    Total Pay
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.family.semiBold,
                      color: colors.black,
                    }}>
                    {selectedBoost != null
                      ? `$${
                          parseFloat(
                            boostPackages[selectedBoost]?.PricePerBoost,
                          ) * boostPackages[selectedBoost]?.Quantity
                        }`
                      : '-'}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{flex: 1, justifyContent: 'flex-end', marginBottom: 30}}>
              <Button
                label={'Boost Item'}
                disabled={selectedBoost == null}
                size="large"
                showLoading={buttonLoading}
                onPress={async () => {
                  if (selectedBoost != null && selectedPaymentMethod && item) {
                    showButtonLoading(true);
                    const postIds = [item?.id];
                    const userId = information?.id;
                    const selectedBoostPackage = boostPackages[selectedBoost];
                    let dataToSend = {
                      boostPackageId: selectedBoostPackage.BoostPackageId,
                      postIds: postIds,
                      userId: userId,
                    };
                    if (selectedPaymentMethod?.selectedCard?.id) {
                      dataToSend.paymentSource =
                        selectedPaymentMethod?.selectedCard?.id;
                    } else {
                      const total_price =
                        parseFloat(
                          boostPackages[selectedBoost]?.PricePerBoost,
                        ) * boostPackages[selectedBoost]?.Quantity;
                      const options = {
                        total_price: total_price.toString(),
                        currency_code: 'USD',
                        shipping_address_required: false,
                        billing_address_required: false,
                        line_items: [
                          {
                            currency_code: 'USD',
                            description: 'Boost Post',
                            total_price: total_price.toString(),
                            unit_price: parseFloat(
                              boostPackages[selectedBoost]?.PricePerBoost,
                            ).toString(),
                            quantity:
                              boostPackages[selectedBoost]?.Quantity.toString(),
                          },
                        ],
                      };
                      const items = [
                        {label: 'Boost Post', amount: total_price.toString()},
                      ];
                      let nativePayToken = '';
                      try {
                        showButtonLoading(false);
                        if (Platform.OS == 'android') {
                          nativePayToken =
                            await stripe.paymentRequestWithNativePay(options);
                        } else {
                          try {
                            nativePayToken =
                              await stripe.paymentRequestWithNativePay(
                                options,
                                items,
                              );
                            stripe.completeNativePayRequest();
                          } catch (error) {
                            if (error.code == 'cancelled') {
                              Alert.alert(`${error.message}`);
                              showButtonLoading(false);
                              return;
                            } else {
                              Alert.alert(`${error.message}`);
                              showButtonLoading(false);
                              return;
                            }
                          }
                        }
                        dataToSend.paymentSource = nativePayToken?.card?.cardId;
                      } catch (e) {
                        showButtonLoading(false);
                        return;
                      }
                    }
                    showButtonLoading(true);
                    boostPurchase({params: dataToSend})
                      .then(resp => {
                        if (resp.status == 500) {
                          Alert.alert(
                            'Oops!',
                            resp.error || 'Internal Server error',
                          );
                          return;
                        }
                        const dataToSend = {
                          postIds: postIds,
                          userId: userId,
                        };
                        boostPurchaseSuccess({params: dataToSend})
                          .then(resp => {
                            showBoosted(true);
                            showButtonLoading(false);
                          })
                          .catch(e => {
                            showButtonLoading(false);
                            Alert.alert('Oops!', 'Something went wrong!');
                          });
                      })
                      .catch(() => {
                        showButtonLoading(false);
                        Alert.alert('Oops!', 'Something went wrong!');
                      });
                  }
                }}
                style={{marginHorizontal: 10}}
              />
            </View>
          </View>
        </SafeAreaView>

        <PaymentMethods
          onPaymentSelect={item => {
            if (selectedPaymentMethod == null) {
              setSelectedPaymentMethod(
                paymentDefault?.default ? paymentDefault : paymentMethodDefault,
              );
              actions.setPaymentDefault(
                paymentDefault?.default ? paymentDefault : paymentMethodDefault,
              );
            } else if (item.title == '') {
              setSelectedPaymentMethod(
                paymentDefault?.default ? paymentDefault : paymentMethodDefault,
              );
              actions.setPaymentDefault(
                paymentDefault?.default ? paymentDefault : paymentMethodDefault,
              );
            } else {
              actions.setPaymentDefault(item);
              setSelectedPaymentMethod(item);
            }
          }}
          navigation={navigation}
          boost={boost}
          visible={paymentModalVisible}
          // visible={true}
          closeBoostScreen={() => closeModal()}
          closeModal={() => {
            showPaymentModal(false);
          }}
          boostItem={item}
        />
        {isBoosted && boostPackages ? (
          <SweetAlert
            title={`You successfully purchased ${
              boostPackages?.[selectedBoost]?.Quantity
            } ${
              boostPackages?.[selectedBoost]?.Quantity > 1 ? 'Boosts' : 'Boost'
            } for ${item?.Product?.title}`}
            message={``}
            type="success"
            dialogVisible={isBoosted}
            messageStyle={{marginBottom: 0}}
            onTouchOutside={() => {
              showBoosted(false);
              closeModal();
            }}
            onDone={() => {
              showBoosted(false);
              closeModal();
            }}
            boostUnits={boostPackages?.[selectedBoost]?.Quantity}
            boostPrice={
              parseFloat(boostPackages?.[selectedBoost]?.PricePerBoost) *
              boostPackages?.[selectedBoost]?.Quantity
            }
            iconWidth={120}
          />
        ) : null}
      </Modal>

      {/* <PaymentMethods
        onPaymentSelect={(item) => {
          if (selectedPaymentMethod == null) {
            setSelectedPaymentMethod(paymentDefault?.default
              ? paymentDefault
              : paymentMethodDefault);
          } else if (selectedPaymentMethod.title == "") {
            setSelectedPaymentMethod(paymentDefault?.default
              ? paymentDefault
              : paymentMethodDefault);
          } else {
            setSelectedPaymentMethod(item);
          }
        }}
        navigation={navigation}
        boost={boost}
        visible={paymentModalVisible}
        closeBoostScreen={() => {
          setIsVisibleModal(true);
          closeModal();
        }}
        closeModal={() => {
          setIsVisibleModal(true);
          showPaymentModal(false);
        }}
      />
      {isBoosted && boostPackages ? <SweetAlert
        title={`You successfully purchased ${boostPackages?.[selectedBoost]?.Quantity
          } ${boostPackages?.[selectedBoost]?.Quantity > 1 ? 'Boosts' : 'Boost'
          } for ${item?.Product?.title}`}
        message={``}
        type="success"
        dialogVisible={isBoosted}
        messageStyle={{ marginBottom: 0 }}
        onTouchOutside={() => {
          showBoosted(false);
          closeModal();
        }}
        onDone={() => {
          showBoosted(false);
          closeModal();
        }}
        boostUnits={boostPackages?.[selectedBoost]?.Quantity}
        boostPrice={parseFloat(
          boostPackages?.[selectedBoost]?.PricePerBoost
        ) * boostPackages?.[selectedBoost]?.Quantity}
        iconWidth={120}
      /> : null} */}
    </>
  );
};
