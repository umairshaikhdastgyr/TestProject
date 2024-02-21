import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { Picture, BodyText, Label } from '#components';
import { Metrics } from '#themes';

const AlbumTile = ({
  data: {
    id, ideasCount, name, urlImage, Posts,
  },
  navigation,
}) => {
  const [ideasImages, setIdeasImages] = useState([]);

  useEffect(() => {
    const imgArray = [];
    if (Posts !== undefined) {
      for (let i = 0; i < Posts.length; i++) {
        if (
          Posts[i].Product.ProductImages
          && Posts[i].Product.ProductImages.length > 0
          && imgArray.length < 4
        ) {
          imgArray.push(Posts[i].Product.ProductImages[0].urlImage);
        }
      }
    }
    setIdeasImages(imgArray);
  }, [Posts]);

  const getCountIdeas = () => {
    if (Posts !== undefined && Posts.length > 0) {
      return Posts.length;
    }
    return 0;
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('AlbumDetail2', {
        ideasAlbumId: id,
        name,
        fromScreen: '',
      })}
      style={styles.ideaBoardImgsContainer}
      key="idea-content"
    >
      <View style={styles.ideaBoardImgsSubContainer}>
        {ideasImages.length > 0 ? (
          ideasImages.map((url) => (
            <Image
              key={url}
              source={{ uri: url }}
              style={[
                styles.albumPicture,
                { width: `${100 / ideasImages.length}%` },
              ]}
              resizeMode={ideasImages.length > 1 ? 'cover' : 'contain'}
            />
          ))
        ) : (
          <Image
            source={require('../../../assets/images/img_placeholder1.jpg')}
            style={styles.ideaImg}
          />
        )}
      </View>

      <View style={styles.ideaBoardInfoContainer}>
        <Text style={styles.blackText}>{name}</Text>
        <Text style={styles.activeText}>
          {`${ideasCount || 0}Ideas`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  albumTile: {
    width: Metrics.width - 40,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  albumPicture: {
    height: 130,
    borderColor: '#FFFFFF',
    borderRightWidth: 2,
    marginRight: 2,
  },
  bodyTile: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  bodyText: {
    marginBottom: 5,
  },
  imgContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  ideaBoardImgsSubContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  ideaImg: {
    width: Metrics.width - 40,
    height: 150,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default AlbumTile;
