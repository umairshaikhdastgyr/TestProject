import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, ActivityIndicator} from 'react-native';
import {BodyText, EmptyState, ProductsList} from '#components';
import {flex, margins} from '#styles/utilities';
import {SetFavoritePostFlowModals} from '#common-views';
import {selectIdeasData} from '#modules/Ideas/selectors';
import {selectUserData} from '#modules/User/selectors';
import {
  getAlbumsIdeas,
  deleteIdeaGlobally,
  getAlbumIdeasNextRelatedPost,
  addFavoriteRelatedPost,
  removeFavoriteRelatedPost,
} from '#modules/Ideas/actions';
import {useActions} from '#utils';
import {ExplorePageLoader} from '#components/SkeletonPlaceholderLoader';
import {Colors} from '#themes';

const RelatedView = ({navigation, ideasAlbumId}) => {
  const dispatch = useDispatch();
  /* Selectors */
  const {
    albumRelatedPost: {isFetching, relatedList, total, isFetchingNext},
  } = useSelector(selectIdeasData());

  const {information: userInfo} = useSelector(selectUserData());

  const [postToFavorite, setPostToFavorite] = useState({});
  const [relatedCount, setRelatedCount] = useState(1);
  const [isVisibleFavoriteModal, setIsVisibleFavoriteModal] = useState(false);
  const [postData, setPostData] = useState({});

  const actions = useActions({
    deleteIdeaGlobally,
    getAlbumsIdeas,
    addFavoriteRelatedPost,
  });

  const handlePressLike = async item => {
    if (item.isFavorite !== true) {
      setPostToFavorite({
        id: item.id,
        image: item.Product.ProductImages[0].urlImage,
      });
      setPostData(item);
    } else {
      await actions.deleteIdeaGlobally({
        postId: item.id,
        userId: userInfo.id,
      });
      dispatch(removeFavoriteRelatedPost({postData: item}));
      // console.log('end');
      actions.getAlbumsIdeas({params: {userId: userInfo.id}});
    }
  };

  useEffect(() => {
    if (postToFavorite.id) {
      if (userInfo.id) setIsVisibleFavoriteModal(true);
      else navigation.navigate('MainAuth', {isGuest: true});
    }
  }, [postToFavorite.id]);

  const handleOnEndReached = () => {
    if (!isFetchingNext && !isFetching && total >= relatedList?.length) {
      const relatedData = {
        ideasAlbumId: ideasAlbumId,
        page: relatedCount + 1,
        perPage: 20,
      };
      dispatch(getAlbumIdeasNextRelatedPost(relatedData));
      setRelatedCount(relatedCount + 1);
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
      {isFetching && <ExplorePageLoader />}
      <ProductsList
        list={relatedList}
        ListHeaderComponent={
          <>
            {relatedList?.length === 0 && (
              <EmptyState
                icon="explore"
                text="No related post for this board yet"
              />
            )}
          </>
        }
        onPressItem={(item, imageVal) => {
          const finalProductImages = item?.Product?.ProductImages?.map(obj => {
            const findObj = imageVal?.find(el => el?.id == obj?.id);
            if (findObj) {
              return findObj;
            } else {
              return obj;
            }
          });
          navigation.navigate('ProductDetail', {
            postId: item.id,
            updatedProductImages: finalProductImages,
            postData: {
              ...item,
              Product: {
                ...item?.Product,
                ProductImages: finalProductImages,
              },
            },
          });
        }}
        onPressLike={item => handlePressLike(item)}
        handleEndReached={handleOnEndReached}
        onEndReachedThreshold={0.5}
        footerComponent={listFooterComponent}
      />
      <SetFavoritePostFlowModals
        post={postToFavorite}
        isVisible={isVisibleFavoriteModal}
        closeModal={(val, obj) => {
          setIsVisibleFavoriteModal(false);
          setPostToFavorite({});
          if(val != 'close'){
            dispatch(
              addFavoriteRelatedPost({
                postData: postData,
                ideasAlbumId: ideasAlbumId,
                ideasName: obj,
              }),
            );
          }
        }}
      />
    </View>
  );
};

export default RelatedView;
