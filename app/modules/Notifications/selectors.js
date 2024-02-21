import { createSelector } from 'reselect';
import { NOTIFICATION } from './constants';

const selectForNotification = state => state[NOTIFICATION];

export const notificationSelector = createSelector(
  selectForNotification,
  notifications => ({ notifications }),
);

// Selector for hooks
export const selectForNotificationData = () => state => state[NOTIFICATION];
export const selectNotificationData = () =>
  createSelector(
    selectForNotificationData(),
    state => state,
  );
