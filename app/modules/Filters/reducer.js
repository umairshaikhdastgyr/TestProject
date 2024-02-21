import {
  PERSIST_FILTER_VALUES,
  SET_PROPERTIES,
  PERSIST_PROPERTIES_VALUES,
  SET_PROPERTIES_VALUES,
  CLEAR_FILTERS,
  GET_SEARCH_TEXT_SUGGESTIONS,
  GET_MAX_PRICE_PER_CATEGORY,
  GET_CUSTOM_FILTER_OPTIONS_LIST,
  RESET_FILTERS_TO_DEFAULT,
  GET_MODELS_BY_MAKE,
  PERSIST_LOCATION_SEARCH_PRE_VALUES,
} from './constants';
import { success } from '../utils';

const defaultState = {
  filterOptions: {
    sortBy: [
      { label: 'Newest', value: 'newest' },
      { label: 'Closest', value: 'closest' },
      { label: 'Price - Low to High', value: 'lowest' },
      { label: 'Price - High to Low', value: 'highest' },
    ],
    maxPrice: 1000000,
  },
  filterValues: {
    searchText: '',
    location: {},
    distance: [1000],
    latitude: 0,
    longitude: 0,
    sortBy: '',
    category: {},

    // Child Filters
    quickDeliveries: [],
    delivery: [],
    subCategories: [],
    subCategoriesChilds: [],
    priceRange: [0, 1000000],
    customProperties: {},
    userDefaultIsSetted: false,
  },
  defaultValues: {
    location: {},
    distance: [1000],
    sortBy: '',
    category: {},

    // Child Filters
    quickDeliveries: [],
    delivery: [],
    subCategories: [],
    subCategoriesChilds: [],
    priceRange: [0, 1000000],
    maxPrice: 1000000,
  },
  properties: [],
  propertiesFetchedOptions: {},
  propertiesValues: {},
  searchTextSuggestions: {
    isFetching: false,
    list: [],
  },
  locationSearchPreValues: {
    location: {},
    distance: [1000],
  },
};

const reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case PERSIST_FILTER_VALUES:
      
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          ...payload,
        },
      };

    case SET_PROPERTIES:
      return {
        ...state,
        properties: payload,
      };

    case SET_PROPERTIES_VALUES:
      return {
        ...state,
        propertiesValues: payload,
      };

    case PERSIST_PROPERTIES_VALUES:
      return {
        ...state,
        propertiesValues: payload,
      };
    case CLEAR_FILTERS:
      return {
        ...defaultState,
      };
    case GET_SEARCH_TEXT_SUGGESTIONS:
      return {
        ...state,
        searchTextSuggestions: {
          ...state.searchTextSuggestions,
          isFetching: true,
          list: [],
        },
      };

    case success(GET_SEARCH_TEXT_SUGGESTIONS):
      return {
        ...state,
        searchTextSuggestions: {
          ...state.searchTextSuggestions,
          isFetching: false,
          list: payload.data,
        },
      };

    case success(GET_MAX_PRICE_PER_CATEGORY):
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          maxPrice: payload?.data?.max ? Number(payload.data.max) : 1000000,
        },
        defaultValues: {
          ...state.defaultValues,
          priceRange: [0, payload?.data?.max ? Number(payload.data.max) : 1000000],
        },
      };

    case success(GET_CUSTOM_FILTER_OPTIONS_LIST):
      return {
        ...state,
        propertiesFetchedOptions: {
          ...state.propertiesFetchedOptions,
          [payload.filterName]: payload.data,
        },
      };

    case RESET_FILTERS_TO_DEFAULT:
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          ...state.defaultValues,
        },
      };

    case GET_MODELS_BY_MAKE:
      return {
        ...state,
        propertiesFetchedOptions: {
          ...state.propertiesFetchedOptions,
          ...(payload.index === 0 && { model: [] }),
        },
      };

    case success(GET_MODELS_BY_MAKE):
      const itemsParsed = payload.data.childProperties.listOptions.map(
        option => ({
          name: option,
          id: option,
        }),
      );
      return {
        ...state,
        propertiesFetchedOptions: {
          ...state.propertiesFetchedOptions,
          model: [...state.propertiesFetchedOptions.model, ...itemsParsed],
        },
      };

    case PERSIST_LOCATION_SEARCH_PRE_VALUES:
      return {
        ...state,
        locationSearchPreValues: payload,
      };

    default:
      return state;
  }
};

export default reducer;
