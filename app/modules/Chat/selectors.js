import { createSelector } from 'reselect';
import { CHAT } from './constants';

const selectForChat= state => state[CHAT];

export const chatSelector = createSelector(
  selectForChat,
  chat => ({ chat }),
);


// Selector for hooks
export const selectForChatData = () => state => state[CHAT];
export const selectChatData = () =>
  createSelector(
    selectForChatData(),
    state => state,
  );
