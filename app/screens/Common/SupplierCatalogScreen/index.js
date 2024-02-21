import React, { useEffect, useCallback } from "react";
import { View, SafeAreaView } from "react-native";
import { flex } from "#styles/utilities";
import { useDispatch, useSelector } from "react-redux";
import SmallLoader from "#components/Loader/SmallLoader";
import { getProductsPerCatalog } from "#modules/Catalog/actions";
import { selectCatalogData } from "#modules/Catalog/selectors";
import HeaderCatalog from "./components/header";
import CatalogProductsList from "./components/catalog-products-list";

const SupplierCatalogScreen = ({ navigation, route }) => {
  const { catalogProducts } = useSelector(selectCatalogData());
  const dispatch = useDispatch();
  const catalogData = route?.params?.catalogData;

  const fetchProductsForCatalog = useCallback(() => {
    dispatch(getProductsPerCatalog(catalogData.id));
  }, [dispatch, catalogData]);

  useEffect(() => {
    fetchProductsForCatalog();
  }, [fetchProductsForCatalog]);

  return (
    <SafeAreaView style={[flex.justifyContentSpace, flex.grow1]}>
      <HeaderCatalog
        navigation={navigation}
        catalogData={catalogProducts.data}
        catalogName={catalogData.name}
      />

      <View style={[flex.grow1]}>
        {catalogProducts.isFetching && (
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
        {!catalogProducts.isFetching && (
          <View style={[flex.grow1]}>
            <CatalogProductsList
              navigation={navigation}
              catalogProducts={catalogProducts}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SupplierCatalogScreen;
