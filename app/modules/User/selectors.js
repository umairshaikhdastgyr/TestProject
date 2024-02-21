import { createSelector } from 'reselect';
import { USER } from './constants';

const selectForUser = state => state[USER];

export const userSelector = createSelector(selectForUser, user => ({ user }));

// Selector for hooks
export const selectForUserData = () => state => state[USER];
export const selectUserData = () =>
  createSelector(selectForUserData(), state => state);
