import { createSelector } from 'reselect';
import { POSTS } from './constants';

export const selectForPostsData = () => state => state[POSTS];

export const selectPostsData = () =>
  createSelector(
    selectForPostsData(),
    state => state,
  );
