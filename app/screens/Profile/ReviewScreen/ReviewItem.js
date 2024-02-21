import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';
import * as Progress from 'react-native-progress';
import _ from 'lodash';
import moment from 'moment';
import { CachedImage, Label } from '#components';
import { Colors } from '#themes';
import Icons from '#assets/icons';
import { getAddress, capitalize } from '#utils';
import { styles } from './styles';

export const ReviewItem = ({ item, index }, navigation, location, reviewUser) => {
  const title = _.get(item, 'reviewData.experience', 'Undefined');
  const comment = _.get(item, 'reviewData.comment', 'Undefined');
  //const address = getAddress(_.get(item, 'location', {}));
  const address = location && getAddress(location);
  const rating = parseFloat(_.get(item, 'reviewData.rating', 0));
  const date = new Date(_.get(item, 'updatedAt', null));
  const firstName = _.get(item, 'firstName', 'Undefined');
  const lastName = _.get(item, 'lastName', 'Undefined');
  const photoURI = _.get(item, 'profilepictureurl', null);

  const onPress = () => {
    navigation.navigate('ReviewDetail', { data: item, location: address, reviewUserId: reviewUser });
  };

  return (
    <TouchableOpacity style={styles.reviewItemContainer} onPress={onPress}>
      <View style={styles.space} />
      <Label bold size="large">
        {capitalize(title)}
      </Label>
      <View style={styles.separator} />
      <StarRating
        iconSet={'Ionicons'}
        maxStars={5}
        rating={rating}
        fullStarColor={Colors.active}
        disabled
        starSize={20}
        fullStar={Icons.star_active}
        emptyStar={Icons.star_grey}
        halfStar={Icons['half-star']}
      />
      <View style={styles.separator} />
      <Text style={styles.grayText}>{comment}</Text>
      <View style={styles.separator} />
      <Text style={styles.grayText}>{moment(date).format('DD-MM-YYYY')}</Text>
      <View style={styles.space} />
      <View style={styles.reviewerContainer}>
        <View style={styles.reviewerImgContainer}>
          {photoURI ? (
            <CachedImage
              source={{ uri: photoURI }}
              style={styles.reviewerImg}
              indicator={Progress.Pie}
              indicatorProps={{
                size: 30,
                borderWidth: 0,
                color: Colors.primary,
                unfilledColor: Colors.white,
              }}
            />
          ) : (
            <CachedImage
                 source={require('../../../assets/images/img_placeholder.jpg')}
               style={styles.reviewerImg}
              indicator={Progress.Pie}
              indicatorProps={{
                size: 30,
                borderWidth: 0,
                color: Colors.primary,
                unfilledColor: Colors.white,
              }}
              />
          )}
        </View>
        <View style={styles.reviewerSubContainer}>
          <Text style={styles.blackMediumText}>
            {`${firstName} ${lastName}`}
          </Text>
          <Text style={styles.grayText1}>{address}</Text>
        </View>
      </View>
      <View style={styles.space} />
    </TouchableOpacity>
  );
};
