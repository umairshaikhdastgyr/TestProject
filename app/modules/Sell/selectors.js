import { createSelector } from 'reselect';
import { SELL } from './constants';

export const selectorForSellData = () => state => state[SELL];

export const selectSellData = () =>
  createSelector(
    selectorForSellData(),
    state => state,
  );
