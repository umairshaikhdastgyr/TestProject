import { all } from 'redux-saga/effects';

import CategoriesSagas from '#modules/Categories/sagas';
import PostsSagas from '#modules/Posts/sagas';
import AuthSagas from '#modules/Auth/sagas';
import UserSagas from '#modules/User/sagas';
import SellSagas from '#modules/Sell/sagas';
import DeliverySagas from '#modules/Delivery/sagas';
import IdeasSagas from '#modules/Ideas/sagas';
import ChatSagas from '#modules/Chat/sagas';
import NotificationSagas from '#modules/Notifications/sagas';
import FiltersSagas from '#modules/Filters/sagas';
import OrdersSagas from '#modules/Orders/sagas';
import GeneralSagas from '#modules/General/sagas';
import ReviewsSagas from '#modules/ProductReview/sagas';
import CatalogSagas from '#modules/Catalog/sagas';

export default function* rootSaga() {
  yield all([
    CategoriesSagas(),
    PostsSagas(),
    AuthSagas(),
    SellSagas(),
    DeliverySagas(),
    IdeasSagas(),
    UserSagas(),
    ChatSagas(),
    NotificationSagas(),
    FiltersSagas(),
    OrdersSagas(),
    GeneralSagas(),
    ReviewsSagas(),
    CatalogSagas(),
  ]);
}
