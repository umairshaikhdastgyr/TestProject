import { apiModels } from "./apiModels";
import Config from "#config";
import { Geocoder, getMapObjectFromGoogleObj } from "#utils";

const { API_URL } = Config;
import { LocalStorage } from "#services";
import { Platform } from "react-native";
import { apiInstance } from "./httpclient";

export async function uploadPhoto(params) {
  return new Promise(async (resolve, reject) => {
    const data = new FormData();
    const image = {
      uri: params.fileURI,
      name: "image.jpg",
      type: "image/jpeg",
    };

    data.append("productImage", image);
    const tokens = await LocalStorage.getTokens();
    fetch(`${API_URL}/catalog/products/${params.productId}/images`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: tokens.token,
        "x-api-key": Config.ApiKey,
        "Content-Type": "multipart/form-data",
      },
      body: data,
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function uploadMultiPhoto(params) {
  return new Promise(async (resolve, reject) => {
    const data = new FormData();

    for (let i = 0; i < params.photosList.length; i++) {
      let fileURI = "";
      if (params.photosList[i].type === "taken-photo") {
        if (Platform.OS === "ios") {
          fileURI = `data:image/jpeg;base64,${params.photosList[i].image}`;
        } else {
          fileURI = params.photosList[i].uri;
        }

      } else if (Platform.OS === "ios") {
        fileURI = params.photosList[i].image;
      } else {
        fileURI = params.photosList[i].uri;
      }

      const image = {
        uri: fileURI,
        name: "image.jpg",
        type: "image/jpeg",
      };

      data.append("productImage", image);
    }

    const tokens = await LocalStorage.getTokens();
    fetch(`${API_URL}/catalog/products/${params.productId}/multiple-images`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: tokens.token,
        "x-api-key": Config.ApiKey,
        "Content-Type": "multipart/form-data",
      },
      body: data,
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function generateBlob(base64URL) {
  return new Promise((resolve, reject) => {
    fetch(base64URL)
      .then((response) => response.blob())
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export async function getPosts(payload) {
  if (payload.v2) {
    delete payload.userId;
  }
  // if(payload.lat && payload.lng){
  //   const res = await Geocoder.from(
  //     payload.lat,
  //     payload.lng
  //   );
  //   const findLocation = getMapObjectFromGoogleObj(res.results[0]);
  //   payload.location = findLocation?.postalCode+','+findLocation?.country+','+findLocation?.state;
  // }
  return apiModels(
    `catalog/v2/posts?${new URLSearchParams(payload).toString()}`,
    "GET"
  );
}
export async function getMinimumShippingRate({ shippingCost }) {
  return apiModels(
    "orders/shipping/minPriceAllowed?shippingCost=" + shippingCost,
    "GET"
  );
}

export async function getEstimateTime() {
  return apiModels("catalog/posts/getEstimates", "GET");
}

export const getPostDetail = async (payload) => {
  return apiModels(`catalog/posts/${payload.postId}`, "GET", payload.params);
};

export const getPostDetailData = async (payload) => {
  try {
    const data = await apiInstance.get(
      `catalog/posts/${payload.postId}`,payload.params
    );
    return data?.data;
  } catch (error) {
    return error;
  }
};

export const getSnapshotDetail = async (payload) => {
  return apiModels(`catalog/posts/${payload.orderId}/snapshot`, "GET");
};

export const repostItem = async ({ postId }) => {
  return apiModels(`catalog/posts/${postId}/repost`, "POST", {});
};
export const reactivateItem = async ({ postId }) => {
  return apiModels(`catalog/posts/${postId}/reactivate`, "POST", {});
};
export const createProduct = async (payload) => {
  return apiModels("catalog/products/", "POST", payload);
};

export const updateProduct = async (payload) => {
  return apiModels(`catalog/products/${payload.productId}`, "PATCH", payload);
};

export const deleteProduct = async (payload) => {
  return apiModels(`catalog/products/${payload.productId}`, "DELETE", payload);
};

export const createPost = async (payload) => {
  return apiModels("catalog/posts/", "POST", payload);
};

export const updatePost = async (payload) => {
  return apiModels(`catalog/posts/${payload.postId}`, "PATCH", payload);
};

export const updatePostImage = async (payload) => {
  return apiModels("catalog/products/images", "PATCH", payload);
};

export const deletePost = async (payload) => {
  return apiModels(`catalog/posts/${payload.postId}`, "DELETE", payload);
};

export const createImageToPost = async (payload) => {
  try {
    return uploadMultiPhoto(payload);
  } catch (e) {
    return {
      error: {
        e,
      },
    };
  }
};

export const deleteImageFromPost = async (payload) => {
  return new Promise(async (resolve, reject) => {
    const data = new FormData();
    data.append("maintainImages", payload.maintainImages);

    const tokens = await LocalStorage.getTokens();
    fetch(`${API_URL}/catalog/products/${payload.productId}/multiple-images`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: tokens.token,
        "x-api-key": Config.ApiKey,
        "Content-Type": "multipart/form-data",
      },
      body: data,
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
