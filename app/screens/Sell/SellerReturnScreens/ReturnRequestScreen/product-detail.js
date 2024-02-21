import React from 'react';
import {
  View, Image, StyleSheet, Dimensions,
} from 'react-native';
import { Heading, BodyText } from '#components';
// import styles from './styles';
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  topContainer: {
    height: 120,
    width: (width - 30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    // marginBottom: 38,
  },
  imgsContainer: {
    paddingRight: 15,
  },
  imgContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    elevation:1
  },
  imgElement: {
    width: 60,
    height: 60,
  },
  textsContainer: {
    flexDirection: 'column',
    maxWidth: (width - 30 - 75),
  },
  titleText: {
    marginBottom: 5,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    fontSize: 13,
    color: '#696969',
  },
});

const ProductDetail = ({ postDetail, sellerName, priceAccepted }) => (
  <View style={styles.topContainer}>
    <View style={styles.imgsContainer}>
      <View style={styles.imgContainer}>
        <Image
          style={styles.imgElement}
          source={{ uri: postDetail?.urlImage }}
          resizeMode="cover"
        />
      </View>
    </View>
    <View style={styles.textsContainer}>
      <Heading
        type="h6"
        numberLines={1}
        style={{
          fontFamily: 'Montserrat-SemiBold',
          fontSize: 18,
          color: '#313334',
          marginBottom: 5,
        }}
      >
        {postDetail?.title}
      </Heading>
      <BodyText
        theme="medium"
        bold
        numberOfLines={1}
        style={styles.titleText}
      >
        {priceAccepted ?`$${priceAccepted}`: `${sellerName}`}
      </BodyText>
    </View>
  </View>
);

export default ProductDetail;
