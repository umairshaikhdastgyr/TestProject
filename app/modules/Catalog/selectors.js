import { createSelector } from 'reselect';
import { CATALOG } from './constants';

export const selectForCatalogData = () => state => state[CATALOG];

export const selectCatalogData = () =>
  createSelector(
    selectForCatalogData(),
    state => state,
  );
