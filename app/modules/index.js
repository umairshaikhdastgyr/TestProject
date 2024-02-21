import { combineReducers } from 'redux';

import { CATEGORIES } from './Categories/constants';
import categoriesReducer from './Categories/reducer';

import { POSTS } from './Posts/constants';
import postsReducer from './Posts/reducer';

import { AUTH } from './Auth/constants';
import authReducer from './Auth/reducer';

import { FILTERS } from './Filters/constants';
import filtersReducer from './Filters/reducer';

import { USER } from './User/constants';
import userReducer from './User/reducer';

import { SELL } from './Sell/constants';
import sellReducer from './Sell/reducer';

import { DELIVERY } from './Delivery/constants';
import deliveryReducer from './Delivery/reducer';

import { IDEAS } from './Ideas/constants';
import ideasReducer from './Ideas/reducer';

import { CHAT } from './Chat/constants';
import chatReducer from './Chat/reducer';

import { NOTIFICATION } from './Notifications/constants';
import notificationReducer from './Notifications/reducer';

import { ORDER } from './Orders/constants';
import ordersReducer from './Orders/reducer';

import { GENERAL } from './General/constants';
import generalReducer from './General/reducer';

import { REVIEWS } from './ProductReview/constants';
import reviewsReducer from './ProductReview/reducer';

import { CATALOG } from './Catalog/constants';
import catalogReducer from './Catalog/reducer';

const rootReducer = combineReducers({
  [CATEGORIES]: categoriesReducer,
  [POSTS]: postsReducer,
  [AUTH]: authReducer,
  [FILTERS]: filtersReducer,
  [USER]: userReducer,
  [SELL]: sellReducer,
  [DELIVERY]: deliveryReducer,
  [IDEAS]: ideasReducer,
  [CHAT]: chatReducer,
  [NOTIFICATION]: notificationReducer,
  [ORDER]: ordersReducer,
  [GENERAL]: generalReducer,
  [REVIEWS]: reviewsReducer,
  [CATALOG]: catalogReducer,
});

export default rootReducer;
