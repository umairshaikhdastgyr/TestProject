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

export const persistFilterValues = payload => ({
  type: PERSIST_FILTER_VALUES,
  payload,
});

export const setProperties = payload => ({
  type: SET_PROPERTIES,
  payload,
});

export const persistPropertiesValues = payload => ({
  type: PERSIST_PROPERTIES_VALUES,
  payload,
});

export const setPropertiesValues = payload => ({
  type: SET_PROPERTIES_VALUES,
  payload,
});

export const clearFilters = () => ({
  type: CLEAR_FILTERS,
});

export const getSearchTextSuggestions = payload => ({
  type: GET_SEARCH_TEXT_SUGGESTIONS,
  payload,
});

export const getMaxPricePerCategory = payload => ({
  type: GET_MAX_PRICE_PER_CATEGORY,
  payload,
});

export const getCustomFilterOptionsList = payload => ({
  type: GET_CUSTOM_FILTER_OPTIONS_LIST,
  payload,
});

export const resetFiltersToDefault = payload => ({
  type: RESET_FILTERS_TO_DEFAULT,
  payload,
});

export const getModelsByMake = payload => ({
  type: GET_MODELS_BY_MAKE,
  payload,
});

export const persistLocationSearchPreValues = payload => ({
  type: PERSIST_LOCATION_SEARCH_PRE_VALUES,
  payload,
});
