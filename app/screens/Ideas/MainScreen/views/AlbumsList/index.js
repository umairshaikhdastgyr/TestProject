import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { StyleSheet, FlatList } from 'react-native';
import { Loader } from '#components';

import AlbumTile from './album-tile';
import EmptyView from './empty-view';

import { selectIdeasData } from '#modules/Ideas/selectors';

const AlbumsList = ({ navigation, fromScreen, network }) => {
  /* Selectors */

  const {
    albums: { list, isFetching },
  } = useSelector(selectIdeasData());

  return (
    <>
      {isFetching && network && <Loader />}
      {!isFetching && list.length === 0 && fromScreen === 'tabBar' && (
        <EmptyView navigation={navigation} />
      )}
      {!isFetching && list.length > 0 && (
        <FlatList
          style={styles.albumList}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
          contentInset={{ bottom: 32 }}
          keyExtractor={(item, index) => item + index}
          data={list}
          renderItem={({ item }) => (
            <AlbumTile
              fromScreen={fromScreen}
              navigation={navigation}
              data={item}
            />
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  albumList: {
    flex: 1,
  },
});

export default AlbumsList;
