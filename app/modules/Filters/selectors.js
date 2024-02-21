import { createSelector } from 'reselect';
import { FILTERS } from './constants';

export const selectForFiltersData = () => state => state[FILTERS];

export const selectFiltersData = () =>
  createSelector(
    selectForFiltersData(),
    state => state,
  );
