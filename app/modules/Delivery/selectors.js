import { createSelector } from 'reselect';
import { DELIVERY } from './constants';

export const selectForDeliveryData = () => state => state[DELIVERY];

export const selectDeliveryData = () =>
  createSelector(
    selectForDeliveryData(),
    state => state,
  );
