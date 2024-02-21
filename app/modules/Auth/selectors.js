import { createSelector } from 'reselect';
import { AUTH } from './constants';

const selectForAuth = state => state[AUTH];

export const authSelector = createSelector(
  selectForAuth,
  auth => ({ auth }),
);
