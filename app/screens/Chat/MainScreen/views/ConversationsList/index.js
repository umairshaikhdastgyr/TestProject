import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from 'react-native';
import { ConversationTile } from '#components';

import EmptyView from './empty-view';

const ConversationsList = ({ navigation, dataList, userId }) => {

  /* Selectors */

  const goToNavigateScreen = item => {
    if (item?.customInfo?.type === 'complete_exchange') {
      navigation.navigate('Review')
      return
    }
    navigation.navigate('ChatScreen', {
      item: item[1],
      conversationId: item[0],
    });
  };


  return (
    <>
      <FlatList
        data={dataList}
        renderItem={({ item }) => (
          <ConversationTile
            onPressItem={handle => {
              goToNavigateScreen(item);
            }}
            data={item[1]}
            userId={userId}
          />
        )}
        keyExtractor={(item, index) => item[0] + index}
        ListEmptyComponent={<EmptyView navigation={navigation} />}
      />
    </>
  );
};

export default ConversationsList;
