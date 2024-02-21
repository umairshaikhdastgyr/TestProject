import React from 'react';
import { View, Text } from 'react-native';
import StarRating from 'react-native-star-rating';
import { numberWithCommas } from '#utils';
import { styles } from './styles';
import { Colors } from '#themes';
import Icons from '#assets/icons';

export const StarRatingView = ({ reviews, rating }) => {
  return (
    <View style={styles.reviewHeaderContainer}>
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
      <Text style={styles.graySmallText}>
        {`${numberWithCommas(reviews)} REVIEWS`}
      </Text>
    </View>
  );
};
