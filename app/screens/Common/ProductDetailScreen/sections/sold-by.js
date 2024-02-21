import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Heading, Icon, Label} from '#components';
import {flex, margins, paddings, borders} from '#styles/utilities';
import {parseDeliveryMethods} from '../../helper-functions';
import SupplierCard from './supplier-card';
import {Fonts} from '#themes';

const SoldBy = ({
  navigation,
  postDetail,
  postDetailScreen,
  setPostDetailScreen,
  quantity,
  setQuantity,
  isSupplier,
  availableQuantity,
  prModalVisibleAction,
  isFromDashboard,
  isBuy,
}) => {
  const [showMoreSellers, setShowMoreSellers] = useState(false);

  const delivery = parseDeliveryMethods({
    postDetail: postDetailScreen,
    latLng: null,
  })[0];

  useEffect(() => {
    setPostDetailScreen(postDetailScreen, postDetail);
  }, [postDetail]);

  const additionalSellers = postDetail.additionalPosts;

  if (!postDetailScreen) {
    return null;
  }

  return (
    <View>
      <View
        style={{
          ...paddings['p-3'],
          ...paddings['pb-5'],
          ...borders.bb,
        }}>
        {isFromDashboard && isBuy ? (
          <>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Heading type="bodyText" style={margins['mb-4']}>
                Delivery Method
              </Heading>
            </View>
            <View style={styles['mainInfoSection__item-tag']}>
              <Icon icon="shipping" style={styles['item-tag__icon']} />
              <View style={styles.mainInfoSection__tag}>
                <Label>{delivery?.label} - </Label>
                <Label bold type="active">
                  {delivery?.complementLabel}
                </Label>
              </View>
            </View>
            <View style={styles['mainInfoSection__item-tag']}>
              <Icon icon="clock" style={styles['item-tag__icon']} />
              <View style={styles.mainInfoSection__tag}>
                <Label>ESTIMATE DELIVERY - </Label>
                <Label bold type="active">
                  {delivery?.supplierEstimatedDeliveryLabel}
                </Label>
              </View>
            </View>
            <View style={styles['mainInfoSection__item-tag']}>
              <TouchableOpacity
                onPress={() => {
                  prModalVisibleAction(true);
                }}
                style={styles.mainInfoSection__tag}>
                <Label bold style={styles.returnPolicyText}>
                  Return Policy
                </Label>
              </TouchableOpacity>
            </View>
          </>
        ) : (availableQuantity <= 0 && isSupplier) ||
          postDetailScreen?.PostStatus?.name != 'Active' ||
          postDetailScreen.additionalPosts?.length == 0 ? (
          <></>
        ) : (
          <>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Heading type="bodyText" style={margins['mb-4']}>
                Delivery Method
              </Heading>
            </View>
            <View style={styles['mainInfoSection__item-tag']}>
              <Icon icon="shipping" style={styles['item-tag__icon']} />
              <View style={styles.mainInfoSection__tag}>
                <Label>{delivery?.label} - </Label>
                <Label bold type="active">
                  {delivery?.complementLabel}
                </Label>
              </View>
            </View>
            <View style={styles['mainInfoSection__item-tag']}>
              <Icon icon="clock" style={styles['item-tag__icon']} />
              <View style={styles.mainInfoSection__tag}>
                <Label>ESTIMATE DELIVERY - </Label>
                <Label bold type="active">
                  {delivery?.supplierEstimatedDeliveryLabel}
                </Label>
              </View>
            </View>
            <View style={styles['mainInfoSection__item-tag']}>
              <TouchableOpacity
                onPress={() => {
                  prModalVisibleAction(true);
                }}
                style={styles.mainInfoSection__tag}>
                <Label bold style={styles.returnPolicyText}>
                  Return Policy
                </Label>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {additionalSellers && additionalSellers.length ? (
        <View
          style={{
            ...paddings['p-3'],
            ...borders.bb,
          }}>
          <Heading type="bodyText" style={margins['mb-4']}>
            Sold By
          </Heading>

          {additionalSellers?.map((sellerDetail, index) => {
            return (
              <SupplierCard
                postDetail={sellerDetail}
                index={index}
                setPostDetailScreen={setPostDetailScreen}
                supplierId={postDetailScreen.id}
                postData={postDetailScreen}
                showMoreSellers={showMoreSellers}
                navigation={navigation}
                key={sellerDetail.id}
                quantity={quantity}
                setQuantity={setQuantity}
                isFromDashboard={isFromDashboard}
                isBuy={isBuy}
              />
            );
          })}

          {additionalSellers?.length > 1 ? (
            <TouchableOpacity
              onPress={() => setShowMoreSellers(!showMoreSellers)}>
              <Text style={styles.viewMoreSellerText}>
                {showMoreSellers
                  ? 'Show Less Sellers'
                  : `(${additionalSellers?.length - 1}) View More Sellers`}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainInfoSection__tag: {
    flexDirection: 'row',
  },
  'mainInfoSection__item-tag': {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  'item-tag__icon': {
    marginRight: 8,
    resizeMode: 'contain',
  },
  viewMoreSellerText: {
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.small,
    textDecorationLine: 'underline',
    color: '#969696',
    textAlignVertical: 'center',
  },
  returnPolicyText: {
    color: '#969696',
    textDecorationLine: 'underline',
  },
});

export default SoldBy;
