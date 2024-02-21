import React from 'react';
import { Image, View } from 'react-native';
import { BodyText, Heading } from '#components';
import styles from './styles';
import PropTypes from 'prop-types';

/** This component displays the product details */
const ProductDetails = ({
  productTitle,
  productThumbnail,
  productManufacturer,
  storeName,
}) => {
  return (
    <View style={styles.topContainer}>
      <View style={styles.imgContainerWrapper}>
        <View style={styles.imgContainer}>
          <Image
            style={styles.imgElement}
            source={{ uri: productThumbnail }}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Heading type="h6" numberLines={1}>
          {productTitle}
        </Heading>
        <BodyText
          theme="medium"
          numberOfLines={1}
          style={[styles.titleTextProduct]}
        >
          {storeName ? storeName : productManufacturer}
        </BodyText>
      </View>
    </View>
  );
};

ProductDetails.propTypes = {
  productTitle: PropTypes.string.isRequired,
  productThumbnail: PropTypes.any.isRequired,
  productManufacturer: PropTypes.string.isRequired,
};

export default ProductDetails;
