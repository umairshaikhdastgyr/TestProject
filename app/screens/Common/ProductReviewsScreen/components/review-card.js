import React, { useState } from 'react';

import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { StarsRate } from '#components';
import { Fonts } from '#themes';
import { paddings, flex, margins } from '#styles/utilities';
import images from '#assets/images';

const ReviewCard = ({ review }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <View style={styles.cardContainer}>
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ flex: 5 }}>
          <View style={[flex.directionRow, flex.alignItemsCenter]}>
            {review?.user?.profilepictureurl == null ? (
              <Image
                defaultSource={images.userPlaceholder}
                source={require('../../../../assets/images/img_placeholder.jpg')}
                style={[margins['mr-2'], styles.reviewerPhoto]}
              />
            ) : (
              <Image
                defaultSource={images.userPlaceholder}
                source={{ uri: review?.user?.profilepictureurl }}
                style={[margins['mr-2'], styles.reviewerPhoto]}
              />
            )}
            <View>
              <Text style={styles.reviewerName}>
                {`${review?.user?.firstName} ${review?.user?.lastName}`}
              </Text>
              <Text style={styles.reviewerCountry}>{review?.user?.location?.formatted_address}</Text>
            </View>
          </View>
        </View>
        <View style={{ width: 110, alignItems: 'flex-end', paddingBottom: 5 }}>
          <StarsRate
            value={review?.reviewData?.rating}
          />
          {/* <Text>{review?.reviewData?.review}</Text> */}
        </View>
      </View>


      <View
        style={[
          flex.directionRow,
          flex.justifyContentSpace,
          flex.alignItemsCenter,
          margins['mb-3', 'mt-3'],
          { width: '100%' },
        ]}
      >
        <Text style={styles.verifiedPurchase}>Verified Purchase</Text>
        <Text style={[styles.textContent]}>
          {moment(review?.updatedAt).format('DD-MM-YYYY')}
        </Text>
      </View>
      {review?.reviewData?.size ? (
        <View style={{ width: '100%', }}>
          <Text
            style={[styles.textContentSize, margins['mb-2', 'mt-2']]}>
            Size: {review?.reviewData?.size}
          </Text>
        </View>
      ) : null}
      <View style={{ width: '100%', marginTop: 8 }}>
        {/* <Text style={[styles.cardTitle, margins['mb-2']]}>
        {review?.reviewData?.title}
      </Text> */}
        <Text
          style={[styles.textContent, margins['mb-3']]}
          numberOfLines={showMore ? undefined : 12}
        >
          {review?.reviewData?.comment}
        </Text>
      </View>
      {review?.reviewData?.comment?.length > 500 ? (
        <View
          style={[
            { width: '100%', marginTop: -10 },
            flex.directionRow,
            margins['mb-3'],
          ]}
        >
          <TouchableOpacity onPress={() => setShowMore(!showMore)}>
            <Text style={styles.showMoreText}>
              {showMore ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}


    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: 'rgba(185, 185, 185, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    backgroundColor: 'white',
    borderRadius: 8,

    alignItems: 'center',
    ...paddings['p-3'],
    margin: 1, // flatlist shadow offset
    ...margins['mb-3'],
  },
  cardTitle: {
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.large,
    textAlign: 'left',
    textTransform: 'capitalize'
  },
  textContent: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.medium,
    lineHeight: Fonts.size.regular,
  },
  textContentSize: {
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.large,
    lineHeight: Fonts.size.regular,
    textTransform: 'capitalize'
  },
  reviewerName: {
    fontFamily: Fonts.family.semiBold,
    fontSize: 14,
    flexWrap: 'wrap'
  },
  reviewerCountry: {
    fontFamily: Fonts.family.Regular,
    fontSize: 11,
    marginTop: 2.5
  },
  reviewerPhoto: {
    height: 43,
    width: 43,
    borderRadius: 50,
  },
  verifiedPurchase: {
    fontFamily: Fonts.family.medium,
    fontSize: 13,
    color: '#00BDAA',
  },
  showMoreText: {
    fontFamily: Fonts.family.bold,
    color: '#00BDAA',
  },
});

export default ReviewCard;
