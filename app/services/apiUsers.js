import Config from '#config';
import {apiModels} from './apiModels';

const {API_URL} = Config;
import {LocalStorage} from '#services';
import axios from 'axios';
import {Platform} from 'react-native';
import {apiInstance} from './httpclient';

export async function getUserInfo({userId, params}) {
  return await apiModels(`accounts/users/${userId}`, 'GET', params);
}

export async function getUserAccountSettings({userId}) {
  return await apiModels(`accounts/userSettings/${userId}`, 'GET', null);
}

export async function updateUserAccountSettings({userId, params}) {
  return await apiModels(`accounts/userSettings/${userId}`, 'POST', params);
}

export async function payoutBalance({userId, body}) {
  return await apiModels(`banking/accounts/${userId}/payouts`, 'POST', body);
}

export async function getPayouts({userId, body}) {
  return await apiModels(`banking/accounts/${userId}/payouts`, 'GET', body);
}

export async function recoverAmount({userId, body}) {
  return await apiModels(`banking/accounts/${userId}/recover`, 'POST', body);
}

export async function sendUserReport({body, reportType}) {
  let url = 'accounts/reportUser';

  switch (reportType) {
    case 'Report Review':
      url = 'accounts/reportReview/';
      break;
    case 'Report Listing':
      url = 'catalog/reportItem/';
      break;
    default:
      url = 'accounts/reportUser';
      break;
  }

  return await apiModels(url, 'POST', body);
}

export async function sendUserBlock(body) {
  return await apiModels('accounts/blockUser', 'POST', body);
}

export async function getPaymentMethods({userId, type}) {
  if (userId) {
    const url =
      type === 'card'
        ? `banking/customers/${userId}/cards`
        : `banking/accounts/${userId}/bankAccounts`;
    return await apiModels(url, 'GET', null);
  }
}

export async function createStripeAccount({
  userId,
  type,
  method,
  body,
  cardId,
  bankAccountId,
}) {
  const url = `banking/accounts`;
  return await apiModels(url, method, body);
}

export async function getStripeAccount({userId}) {
  return await apiModels(`banking/accounts/${userId}`, 'GET', {});
}

export async function updateStripeAccount(userId, param) {
  return await apiModels(`banking/accounts/${userId}`, 'PATCH', param);
}

export async function updatePaymentMethod({
  userId,
  type,
  method,
  body,
  cardId,
  bankAccountId,
}) {
  if (userId) {
    const url =
      type === 'card'
        ? method === 'POST'
          ? `banking/customers/${userId}/cards`
          : `banking/customers/${userId}/cards/${cardId}`
        : method === 'POST'
        ? `banking/accounts/${userId}/bankAccounts`
        : `banking/accounts/${userId}/bankAccounts/${bankAccountId}`;

    return await apiModels(url, method, body);
  }
}

export async function updateDefaultBankAccount({
  userId,
  method,
  body,
  bankAccountId,
}) {
  const url = `banking/accounts/${userId}/bankAccounts/${bankAccountId}/default`;
  return await apiModels(url, method, {});
}

export async function getUserAccountBalance({userId}) {
  if (userId) {
    return await apiModels(`banking/accounts/${userId}/balance`, 'GET', null);
  }
}

export const getUserIdDetail = async ({userId}) => {
  return apiModels(`banking/accounts/${userId}/ability`, 'GET', null);
};

export const getUserIdStripeLink = async ({userId}) => {
  return apiModels(`banking/accounts/${userId}/link`, 'GET', null);
};

export async function getUserValidCards({userId}) {
  if (userId) {
    return await apiModels(
      `banking/customers/${userId}/validCards`,
      'GET',
      null,
    );
  }
}

export async function getUserNotificationSettings({userId}) {
  return await apiModels(`notifications/userSettings/${userId}`, 'GET', null);
}

export async function updateUserNotificationSettings({userId, params}) {
  return await apiModels(`notifications/userSettings/${userId}`, 'POST', {
    params,
  });
}

export const getUserBuyProducts = async ({type, userId, page}) => {
  // apiModels('orders/orders', 'GET', params, null);
  try {
    const data = await apiInstance.get(
      `orders/v2/orders?type=${type}&userId=${userId}&page=${page}&perPage=20`,
    );
    return data?.data;
  } catch (error) {}
};

export const getUserPendingProducts = async ({type, userId, page}) =>
  // apiModels('orders/orders', 'GET', params, null);
  apiModels(
    `orders/v2/orders?type=${type}&userId=${userId}&page=${page}&perPage=20`,
    'GET',
    null,
  );

export const getUserSellProducts = async ({type, userId, page}) => {
  // apiModels('catalog/posts', 'GET', params, null);
  // apiModels(`orders/v2/orders?type=${type}&userId=${userId}&page=${page}&perPage=20`, "GET", null);
  try {
    const data = await apiInstance.get(
      `catalog/sell/posts?page=${page}&perPage=20&userId=${userId}`,
    );
    return data?.data;
  } catch (error) {
    return error;
  }
};
// export const getUserReviews = async ({ userId, params }) => {
//   return apiModels(`accounts/users/${userId}/review`, "GET", params, null);
// };\

export const getFollowerDetail = async ({userId, userToGet}) =>
  apiModels(
    `accounts/users/${userToGet}?followedUser=${userId}`,
    'GET',
    null,
    null,
  );

export const getUserFollowers = async userID =>
  apiModels(`accounts/users/${userID}/followers`, 'GET', null, null);

export const getUserFollowing = async userID =>
  apiModels(`accounts/users/${userID}/follow`, 'GET', null, null);

export const getUserReview = async ({userID, param}) =>
  apiModels(`accounts/users/${userID}/review`, 'GET', param, null);

export const followUser = async ({userID, userToFollow}) =>
  apiModels(
    `accounts/users/${userID}/follow/${userToFollow}`,
    'POST',
    null,
    null,
  );

export const unfollowUser = async ({userID, userToFollow}) =>
  apiModels(
    `accounts/users/${userID}/follow/${userToFollow}`,
    'DELETE',
    null,
    null,
  );

export async function uploadIDPhoto(base64, userId, type) {
  const tokens = await LocalStorage.getTokens();

  let params;
  return new Promise((resolve, reject) => {
    if (type === 0) {
      params = {
        validationPicUrlId: 'data:image/jpeg;base64,' + base64,
      };
    } else if (type === 1) {
      params = {
        validationPicUrlUser: 'data:image/jpeg;base64,' + base64,
      };
    }

    axios
      .patch(
        `${API_URL}/accounts/users/${userId}`,
        {
          params,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'content-type': 'application/json',
            'x-api-key': Config.ApiKey,
            Authorization: tokens.token,
          },
        },
      )
      .then(resp => {
        resolve(resp.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export const getAddressList = async userId =>
  apiModels(`accounts/users/${userId}/address`, 'GET');

export const addAddress = async (userId, params) =>
  apiModels(`accounts/users/${userId}/address`, 'POST', params);

export const updateAddress = async (userId, addressId, params) =>
  apiModels(`accounts/users/${userId}/address/${addressId}`, 'PATCH', params);

export const deleteAddress = async (userId, addressId) =>
  apiModels(`accounts/users/${userId}/address/${addressId}`, 'DELETE');

export const leaveReview = async (userId, params) =>
  apiModels(`accounts/users/${userId}/review`, 'POST', params);

export const uploadClaimImage = async (fileURI, buyerId, orderId) => {
  const data = new FormData();
  data.append('buyerId', buyerId);
  data.append('orderId', orderId);
  data.append('imageFile', {
    uri: Platform.OS == 'ios' ? 'file://' + fileURI : fileURI,
    name: 'image.jpg',
    type: 'image/jpeg',
  });
  const tokens = await LocalStorage.getTokens();
  return await fetch(`${API_URL}/orders/returnImage`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      'x-api-key': Config.ApiKey,
      Authorization: tokens.token,
    },
    method: 'POST',
    body: data,
  })
    .then(res => res.json())
    .catch(error => {
      console.log(error);
    });
};

export const removeClaimImage = async key => {
  const tokens = await LocalStorage.getTokens();
  const data = {key: key};
  return await apiModels(`/orders/returnImage`, 'DELETE', data);
  // return fetch(`${API_URL}/orders/returnImage`, {
  //   method: "DELETE",
  //   headers: {
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "multipart/form-data",
  //       "x-api-key": Config.ApiKey,
  //       Authorization: tokens.token,
  //     },
  //   },
  //   body: JSON.stringify({ key }),
  // }).then((res) => res.json());
};

export async function getBoostPackages() {
  const url = `boosts/boostPackages`;
  return await apiModels(url, 'GET', null);
}

export async function getUserBoostPackage(userId) {
  const url = `boosts/boosts?userId=${userId}`;
  return await apiModels(url, 'GET', null);
}

export async function boostPurchase(params) {
  const url = `boosts/boosts`;
  return await apiModels(url, 'POST', params);
}

export async function boostPurchaseSuccess(params) {
  const url = `boosts/boostUse`;
  return await apiModels(url, 'POST', params);
}

export async function deleteUserAccount(userId) {
  return await apiModels(`accounts/users/${userId}`, 'DELETE', null);
}

export async function reactiveUserAccount(params) {
  return await apiModels('accounts/users/reinst', 'POST', {params: params});
}
