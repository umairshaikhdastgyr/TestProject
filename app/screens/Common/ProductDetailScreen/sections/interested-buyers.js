import React, { useEffect } from 'react';

import { View, FlatList } from 'react-native';
import moment from 'moment';
import { Heading } from '#components';
import { paddings, margins, borders } from '#styles/utilities';
import InterestedPersonTile from '../InterestedPersonTile';

const InterestedBuyers = ({
  chatInfo,
  userId,
  postId,
  navigation,
  interestedBuyers,
  setInterestedBuyers,
  prodStatus,
}) => {
  useEffect(() => {
    if(chatInfo != null){
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
        dataList[1].sellerId === userId && dataList[1].post.id === postId,
    );
    setInterestedBuyers(data);
  }
  }, []);

  const goToNavigateScreen = item => {
    navigation.navigate('ChatScreen', { item, screen: 'profile' });
  };
  const title =
    prodStatus === 'ACTIVE' ||
    prodStatus === 'OFFER ACCEPTED' ||
    prodStatus === 'OFFER RECEIVED'
      ? 'Interested Buyers'
      : 'Purchased By';
  return interestedBuyers.length > 0 ? (
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
        data={interestedBuyers}
        renderItem={({ item }) => (
          <InterestedPersonTile
            onPressItem={() => {
              goToNavigateScreen(item[1]);
            }}
            data={item[1]}
            type="interest"
          />
        )}
        keyExtractor={(item, index) => item[0] + index}
      />
    </View>
  ) : null;
};

export default InterestedBuyers;
