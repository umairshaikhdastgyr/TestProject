import React from 'react';

import {View, FlatList, Dimensions} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import ProductTile from './product-tile';

import styles from './styles';

const ProductsList = ({
  list,
  onPressItem,
  handleOnScroll,
  handleOnScrollEndDrag,
  ListHeaderComponent,
  moreIcon,
  onPressMoreIcon,
  likedAll,
  onPressLike,
  scrollEnabled,
  handleEndReached,
  onEndReachedThreshold,
  favoriteIcon,
  deleteOption,
  onPressDelete,
  ListEmptyComponent,
  contentContainerStyle,
  footerComponent,
  type,
}) => {
  const updatedList = list?.filter?.(item => {
    if (type != 'draft') {
      return true;
    }
    if (item?.PostStatus?.name != 'Draft') {
      return false;
    }
    return !item?.Product?.ProductImages[0] ||
      !item?.Product?.ProductImages[0].urlImage
      ? false
      : true;
  });

  return (
    <View style={{ height: '100%', width: Dimensions.get("screen").width }}>
      <FlashList
        scrollEnabled={scrollEnabled}
        ListHeaderComponent={ListHeaderComponent}
        contentInset={{bottom: 32}}
        contentContainerStyle={{
          padding: 16,
          ...contentContainerStyle,
        }}
        keyExtractor={(item, index) => item + index}
        numColumns={2}
        data={updatedList}
        renderItem={({item, index}) => {
          return (
            <ProductTile
              key={`${item?.id}${index}`}
              data={item}
              onPress={imageVal => {
                onPressItem(item, imageVal);
              }}
              onPressLike={() => onPressLike(item)}
              moreIcon={moreIcon}
              onPressMoreIcon={() => onPressMoreIcon(item)}
              likedAll={likedAll}
              favoriteIcon={favoriteIcon}
              deleteOption={deleteOption}
              onPressDelete={() => onPressDelete(item)}
              isCatalog
              type={type}
            />
          );
        }}
        estimatedItemSize={180}
        estimatedListSize={{ height: 120, width: Dimensions.get("screen").width }}
        scrollEventThrottle={16}
        // onScroll={handleOnScroll}
        onScrollEndDrag={handleOnScrollEndDrag}
        onEndReached={handleEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={footerComponent}
      />
    </View>
  );
};

ProductsList.defaultProps = {
  list: [],
  likedAll: false,
  onPressItem: () => {},
  onPressLike: () => {},
  onPressMoreIcon: () => {},
};

export default ProductsList;
