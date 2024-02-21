import React, {useCallback, useEffect, useState} from 'react';
import {View, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {Picture, Currency, Icon} from '#components';
import styles from './styles';
import Label from '#components/Label';
import axios from 'axios';

const ProductTile = React.memo(
  ({
    onPress,
    onPressMoreIcon,
    data: {
      initialPrice,
      DeliveryMethods,
      Product,
      isFavorite,
      customProperties,
      name,
    },
    moreIcon,
    likedAll,
    onPressLike = () => {},
    favoriteIcon,
    deleteOption,
    onPressDelete,
    type,
  }) => {
    const [updatedProductImages, setUpdatedProductImages] = useState([]);
    const isSupplier = customProperties?.origin === 'suppliers';
    let deliveryBoxActive = false;

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

    const makeApiCallsOneByOne = useCallback((maxIndex, productImages = []) => {
      let i = 1;
      let base64ImageList = [];

      const makeNextApiCall = () => {
        if (i <= maxIndex) {
          const element = productImages[i - 1];
          makeApiCall(element)
            .then(base64Data => {
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
            })
            .catch(error => {
              console.error(error, element);
              i++;
              makeNextApiCall();
            });
        }
      };
      makeNextApiCall();
    }, []);

    useEffect(() => {
      let productImages = Product?.ProductImages ?? [];

      makeApiCallsOneByOne(productImages.length, productImages);
    }, []);

    if (DeliveryMethods && DeliveryMethods.length) {
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

    return (
      <TouchableWithoutFeedback onPress={() => onPress(updatedProductImages)}>
        <View style={[styles.tile, deleteOption === true && styles.tileWithX]}>
          <Picture
            source={
              Product?.ProductImages[0] && Product?.ProductImages[0].urlImage
            }
            type="product"
            screenType={'explore'}
            style={styles.tile__picture}
          />
          {type != 'draft' && (
            <TouchableOpacity onPress={onPressLike} style={[styles.tile__like]}>
              {isFavorite && <Icon icon="like-white" color="active" />}
              {!isFavorite && <Icon icon="like-white" />}
            </TouchableOpacity>
          )}
          {moreIcon && (
            <TouchableOpacity
              onPress={onPressMoreIcon}
              style={styles.tile__rightIcon}>
              <Icon icon="more-white" />
            </TouchableOpacity>
          )}
          <View style={styles.tile__body}>
            {name && <Label style={styles.name}>{name}</Label>}
            {initialPrice && (
              <View style={styles.tile__price}>
                <Currency value={initialPrice} bold />
              </View>
            )}
            <View style={styles.tile__icons}>
              {isSupplier && (
                <Icon
                  icon="pin-validate"
                  color="purple"
                  style={styles.icons__left}
                />
              )}
              {deliveryBoxActive && <Icon icon="shipping" color="purple" />}
            </View>
          </View>
          {deleteOption && deleteOption === true && (
            <TouchableOpacity
              style={styles.close_Bt}
              activeOpacity={0.7}
              onPress={onPressDelete}>
              <View style={styles.close_icon}>
                <Icon
                  icon="close"
                  size="x-small"
                  style={{tintColor: '#FF5556'}}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
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
