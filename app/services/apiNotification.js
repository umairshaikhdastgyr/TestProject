import { apiModels } from './apiModels';

export const sendToken = async (payload) => apiModels('notifications/endpoints', 'POST', payload);

export const getNotification = async (payload) => apiModels(`notifications/endpoints/${payload.userId}`, 'GET');

export const deleteEndPoint = async ({ userId, params }) => apiModels(
  `notifications/endpoints/${userId}?token=${params.token}`,
  'DELETE',
  params,
);

export const readNotification = async ({ messageId, params }) => apiModels(
  `notifications/endpoints/${messageId}/view`,
  'POST',
  params,
);
