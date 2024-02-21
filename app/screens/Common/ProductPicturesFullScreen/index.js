import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';
import {Icon} from '#components';
import {SetFavoritePostFlowModals} from '#common-views';
import ItemPictures from './views/item-pictures';
import Footer from './views/footer';
import {flex} from '#styles/utilities';
import {selectPostsData} from '#modules/Posts/selectors';
import {getProductShareLink} from '#utils';

const ProductPicturesFullScreen = ({navigation, route}) => {
  /* Selectors */
  const {postDetail} = useSelector(selectPostsData());
  const images = route?.params?.images ?? null;
  const initialImageId = route?.params?.initialImageId ?? null;
  const imageIndex = route?.params?.imageIndex ?? null;
  const handleFav = route?.params?.handleFav ?? null;

  /* States */
  const [isVisibleFavoriteModal, setIsVisibleFavoriteModal] = useState(false);
  const [postDetailScreen, setPostDetail] = useState(
    route?.params?.postDetail ?? {},
  );

  useEffect(() => {
    if (postDetailScreen?.id && postDetailScreen?.id === postDetail?.id) {
      setPostDetail(postDetail);
    }
  }, [postDetail]);

  /* Methods */
  const handleOpenShareOptions = async () => {
    let message = `Checkout this ${postDetailScreen.Product.title} for $${
      postDetailScreen?.initialPrice
    }  I found on Homitag.  ${postDetailScreen?.description || ''}`;
    const link = await getProductShareLink(
      `?postId=${postDetailScreen.id}`,
      `${postDetailScreen?.Product?.ProductImages?.[0]?.urlImage}`,
      `Checkout this ${postDetailScreen.Product.title}`,
      message,
    );
    message = `${message} \n ${link}`;

    const shareOptions = {
      title: 'Share Item',
      message,
    };
    await Share.share(shareOptions);
  };
  return (
    <SafeAreaView style={[flex.grow1, {backgroundColor: 'white'}]}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}>
        <Icon icon="close" />
      </TouchableOpacity>
      <ItemPictures
        postDetail={postDetailScreen}
        images={images}
        initialImageId={initialImageId}
        imageIndex={imageIndex}
      />
      <View style={{marginRight: 20}}>
        {!images && (
          <Footer
            postDetail={postDetailScreen}
            isVisibleFavoriteModal={isVisibleFavoriteModal}
            setIsVisibleFavoriteModal={setIsVisibleFavoriteModal}
            handleOpenShareOptions={handleOpenShareOptions}
            navigation={navigation}
            handleFav={value => {
              handleFav(value);
              setPostDetail({
                ...postDetailScreen,
                isFavorite: value,
              });
            }}
          />
        )}
      </View>
      {postDetailScreen?.id && (
        <SetFavoritePostFlowModals
          post={{
            id: postDetailScreen?.id,
            image: postDetailScreen?.Product?.ProductImages[0]?.urlImage,
          }}
          isVisible={isVisibleFavoriteModal}
          closeModal={(state, name) => {
            if (state === 'close') {
              setIsVisibleFavoriteModal(false);
            } else if (state === true && name !== undefined) {
              setIsVisibleFavoriteModal(false);
              setPostDetail({
                ...postDetailScreen,
                isFavorite: true,
              });
              handleFav(true);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    marginLeft: 'auto',
    marginTop: 24,
    marginRight: 24,
  },
});

export default ProductPicturesFullScreen;
