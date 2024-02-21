import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon, StarsRate} from '#components';
import {flex, paddings, margins} from '#styles/utilities';
import {Fonts} from '#themes';
import {parseDeliveryMethods} from '../../helper-functions';
import {getSupplierDataApi} from '#services/apiCatalog';
import colors from '#themes/colors';

const renderSellerItem = (
  delivery,
  handleChooseSupplier,
  postDetail,
  supplierId,
  postData,
  navigation,
  isFromDashboard,
  isBuy,
) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('SupplierProfile', {
          userId: postDetail?.userId,
          postData,
          isFromDashboard,
          isBuy,
          sellerStatus: postData?.sellerStatus,
        })
      }
      style={styles.supplierCardContainer}>
      <View
        style={[
          flex.directionRow,
          flex.justifyContentSpace,
          flex.alignItemsCenter,
          margins['mb-1'],
          {width: '100%'},
        ]}>
        <View style={{width: '80%', alignContent: 'flex-start'}}>
          <View style={{maxWidth: '100%'}}>
            <Text numberOfLines={2} style={styles.supplierName}>
              {`${postDetail?.storeInfo?.name ?? ''}`}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '20%',
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity onPress={handleChooseSupplier}>
            {postDetail.id === supplierId && (
              <Icon icon="check-circle" size="medium" />
            )}
            {postDetail.id !== supplierId && (
              <Icon icon="empty-circle" size="medium" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          flex.directionRow,
          flex.justifyContentSpace,
          flex.alignItemsCenter,
          margins['mb-2'],
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <StarsRate value={postDetail?.storeInfo?.rating} />
          {postDetail?.storeInfo?.reviews > 0 && (
            <Text
              style={{
                marginLeft: 5,
              }}>{`(${postDetail?.storeInfo?.reviews})`}</Text>
          )}
        </View>
        {isFromDashboard && isBuy ? (
          <Text style={styles.price}>{`$ ${postDetail?.initialPrice}`}</Text>
        ) : postDetail?.availableQuantity > 0 ? (
          <Text style={styles.price}>{`$ ${postDetail?.initialPrice}`}</Text>
        ) : (
          <Text style={styles.price}>Unavailable</Text>
        )}
      </View>
      <View
        style={[
          flex.directionRow,
          flex.justifyContentSpace,
          flex.alignItemsCenter,
        ]}>
        <Text style={styles.estimateDelivery}>
          {`ESTIMATE DELIVERY - ${delivery?.supplierEstimatedDeliveryLabel}`}
        </Text>
        <Text style={styles.freeShipping}>
          {delivery?.supplierShippingLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const SupplierCard = ({
  postDetail,
  setPostDetailScreen,
  supplierId,
  postData,
  showMoreSellers,
  index,
  navigation,
  quantity,
  setQuantity,
  isFromDashboard,
  isBuy,
}) => {
  // const [supplier, setSupplier] = useState({
  //   isLoading: false,
  //   data: null,
  //   error: null,
  // });

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     setSupplier((prevState) => ({ ...prevState, isLoading: true }));
  //     const supplierInfoData = await getSupplierDataApi({
  //       userId: postDetail.userId,
  //     });

  //     if (supplierInfoData?.result?.success === false) {
  //       setSupplier((prevState) => ({
  //         ...prevState,
  //         data: null,
  //         error: supplierInfoData.result,
  //         isLoading: false,
  //       }));
  //     } else {
  //       setSupplier((prevState) => ({
  //         ...prevState,
  //         error: null,
  //         data: supplierInfoData,
  //       }));
  //     }
  //   };

  //   fetchUserInfo();
  // }, [postDetail.userId]);

  const delivery = parseDeliveryMethods({postDetail, latLng: null})[0];

  const handleChooseSupplier = () => {
    setPostDetailScreen(prevState => ({...prevState, ...postDetail}));

    if (quantity > postDetail.availableQuantity) {
      setQuantity(postDetail.availableQuantity.toString());
    }
  };
  // if (postDetail.id !== supplierId && !showMoreSellers) {
  //   return null;
  // }
  return (
    <>
      {!showMoreSellers && index == 0
        ? renderSellerItem(
            delivery,
            handleChooseSupplier,
            // supplier,
            postDetail,
            supplierId,
            postData,
            navigation,
            isFromDashboard,
            isBuy,
          )
        : showMoreSellers
        ? renderSellerItem(
            delivery,
            handleChooseSupplier,
            // supplier,
            postDetail,
            supplierId,
            postData,
            navigation,
            isFromDashboard,
            isBuy,
          )
        : null}
    </>
  );
};

const styles = StyleSheet.create({
  supplierCardContainer: {
    borderWidth: 1,
    borderColor: '#969696',
    borderRadius: 8,
    ...paddings['p-3'],
    ...margins['mb-3'],
  },
  supplierName: {
    fontFamily: Fonts.family.semiBold,
    textTransform: 'capitalize',
    fontSize: Fonts.size.large,
    color: '#616161',
  },
  estimateDelivery: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.small,
    color: '#616161',
  },
  freeShipping: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.small,
    color: '#969696',
  },
  price: {
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.regular,
    color: colors.active,
  },
});

export default SupplierCard;
