import { apiModels, apiBlobModels } from "./apiModels";

/**
 * @description Get tax estimation for an item
 *
 * @param {String} sellerId
 * @param {Object} params
 */
export const getTaxEstimationOld = async (sellerId, params) => {
  return apiModels(`accounts/users/${sellerId}/calculateTax`, "POST", {
    params,
  });
};
export const getTaxEstimation = async (postid, params) => {
  return apiModels(`catalog/posts/${postid}/calculateTax`, "POST", {
    params,
  });
};

export const createOrder = async (payload) => {
  const method = payload.method ? "PATCH" : "POST";
  let url = "orders/orders";
  if (method === "PATCH") {
    url = `orders/orders/${payload.orderId}`;
  }
  return apiModels(url, method, payload);
};

export const getTransactions = async (payload) => {
  let url = `orders/orderTransactions`;
  return apiModels(url, "GET", payload);
};

// export const getTransactions = async (payload) => {
//   return apiModels(`banking/accounts/${payload?.userId}/histories?page=${payload?.page}&perPage=20`, "GET");
// };

export const confirmOrder = async (payload) => {
  const method = "POST";
  let url = `orders/orders/${payload.params.orderId}/confirm`;
  const confrimationPayload = {
    params: {
      paidStatus: true,
      paymentMethodId: payload.params.paymentMethodId,
    },
  };
  return apiModels(url, method, confrimationPayload);
};

export const orderAction = async ({ orderId, action, ...rest }) =>
  apiModels(`orders/orders/${orderId}/${action}`, "POST", {
    params: rest,
  });

export async function getOrders(params) {
  return apiModels("orders/orders", "GET", params);
}

export async function getOrderById({ orderId }) {
  return apiModels(`orders/orders/${orderId}`, "GET");
}

export async function getCheapestRate(payload) {
  return apiModels("orders/shipping/rate?provider=cheapest", "POST", payload);
}

export async function validateAddress({ provider, params }) {
  return apiModels(
    `orders/shipping/validateAddress?provider=${provider}`,
    "POST",
    { params }
  );
}

export async function getPackingSlip({ orderId, type }) {
  return apiBlobModels(`orders/orders/${orderId}/packing?type=${type}`, "GET");
}

export async function getReturnRequest({ returnId }) {
  return apiModels(`orders/returns/${returnId}`, "GET");
}

export async function updateReturn({ returnId, params }) {
  return apiModels(`orders/returns/${returnId}`, "PATCH", { params });
}

export async function getReturnReason({ action }) {
  return apiModels(`orders/${action}`, "GET");
}

export async function getShippingLabel({ provider, params }) {
  return apiModels(`orders/shipping/label?provider=${provider}`, "POST", {
    params,
  });
}

export async function returnOrderUpdate({ orderId, params, action }) {
  return apiModels(`orders/orders/${orderId}/${action}`, "POST", { params });
}
export async function getCompletedOrders({ postId }) {
  return apiModels(
    `orders/orders?postId=${postId}&status=transactioncomplete`,
    "GET"
  );
}

export const setMeetup = async (payload) =>
  apiModels(`orders/orders/${payload.orderId}/meetup`, "PUT", payload);

export async function orderExchange({ orderId }) {
  const res = await apiModels(`orders/orders/${orderId}/exchange`, "POST");
  return res;
}

export async function getCardDetailById({ cardId, userId }) {
  if(userId){

    const res = await apiModels(
      `banking/customers/${userId}/cards/${cardId}`,
      "GET"
      );
      return res;
  }
}

export async function shippingRate({ params, provider }) {
  return await apiModels(`orders/shipping/rate?provider=${provider}`, "POST", {
    params,
  });
}

export const claimRequest = async ({ orderId, params }) =>
  apiModels(`orders/orders/${orderId}/claimRequest`, "POST", { params });

export const raiseDisputeRequest = async ({ claimId, params }) =>
  apiModels(`orders/claimRequest/${claimId}/process`, "POST", { params });

export const returnRequest = async ({ orderId, params }) =>
  apiModels(`orders/orders/${orderId}/buyerRequest`, "POST", { params });

export const cancelReturnRequest = async ({ returnId, params }) =>
  apiModels(`orders/returns/${returnId}`, "POST", { params });

export const denyCancellationRequest = async ({ cancellationId, params }) =>
  apiModels(`orders/cancel/${cancellationId}/decline`, "PATCH", { params });

export const acceptCancellationRequest = async ({ cancellationId }) =>
  apiModels(`orders/cancel/${cancellationId}/accept`, "PATCH", {});

export const cancelClaimRequest = async ({ claimId, params }) =>
  apiModels(`orders/claimRequest/${claimId}/process`, "POST", { params });

export const updateOrder = async ({ orderId, params }) =>
  apiModels(`orders/orders/${orderId}`, "PATCH", { params });


export const shipOrder = async ({ orderId, params }) =>
  apiModels(`orders/orders/${orderId}/ship`, "POST", { params });

export const resendLabel = async ({ returnId }) =>
  apiModels(`orders/returns/${returnId}/sendLabel`, "POST", {});

export const closeReturn = async ({ returnId }) =>
  apiModels(`orders/orders/${returnId}/sellerRequest`, "POST", {
    params: {
      reasonCloseValue: "returnprocessedcustomerrefunded",
      statusCode: "closed",
    },
  });

export const checkIfFirstOrderPosted = async (userId) =>
  apiModels(`orders/has-sold/${userId}`, "GET", {});