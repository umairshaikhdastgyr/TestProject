import { success, failure } from "../utils";

import {
  GET_SUPPLIER_DATA,
  GET_CATALOG_LIST,
  GET_SUPPLIER_PRODUCT_LIST,
  GET_PRODUCTS_PER_CATALOG,
  GET_NEXT_SUPPLIER_PRODUCT_LIST,
  UPDATE_PRODUCTS_PER_CATALOG,
} from "./constants";

const defaultState = {
  isFetchingNextPagePosts: false,
  supplier: {
    isFetching: false,
    data: null,
    error: null,
  },
  productList: {
    isFetching: false,
    data: null,
    error: null,
    total: 0,
  },
  catalogList: {
    isFetching: false,
    data: null,
    error: null,
    total: 0,
  },
  catalogProducts: {
    isFetching: false,
    data: null,
    error: null,
  },
};

const reducer = (state = defaultState, { type, data,payload }) => {
  switch (type) {
    case GET_SUPPLIER_DATA:
      return {
        ...state,
        supplier: {
          ...defaultState.supplier,
          isFetching: true,
        },
      };
    case success(GET_SUPPLIER_DATA):
      return {
        ...state,
        supplier: {
          data,
          isFetching: false,
          error: null,
        },
      };
    case failure(GET_SUPPLIER_DATA):
      return {
        ...state,
        supplier: {
          isFetching: false,
          data: null,
          error: {
            ...data,
          },
        },
      };
    case GET_SUPPLIER_PRODUCT_LIST:
      return {
        ...state,
        productList: {
          ...defaultState.productList,
          isFetching: true,
        },
      };
    case success(GET_SUPPLIER_PRODUCT_LIST):
      return {
        ...state,
        productList: {
          ...data,
          isFetching: false,
          error: null,
        },
      };

    case UPDATE_PRODUCTS_PER_CATALOG:
      return {
        ...state,
        productList: payload
      };
    case failure(GET_SUPPLIER_PRODUCT_LIST):
      return {
        ...state,
        productList: {
          ...defaultState.productList,
          isFetching: false,
          data: null,
          error: {
            ...data,
          },
        },
      };

    case GET_NEXT_SUPPLIER_PRODUCT_LIST:
      return {
        ...state,
        productList: {
          isFetching: false,
          data: state.productList.data,
          error: null,
          total: state.productList.total,
        },
        isFetchingNextPagePosts: true,
      };
    case success(GET_NEXT_SUPPLIER_PRODUCT_LIST):
      return {
        ...state,
        productList: {
          isFetching: false,
          total: state.productList.total,
          data: [...state.productList.data, ...data.data],
        },
        isFetchingNextPagePosts: false,
      };
    case GET_CATALOG_LIST:
      return {
        ...state,
        catalogList: {
          ...defaultState.catalogList,
          isFetching: true,
        },
      };
    case success(GET_CATALOG_LIST):
      return {
        ...state,
        catalogList: {
          ...data,
          isFetching: false,
          error: null,
        },
      };
    case failure(GET_CATALOG_LIST):
      return {
        ...state,
        catalogList: {
          ...defaultState.catalogList,
          isFetching: false,
          data: null,
          error: {
            ...data,
          },
        },
      };
    case GET_PRODUCTS_PER_CATALOG:
      return {
        ...state,
        catalogProducts: {
          ...defaultState.catalogProducts,
          isFetching: true,
        },
      };
    case success(GET_PRODUCTS_PER_CATALOG):
      return {
        ...state,
        catalogProducts: {
          data: {
            ...data?.data,
          },
          isFetching: false,
          error: null,
        },
      };
    case failure(GET_PRODUCTS_PER_CATALOG):
      return {
        ...state,
        catalogProducts: {
          ...defaultState.catalogProducts,
          isFetching: false,
          data: null,
          error: {
            ...data,
          },
        },
      };
    default:
      return state;
  }
};

export default reducer;
