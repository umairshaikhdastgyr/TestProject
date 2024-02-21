import { apiModels } from "./apiModels";
import Config from "#config";

const { API_URL } = Config;
import { LocalStorage } from "#services";
import { Platform } from "react-native";

export const sendMessage = async (payload) => {
  return apiModels("messages/", "POST", payload);
};

export const updateConversations = async (conversationId) => {
  const tokens = await LocalStorage.getTokens();
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/messages/conversations/${conversationId}`, {
      method: "PATCH",
      headers: {
        Authorization: `bearer ${tokens.token}`,
        "x-api-key": Config.ApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        seen: true,
      }),
    })
      .then((res) => res.json())
      .then((res2) => {
        resolve(res2);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const receiveConversations = async (payload) => {
  return apiModels("messages/conversations", "GET", payload);
};
export const getConversations = async (conversationId) => {
  return apiModels(`messages/conversations/${conversationId}`, "GET");
};
export const ContactUs = async (
  subject,
  message,
  picsSelected,
  orderId,
  userId
) => {
  const tokens = await LocalStorage.getTokens();

  return new Promise((resolve, reject) => {
    let orderForm;
    let myOrderId;
    if (subject.value == "item_other") {
      orderForm = "other";
      myOrderId = "";
    } else {
      orderForm = "order";
      myOrderId = orderId;
    }
    const data = new FormData();
    data.append("userId", userId);
    data.append("reason", orderForm);
    data.append("subject", subject.value);
    data.append("text", message);
    data.append("images", picsSelected);
    data.append("orderId", myOrderId);
    fetch(`${API_URL}/messages/contactus`, {
      method: "POST",
      headers: {
        Authorization: `bearer ${tokens.token}`,
        "x-api-key": Config.ApiKey,
        "content-type": "multipart/form-data",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const EmailSend = async (userEmail) => {
  const tokens = await LocalStorage.getTokens();

  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/accounts/login/becomeSupplier`, {
      method: "POST",
      headers: {
        Authorization: `bearer ${tokens.token}`,
        "x-api-key": Config.ApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        params: {
          email: userEmail,
        },
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const MessageShow = async (userId, token) => {
  return new Promise((resolve, reject) => {
    fetch(
      `${API_URL}/messages/contactus?sort=createdAt-desc&userId=${userId}&page=1&perPage=100&isArchived=false`,
      {
        method: "GET",
        headers: {
          Authorization: `bearer ${token}`,
          "x-api-key": Config.ApiKey,
          "content-type": "multipart/form-data",
        },
      }
    )
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const SendMessage = async (
  usertoken,
  userId,
  contactUsId,
  message,
  picsSelected
) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("contactusId", contactUsId);
    formData.append("userId", userId);
    formData.append("text", message);
    if (picsSelected == "") {
      formData.append("images", "");
    } else {
      formData.append("images", {
        type: "image/png",
        uri:
          Platform.OS == "ios"
            ? `data:image/jpeg;base64,${picsSelected}`
            : picsSelected,
        name: `image.png`,
      });
    }
    fetch(`${API_URL}/messages/contactus/messages`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `bearer ${usertoken.token}`,
        "x-api-key": Config.ApiKey,
        "content-type": "multipart/form-data",
      },
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((res2) => {
        resolve(res2);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const SendReviewsImages = async (picsSelected, productId, userId) => {
  const tokens = await LocalStorage.getTokens();
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("userId", userId);
    if (picsSelected == "") {
      formData.append("image", "");
    } else {
      formData.append("image", {
        type: "image/png",
        uri: picsSelected,
        name: `image.png`,
      });
    }
    fetch(`${API_URL}/accounts/productReview/upload`, {
      method: "POST",
      headers: {
        Authorization: `bearer ${tokens.token}`,
        "x-api-key": Config.ApiKey,
        "content-type": "multipart/form-data",
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((res2) => {
        resolve(res2);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
