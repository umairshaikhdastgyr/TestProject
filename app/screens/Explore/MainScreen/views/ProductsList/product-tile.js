import React, {useCallback, useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, ScrollView} from 'react-native';
import {Picture, Currency, Icon} from '#components';
import styles from './styles';
import fonts from '#themes/fonts';
import colors from '#themes/colors';
import axios from 'axios';

const ProductTile = React.memo(
  ({
    data,
    index,
    navigation,
    onPressLike,
    postLength,
    handleOnScroll,
    userInfo = {},
  }) => {
    const [updatedProductImages, setUpdatedProductImages] = useState([]);
    const {
      id,
      initialPrice,
      DeliveryMethods,
      Product,
      isFavorite,
      availableQuantity,
      PostStatus,
    } = data;
    let deliveryBoxActive = false;

    const handleLikeIcon = () => {
      onPressLike(id);
    };

    const makeApiCall = useCallback(element => {
      return axios
        .get(element?.urlImage, {responseType: 'arraybuffer'})
        .then(response => {
          return response?.request?._response;
        })
        .catch(error => {
          console.error(error, element);
          throw error;
        });
    }, []);

    const makeApiCallsOneByOne = useCallback(
      async (maxIndex, productImages = []) => {
        let i = 1;
        let base64ImageList = [];

        const makeNextApiCall = async () => {
          if (i <= maxIndex) {
            const element = productImages[i - 1];
            try {
              const base64Data = await makeApiCall(element);
              base64ImageList = [
                ...base64ImageList,
                {
                  ...element,
                  urlImage: `data:image/png;base64,${base64Data}`,
                },
              ];
              setUpdatedProductImages(base64ImageList);
              i++;
              makeNextApiCall();
            } catch (error) {
              i++;
              makeNextApiCall();
            }
          }
        };
        makeNextApiCall();
      },
      [makeApiCall, setUpdatedProductImages],
    );

    useEffect(() => {
      let productImages = Product?.ProductImages ?? [];

      makeApiCallsOneByOne(productImages.length, productImages);
    }, []);

    if (DeliveryMethods) {
      for (let i = 0; i < DeliveryMethods.length; i++) {
        if (
          DeliveryMethods[i].code === 'shipindependently' ||
          DeliveryMethods[i].code === 'homitagshipping'
        ) {
          deliveryBoxActive = true;
          break;
        }
      }
    }

    const handleProductDetail = () => {
      const finalProductImages = Product?.ProductImages?.map(obj => {
        const findObj = updatedProductImages?.find(el => el?.id == obj?.id);
        if (findObj) {
          return findObj;
        } else {
          return obj;
        }
      });
      navigation.push('ProductDetail', {
        postId: id,
        postData: {
          ...data,
          Product: {...data?.Product, ProductImages: finalProductImages},
        },
        updatedProductImages: finalProductImages,
        key: `PostDetail${id}`,
      });
    };

    return (
      <ScrollView onScroll={handleOnScroll} scrollEventThrottle={16}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowRadius: 4,
          shadowOpacity: 0.1,
          elevation: 3,
        }}
        onPress={handleProductDetail}>
        <View style={styles.tile}>
          <Picture
            source={
              Product?.ProductImages?.length > 0 &&
              `${Product?.ProductImages?.[0]?.urlImage ?? ''}`
            }
            type="product"
            screenType="explore"
            style={styles.tile__picture}
            postLength={postLength}
            index={index}
          />
          {userInfo?.id !== data?.userId ? (
            <TouchableOpacity
              style={[
                styles.tile__like,
                // {
                //   transform: [{scaleX: animatedScale}, {scaleY: animatedScale}],
                // },
              ]}
              onPress={() => handleLikeIcon()}>
              {isFavorite !== true ? (
                <Icon icon="like-white" />
              ) : (
                <Icon icon="like-white" color="active" />
              )}
              {/* {(isFavorite !== "0" && isFavorite !== 0 && isFavorite != undefined) && (
            <Icon icon="like-white" color="active" />
          )} */}
            </TouchableOpacity>
          ) : null}
          <View style={styles.tile__body}>
            {availableQuantity ||
            Product.customProperties.origin === 'suppliers' ? (
              <>
                {data?.userId != userInfo?.id &&
                (availableQuantity <= 0 ||
                  (data?.PostStatus?.name &&
                    data?.PostStatus?.name != 'Active' &&
                    data?.PostStatus?.name != 'Draft')) ? (
                  <View />
                ) : (
                  <View style={styles.tile__price}>
                    <Currency value={initialPrice} bold />
                  </View>
                )}
                <View style={styles.tile__icons}>
                  {Product?.customProperties?.origin === 'suppliers' && (
                    <Icon
                      icon="pin-validate"
                      color="purple"
                      style={styles.icons__left}
                    />
                  )}
                  {deliveryBoxActive && <Icon icon="shipping" color="purple" />}
                </View>
              </>
            ) : (
              <Text
                style={{
                  fontFamily: fonts.family.semiBold,
                  fontSize: 13,
                  color: colors.red,
                }}>
                {PostStatus?.name}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
      </ScrollView>
    );
  },
  (prevProps, nextProps) => {
    // Implement a custom comparison function if needed
    // Return true if the component should not re-render
    // Return false if the component should re-render
    if (prevProps.data?.isFavorite != nextProps.data?.isFavorite) {
      return false;
    } else if (prevProps.data?.id === nextProps.data?.id) {
      return true;
    }
  },
);

export default ProductTile;
