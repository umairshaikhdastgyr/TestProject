import React, { useEffect, useState } from 'react';

import { View, FlatList } from 'react-native';
import moment from 'moment';
import { Heading } from '#components';
import { paddings, margins, borders } from '#styles/utilities';
import InterestedPersonTile from '../InterestedPersonTile';

const PurchasedBuyer = ({
  chatInfo,
  userId,
  postId,
  navigation,
  prodStatus,
  orderList,
  postBuyerDetail,
}) => {
  const [purchasedBuyer, setPurchasedBuyer] = useState([]);
  // useEffect(() => {

  // }, []);

  useEffect(() => {
    if (orderList.data.length > 0 && postBuyerDetail.data) {
      const arrayObj = Object.entries(chatInfo);
      arrayObj.sort((a, b) => {
        if (moment(a[1].datetime) > moment(b[1].datetime)) {
          return -1;
        }
        if (moment(a[1].datetime) < moment(b[1].datetime)) {
          return 1;
        }
        return 0;
      });
      const data = arrayObj.filter(
        dataList =>
          dataList[1].sellerId === userId &&
          dataList[1].post.id === postId &&
          dataList[1].receiver.userId === orderList.data[0].buyerId,
      );
      const buyerData = [
        {
          ...data[0],
          reviews: postBuyerDetail.data.reviews,
          rating: postBuyerDetail.data.rating,
        },
      ];
      setPurchasedBuyer(buyerData);
    }
  }, [postBuyerDetail, orderList]);

  useEffect(() => {
    // console.log({ purchasedBuyer });
  }, [purchasedBuyer]);

  const goToNavigateScreen = item => {
    navigation.navigate('ChatScreen', { item });
  };
  const title = prodStatus === 'ACTIVE' ? 'Interested Buyers' : 'Purchased By';
  return purchasedBuyer.length > 0 ? (
    <View
      style={{
        ...paddings['p-3'],
        ...paddings['pb-5'],
        ...borders.bb,
      }}
    >
      <Heading type="bodyText" style={margins['mb-4']}>
        {title}
      </Heading>

      <FlatList
        data={purchasedBuyer}
        renderItem={({ item }) => (
          <InterestedPersonTile
            onPressItem={() => {
              goToNavigateScreen(item[1]);
            }}
            data={{ ...item, ...item[1] }}
          />
        )}
        keyExtractor={(item, index) => item[0] + index}
      />
    </View>
  ) : null;
};

export default PurchasedBuyer;
