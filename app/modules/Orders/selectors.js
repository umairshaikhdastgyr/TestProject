import { createSelector } from 'reselect';
import { ORDER } from './constants';

export const selectForOrderData = () => state => state[ORDER];

export const selectOrderData = () =>
  createSelector(
    selectForOrderData(),
    state => state,
  );
