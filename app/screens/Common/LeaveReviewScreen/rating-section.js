import React from 'react';
import { View, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating';
import { Label } from '#components';
import { Colors } from '#themes';

const RatingSection = ({ rating, setRating, sellerName }) => (
  <View style={styles.container}>
    <Label size="medium" style={styles.label}>
      We’re happy you received your item successfully. Please feel free to
      review your experience below.
    </Label>
    <Label bold size="medium" style={styles.title}>
      Overall experience with {sellerName}
    </Label>
    <StarRating
      starSize={30}
      emptyStar="star"
      emptyStarColor={Colors.grey}
      rating={rating}
      fullStarColor={'#00BDAA'}
      selectedStar={v => setRating(v)}
      containerStyle={styles.ratingContainer}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  label: {
    textAlign: 'center',
  },
  title: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 48,
  },
  ratingContainer: {
    marginTop: 25,
    marginHorizontal: 45,
  },
});
export default RatingSection;
