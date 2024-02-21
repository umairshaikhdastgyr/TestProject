import React, { useState } from 'react';

import { StyleSheet, View, Image, Dimensions, Animated } from 'react-native';
import Swiper from 'react-native-swiper';
import { Colors } from '#themes';


const { height, width } = Dimensions.get('window');

const ItemPictures = ({ postPics }) => {
  /* Selectors */

  /* States */
  const heightPicturesDefault = height / 2.25;
  const widthDefault = width;
  const [picturesDimension, setPicturesDimension] = useState({
    height: heightPicturesDefault,
    width: widthDefault,
  });
  const [opacityToReduce, setOpacityToReduce] = useState(0);

  /* Effects */

  return (
    <Animated.View style={{ ...styles.container, ...{ opacity: 1 } }}>
      <Swiper
        bounces={false}
        style={styles.swiper}
        dot={<View style={styles.dot} />}
        activeDot={<View style={{ ...styles.dot, ...styles.dotActive }} />}
        paginationStyle={styles.paginationStyle}
        loop={false}
      >
        {postPics.map(image => (
          <View key={image.id} style={picturesDimension}>
            <Image
              style={{ ...styles.image, ...picturesDimension }}
              source={{
                uri:
                  image.type === 'taken-photo'
                    ? `data:image/jpg;base64,${image.image}`
                    : image.image,
              }}
              resizeMode="cover"
            />
          </View>
        ))}
      </Swiper>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    width: width,
    height: height / 2.25,
  },
  swiper: {
    height: height / 2.25,
  },
  image: {
    width,
    height: height / 2.25,
    alignSelf: 'center',
  },
  paginationStyle: {
    bottom: 12,
  },
  dot: {
    backgroundColor: 'transparent',
    width: 5,
    height: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.inactiveShape,
    marginLeft: 4,
    marginRight: 4,
  },
  dotActive: {
    borderColor: Colors.active,
    backgroundColor: Colors.active,
  },
});

export default ItemPictures;
