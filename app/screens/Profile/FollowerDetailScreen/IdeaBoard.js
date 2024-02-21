import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import * as Progress from 'react-native-progress';
import _ from 'lodash';
import { Icon, CachedImage } from '#components';
import { getAlbumsIdeas } from '#services/apiIdeas';

import { Colors } from '#themes';
import { styles } from './styles';
import SmallLoader from '#components/Loader/SmallLoader';

export const IdeaBoard = ({
  navigation, userId, data, loading, firstName, lastName
}) => {
  onIdeaMore = () => {
    navigation.navigate('IdeasMain2', {
      fromScreen: 'follower',
      followerId: userId,
      name: `${firstName}'s Idea Board`,
    });
  };
  const [ideasImages, setIdeasImages] = useState([]);
  useEffect(() => {
    const imgArray = [];
    if (data.Posts !== undefined) {
      for (let i = 0; i < data.Posts.length; i++) {
        if (
          data.Posts[i].Product.ProductImages
          && data.Posts[i].Product.ProductImages.length > 0
          && imgArray.length < 4
        ) {
          imgArray.push(data.Posts[i].Product.ProductImages[0].urlImage);
        }
      }
    }
    setIdeasImages(imgArray);
  }, [data.Posts]);

  useEffect(() => {
    // console.log("ideasImages", ideasImages);
  }, [ideasImages]);
  return (
    <View style={styles.reviewContentContainer}>
      <Text style={styles.titleText}>Idea Board</Text>
      {loading ? (
        <>
          <SmallLoader />
        </>
      ) : (
        data.slice(0, 1).map((item, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('AlbumDetail2', {
              ideasAlbumId: item.id,
              name: item.name,
              fromScreen: '',
            })}
            style={styles.ideaBoardImgsContainer}
            key={`idea-content-${index}`}
          >
            {item.urlImage || item.firstImage ? (
              <View style={styles.ideaBoardImgsSubContainer}>
                <CachedImage
                  source={{ uri: item.urlImage || item.firstImage }}
                  style={styles.ideaImg}
                  indicator={Progress.Pie}
                  indicatorProps={{
                    size: 30,
                    borderWidth: 0,
                    color: Colors.primary,
                    unfilledColor: Colors.white,
                  }}
                />
              </View>
            ) : (
              <View style={styles.ideaBoardImgsSubContainer}>
                <Image
                  source={require('../../../assets/images/img_placeholder1.jpg')}
                  style={styles.ideaImg}
                />
              </View>
            )}
            <View style={styles.ideaBoardInfoContainer}>
              <Text style={styles.blackText}>
                {_.get(item, 'name', 'Undefined')}
              </Text>
              <Text style={styles.activeText}>
                {`${_.get(item, 'ideasCount', '0')} Ideas`}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
      {data.length > 0 ? (
        <TouchableOpacity style={styles.linkContainer} onPress={onIdeaMore}>
          <Text style={styles.linkText}>See all ideas</Text>
          <Icon icon="icon_active_next" style={styles.nextIcon} />
        </TouchableOpacity>
      ) : (
        <View style={styles.reviewItemContainer}>
          <Text style={styles.grayText}>{firstName} {lastName} has no idea boards.</Text>
        </View>
      )}
    </View>
  );
};
