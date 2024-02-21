import { createSelector } from 'reselect';
import { IDEAS } from './constants';

export const selectForIdeasData = () => state => state[IDEAS];

export const selectIdeasData = () =>
  createSelector(
    selectForIdeasData(),
    state => state,
  );
