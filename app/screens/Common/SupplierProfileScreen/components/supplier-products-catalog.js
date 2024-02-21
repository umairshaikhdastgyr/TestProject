import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {StyleSheet, View} from 'react-native';
import {ProductsList, Loader, EmptyState} from '#components';
import {SetFavoritePostFlowModals} from '#common-views';
import Tabs from '../components/tabs';
import {paddings} from '#styles/utilities';

import {useActions} from '#utils';
import {selectUserData} from '#modules/User/selectors';
import {deleteIdeaGlobally, getAlbumsIdeas} from '#modules/Ideas/actions';
import {updateSupplierProductList} from '#modules/Catalog/actions';
import {MainAuthStackNavigation} from '../../../../navigators/MainAuthStackNavigation';

const SupplierProductsCatalog = ({
  navigation,
  productList,
  catalogList,
  handleEndReachedProducts,
  isFromDashboard,
  isBuy,
  sellerStatus,
}) => {
  /* Selectors */
  const {information: userInfo} = useSelector(selectUserData());

  /* Actions */
  const actions = useActions({deleteIdeaGlobally, getAlbumsIdeas});
  const dispatch = useDispatch();

  /* States */
  const [activeTab, setActiveTab] = useState('products');
  const [postToFavorite, setPostToFavorite] = useState({});
  const [isVisibleFavoriteModal, setIsVisibleFavoriteModal] = useState(false);
  const tabs = [
    {id: 'products', name: 'Products'},
    {id: 'catalog', name: 'Catalog'},
  ];

  /* Effects */
  useEffect(() => {
    if (postToFavorite.id) {
      if (userInfo.id) {
        setIsVisibleFavoriteModal(true);
      } else {
        navigation.navigate('MainAuth');
      }
    }
  }, [navigation, postToFavorite.id, userInfo.id]);

  const handlePressLike = async item => {
    if (userInfo.id) {
      if (item.isFavorite !== true) {
        setPostToFavorite({
          id: item.id,
          image: item?.Product?.ProductImages[0].urlImage,
        });
      } else {
        await actions.deleteIdeaGlobally({
          postId: item.id,
          userId: userInfo.id,
        });
        const latestData = productList?.data?.map(obj => {
          if (obj?.id == item.id) {
            return {...obj, isFavorite: false};
          } else {
            return obj;
          }
        });
        dispatch(updateSupplierProductList({...productList, data: latestData}));
        actions.getAlbumsIdeas({params: {userId: userInfo.id}});
      }
    } else {
      MainAuthStackNavigation(navigation);
    }
  };

  const parsedCatalog = catalogList?.data?.map(catalog => {
    if (catalog?.Posts?.length == 0) {
      return;
    }
    const catalogData = {
      id: catalog.id,
      name: catalog.name,
      Product: catalog?.Posts?.[0]?.Product ?? null,
    };

    return catalogData;
  });

  return (
    <>
      <View style={styles.header}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
      <View style={styles.productsContainer}>
        {activeTab === 'products' && (
          <>
            {productList?.isFetching && <Loader />}
            {!productList?.isFetching && productList?.data?.length == 0 && (
              <EmptyState icon="goods" text="No product" />
            )}
            {(sellerStatus == 'deactivated' || sellerStatus == 'inactive') &&
              productList?.data?.length > 0 && (
                <EmptyState icon="goods" text="No product" />
              )}
            {!productList?.isFetching &&
              productList?.data?.length > 0 &&
              sellerStatus != 'deactivated' &&
              sellerStatus != 'inactive' && (
                <ProductsList
                  scrollEnabled
                  list={productList?.data}
                  onPressItem={item =>
                    navigation.push('ProductDetail', {
                      postId: item.id,
                      onBack: () => navigation.goBack(),
                      postData: item,
                      key: `PostDetail${item.id}`,
                    })
                  }
                  onPressLike={item => handlePressLike(item)}
                  contentContainerStyle={{...paddings['p-3']}}
                  handleEndReached={handleEndReachedProducts}
                  onEndReachedThreshold={0.5}
                />
              )}
          </>
        )}
        {activeTab === 'catalog' && (
          <>
            {catalogList?.isFetching && <Loader />}
            {!catalogList?.isFetching && parsedCatalog[0] == undefined && (
              <EmptyState icon="goods" text="No catalog" />
            )}
            {(sellerStatus == 'deactivated' || sellerStatus == 'inactive') &&
              parsedCatalog[0] != undefined &&
              catalogList?.total > 0 && (
                <EmptyState icon="goods" text="No catalog" />
              )}
            {!catalogList?.isFetching &&
              parsedCatalog[0] != undefined &&
              sellerStatus != 'deactivated' &&
              sellerStatus != 'inactive' && (
                <ProductsList
                  scrollEnabled={true}
                  list={parsedCatalog}
                  onPressItem={item =>
                    navigation.navigate('SupplierCatalog', {
                      catalogData: item,
                      key: `PostDetail${item.id}`,
                    })
                  }
                  favoriteIcon={false}
                  contentContainerStyle={{...paddings['p-3']}}
                />
              )}
          </>
        )}
      </View>
      <SetFavoritePostFlowModals
        post={postToFavorite}
        isVisible={isVisibleFavoriteModal}
        closeModal={withSuccess => {
          if (withSuccess == true) {
            const latestData = productList?.data?.map(obj => {
              if (obj?.id == postToFavorite?.id) {
                return {...obj, isFavorite: true};
              } else {
                return obj;
              }
            });
            dispatch(
              updateSupplierProductList({...productList, data: latestData}),
            );
            setIsVisibleFavoriteModal(false);
            setPostToFavorite({});
          } else if (withSuccess == 'close') {
            setIsVisibleFavoriteModal(false);
            setPostToFavorite({});
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  productsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
  },
});

export default SupplierProductsCatalog;
