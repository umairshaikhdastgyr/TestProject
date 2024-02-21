import React, { useEffect, useCallback, useState } from "react";
import { View, SafeAreaView, ActivityIndicator } from "react-native";
import Header from "./components/header";
import SupplierDetail from "./components/supplier-detail";
import { flex } from "#styles/utilities";
import { useDispatch, useSelector } from "react-redux";
import SmallLoader from "#components/Loader/SmallLoader";
import {
  getSupplierData,
  getSupplierProductList,
  getCatalogList,
  getNextSupplierProductList,
} from "#modules/Catalog/actions";
import { selectCatalogData } from "#modules/Catalog/selectors";
import SupplierProductsCatalog from "./components/supplier-products-catalog";
import { Colors } from "#themes";

const SupplierProfileScreen = ({ navigation, route }) => {
  const { supplier, productList, catalogList, isFetchingNextPagePosts } =
    useSelector(selectCatalogData());

  const dispatch = useDispatch();
  const userId = route?.params?.userId;
  const postData = route?.params?.postData;
  const isFromDashboard = route?.params?.isFromDashboard;
  const isBuy = route?.params?.isBuy;
  const sellerStatus = route?.params?.sellerStatus;

  const [page, setPage] = useState(1);

  const productListCurrentTotal = productList?.data?.length ?? 0;

  const fetchSupplierData = useCallback(() => {
    dispatch(getSupplierData(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    fetchSupplierData();
  }, [fetchSupplierData]);

  const fetchSupplierProductList = useCallback(
    (currentSupplierProductListPage) => {
      if (!supplier.data) {
        return;
      }

      const id = supplier.data.id;
      if (id) {
        dispatch(
          getSupplierProductList(id, currentSupplierProductListPage, 30)
        );
      }
    },
    [dispatch, supplier.data]
  );

  const fetchCatalog = useCallback(() => {
    if (!supplier.data) {
      return;
    }

    const id = supplier.data.id;
    if (id) {
      dispatch(getCatalogList(id, 1, 30));
    }
  }, [dispatch, supplier.data]);

  const handleFetchProductsAndCatalog = useCallback(() => {
    fetchSupplierProductList(1);
    fetchCatalog();
  }, [fetchCatalog, fetchSupplierProductList]);

  useEffect(() => {
    if (supplier.data) {
      handleFetchProductsAndCatalog();
    }
  }, [handleFetchProductsAndCatalog, supplier.data]);

  const handleEndReachedProducts = () => {
    if (!supplier?.data) {
      return;
    }
    if (isFetchingNextPagePosts) {
      return;
    }

    if (
      !isFetchingNextPagePosts &&
      productListCurrentTotal < productList.total
    ) {
      dispatch(getNextSupplierProductList(supplier?.data?.id, page + 1, 30));
      setPage(page + 1);
      return;
    }
  };

  return (
    <SafeAreaView style={[flex.justifyContentSpace, flex.grow1]}>
      <Header navigation={navigation} supplierData={supplier.data} />

      <View style={[flex.grow1]}>
        {supplier.isFetching && (
          <View
            style={[
              flex.grow1,
              flex.justifyContentCenter,
              flex.alignItemsCenter,
            ]}
          >
            <SmallLoader />
          </View>
        )}
        {!supplier.isFetching && (
          <>
            <SupplierDetail
              supplierData={supplier.data}
              navigation={navigation}
              postData={postData}
            />
            <View style={flex.grow1}>
              <SupplierProductsCatalog
                navigation={navigation}
                catalogList={catalogList}
                productList={productList}
                handleEndReachedProducts={handleEndReachedProducts}
                isFromDashboard={isFromDashboard}
                isBuy={isBuy}
                sellerStatus={sellerStatus}
              />

              {isFetchingNextPagePosts && (
                <ActivityIndicator size={"large"} color={Colors.active} />
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SupplierProfileScreen;
