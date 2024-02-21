import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import StarRating from "react-native-star-rating";
import { capitalize } from "#utils";
import Icons from "#assets/icons";
import { Icon } from "#components";
import _ from "lodash";
import { getUserReview } from "#services/apiUsers";
import { Colors } from "#themes";
import { styles } from "./styles";
import SmallLoader from "#components/Loader/SmallLoader";
export const ReviewContent = ({
  navigation,
  userId,
  data,
  loading,
  reviewCount,
  rating,
  firstName,
  lastName
}) => {
  const onReview = () => {
    navigation.navigate("Review", {
      id: userId,
      reviews: reviewCount,
      rating,
      name: `${firstName} Review's`
    });
  };
  return (
    <View style={styles.reviewContentContainer}>
      <Text style={styles.titleText}>Reviews</Text>
      {loading ? (
        <>
          <SmallLoader />
          <View style={styles.reviewItemContainer}>
            <Text style={styles.grayText}>No data exist</Text>
          </View>
        </>
      ) : (
        data.slice(0, 2).map((item, index) => (
          <View
            style={styles.reviewItemContainer}
            key={`review-content-${index}`}
          >
            <View style={styles.space} />
            <Text style={styles.blackBoldText}>
              {capitalize(_.get(item, "reviewData.experience", "Undefined"))}
            </Text>
            <View style={styles.separator} />
            <StarRating
              iconSet={"Ionicons"}
              maxStars={5}
              rating={_.get(item, "reviewData.rating", 0)}
              fullStarColor={Colors.active}
              disabled
              starSize={20}
              fullStar={Icons.star_active}
              emptyStar={Icons.star_grey}
              halfStar={Icons["half-star"]}
            />
            <View style={styles.separator} />
            <Text style={styles.grayText}>
              {_.get(item, "reviewData.comment", 0)}
            </Text>
            <View style={styles.space} />
          </View>
        ))
      )}

      {data.length > 0 ? (
        <TouchableOpacity style={styles.linkContainer} onPress={onReview}>
          <Text
            style={styles.linkText}
          >{`See all reviews (${reviewCount})`}</Text>
          <Icon icon="icon_active_next" style={styles.nextIcon} />
        </TouchableOpacity>
      ) : (
        <View style={styles.reviewItemContainer}>
          <Text style={styles.grayText}>{firstName} {lastName} has no reviews.</Text>
        </View>
      )}
    </View>
  );
};
