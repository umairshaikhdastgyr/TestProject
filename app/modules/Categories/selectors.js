import { createSelector } from 'reselect';
import { CATEGORIES } from './constants';

export const selectForCategoriesData = () => state => state[CATEGORIES];

export const selectCategoriesData = () =>
  createSelector(
    selectForCategoriesData(),
    state => state,
  );
