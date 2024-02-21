import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import {Share, View, ActivityIndicator} from 'react-native';
import {BodyText, ProductsList, Loader, EmptyState} from '#components';
import {flex, margins} from '#styles/utilities';
import {Colors} from '#themes';
import {selectIdeasData} from '#modules/Ideas/selectors';
import {
  deleteIdeaFromAlbum,
  getAlbumIdeasNextSavedPost,
} from '#modules/Ideas/actions';
import {useActions} from '#utils';

const SavedView = ({navigation, route, ideasAlbumId}) => {
  const dispatch = useDispatch();
  /* Actions */
  const actions = useActions({
    deleteIdeaFromAlbum,
  });
  /* States */
  const [currentItemOnActionSheet, setCurrentItemOnActionSheet] = useState({});
  const [savedCount, setSavedCount] = useState(1);
  const [openShareActionSheet, setOpenShareActionSheet] = useState(false);
  let MoreActionSheet;

  /* Effects */
  useEffect(() => {
    if (currentItemOnActionSheet.id) MoreActionSheet.show();
  }, [currentItemOnActionSheet.id]);

  useEffect(() => {
    if (openShareActionSheet) openShareItemOptions();
  }, [openShareActionSheet]);

  /* Selectors */
  const {
    albumDetails: {details},
    albumSavedPost: {isFetching, isFetchingNext, postsList, total},
  } = useSelector(selectIdeasData());

  const fromScreen = route?.params?.fromScreen ?? 'tabBar';
  /* Methods */
  const handlePressMore = item => {
    setOpenShareActionSheet(false);
    setCurrentItemOnActionSheet(item);
  };

  const handlePressMoreActionSheetOption = async index => {
    switch (index) {
      case 0:
        setCurrentItemOnActionSheet({});
        // console.log({})
        return navigation.navigate('ProductDetail', {
          postId: currentItemOnActionSheet.id,
          ideasAlbumId: details.id,
          postData: currentItemOnActionSheet,
          type: 'ideaAlbumDetail',
        });
      case 1:
        return setOpenShareActionSheet(true);
      case 2:
        setCurrentItemOnActionSheet({});
        return navigation.navigate('MoveListing', {
          postId: currentItemOnActionSheet.id,
          ideasAlbumId: details.id,
        });
      case 3:
        // handleGetSavePost();
        await actions.deleteIdeaFromAlbum({
          postId: currentItemOnActionSheet.id,
          ideasAlbumId: details.id,
        });
        return null;
      default:
        setCurrentItemOnActionSheet({});
        return null;
    }
  };

  const openShareItemOptions = async () => {
    const shareOptions = {
      title: 'Share Item',
      message: `Check out this ${currentItemOnActionSheet.title}. I found on Homitag.`,
    };
    setCurrentItemOnActionSheet({});
    await Share.share(shareOptions);
  };

  const handleOnEndReached = () => {
    if (!isFetchingNext && !isFetching && total > postsList?.length) {
      const savedData = {
        ideasAlbumId: ideasAlbumId,
        page: savedCount + 1,
        perPage: 20,
      };
      dispatch(getAlbumIdeasNextSavedPost(savedData));
      setSavedCount(savedCount + 1);
      return;
    }
  };

  const listFooterComponent = () => {
    return (
      <>
        {isFetchingNext && (
          <ActivityIndicator size={'large'} color={Colors.primary} />
        )}
      </>
    );
  };

  return (
    <View style={flex.grow1}>
      {isFetching && <Loader />}
      {!isFetching && (
        <ProductsList
          ListHeaderComponent={
            <>
              <BodyText style={margins['mb-4']}>
                {details.description || 'No description...'}
              </BodyText>
              {postsList?.length === 0 && (
                <EmptyState
                  icon="like"
                  text="No post saved for this board yet"
                />
              )}
            </>
          }
          likedAll
          list={postsList}
          onPressItem={(item, imageVal) => {
            const finalProductImages = item?.Product?.ProductImages?.map(
              obj => {
                const findObj = imageVal?.find(el => el?.id == obj?.id);
                if (findObj) {
                  return findObj;
                } else {
                  return obj;
                }
              },
            );
            navigation.navigate('ProductDetail', {
              postData: {
                ...item,
                Product: {
                  ...item?.Product,
                  ProductImages: finalProductImages,
                },
              },
              updatedProductImages: finalProductImages,
              postId: item.id,
              ideasAlbumId: details.id,
              postData: item,
              type: 'ideaAlbumDetail',
            });
          }}
          onPressLike={item => {
            fromScreen === 'tabBar' &&
              actions.deleteIdeaFromAlbum({
                postId: item.id,
                ideasAlbumId: details.id,
              });
          }}
          moreIcon
          onPressMoreIcon={item => handlePressMore(item)}
          handleEndReached={handleOnEndReached}
          onEndReachedThreshold={0.5}
          footerComponent={listFooterComponent}
        />
      )}

      <ActionSheet
        ref={o => {
          MoreActionSheet = o;
        }}
        options={[
          'View Item Detail',
          'Share',
          'Move Listing',
          'Unsave',
          'Cancel',
        ]}
        destructiveButtonIndex={4}
        cancelButtonIndex={4}
        onPress={index => handlePressMoreActionSheetOption(index)}
      />
    </View>
  );
};

export default SavedView;
