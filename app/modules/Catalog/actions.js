import {
  GET_SUPPLIER_PRODUCT_LIST,
  GET_CATALOG_LIST,
  GET_PRODUCTS_PER_CATALOG,
  GET_SUPPLIER_DATA,
  GET_NEXT_SUPPLIER_PRODUCT_LIST,
  UPDATE_PRODUCTS_PER_CATALOG,
} from './constants';

export const getSupplierData = userId => ({
  type: GET_SUPPLIER_DATA,
  payload: {
    userId,
  },
});

export const getSupplierProductList = (sellerId, page, perPage) => ({
  type: GET_SUPPLIER_PRODUCT_LIST,
  payload: {
    sellerId,
    page,
    perPage,
  },
});

export const updateSupplierProductList = (data) => ({
  type: UPDATE_PRODUCTS_PER_CATALOG,
  payload: data,
});

export const getNextSupplierProductList = (sellerId, page, perPage) => ({
  type: GET_NEXT_SUPPLIER_PRODUCT_LIST,
  payload: {
    sellerId,
    page,
    perPage,
  },
});

export const getCatalogList = (userId, page, perPage) => ({
  type: GET_CATALOG_LIST,
  payload: {
    userId,
    page,
    perPage,
  },
});

export const getProductsPerCatalog = catalogId => ({
  type: GET_PRODUCTS_PER_CATALOG,
  payload: {
    catalogId,
  },
});
