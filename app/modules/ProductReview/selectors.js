import { createSelector } from 'reselect';
import { REVIEWS } from './constants';

export const selectForReviewsData = () => state => state[REVIEWS];

export const selectReviewsData = () =>
  createSelector(
    selectForReviewsData(),
    state => state,
  );
