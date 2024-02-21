import _ from "lodash";
import { apiModels } from "./apiModels";
import Config from "#config";
import axios from "axios";
const { API_URL } = Config;
import { LocalStorage } from "#services";
import crashlytics from "@react-native-firebase/crashlytics";
import * as Sentry from "@sentry/react-native";

let apiToken =
  "Q0bz1JzXjr1QtyuUFZrxZnXL3Plv9VtcR957itb7YqwIiOIahDo7tCHEIlN1ytE8";

const setApiToken = (token) => {
  apiToken = token;
};

export async function uploadPhoto(base64, userId, params) {
  const tokens = await LocalStorage.getTokens();

  return new Promise((resolve, reject) => {
    axios
      .patch(
        `${API_URL}/accounts/users/${userId}`,
        {
          params: {
            profilepictureurl: "data:image/jpeg;base64," + base64,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "content-type": "application/json",
            "x-api-key": Config.ApiKey,
            Authorization: tokens.token,
          },
        }
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const signUp = async (param) => {
  const res = await apiModels("accounts/users", "POST", param);
  const token = _.get(res, "token", null);
  setApiToken(token);
  return res;
};

export const profileSetup = async (param) => {
  try {
    const params = {
      phonenumber: param.phoneNumber,
      birthdate: param.birthDate,
      location: param.location,
      email: param.email,
    };
    return await uploadPhoto(param.userPhoto, param.userId, params);
  } catch (e) {
    console.info("e profileSetup", e);
    return {
      result: {
        content: {
          message: "Failure to update the profile setup",
        },
      },
    };
  }
};

export const updateProfile = async (param) => {
  try {
    const params = _.cloneDeep(param);
    if (param.userPhoto) {
      delete params.userPhoto;
    }
    //delete params.userId;
    if (param.userPhoto) {
      return await uploadPhoto(param.userPhoto, param.userId, params);
    }
    return await apiModels(
      `${API_URL}/accounts/users/${param.userId}`,
      "PATCH",
      { params },
      apiToken,
      true
    );
  } catch (e) {
    console.info("e profileSetup", e);
    return {
      result: {
        content: {
          message: "Failure to update the profile setup",
        },
      },
    };
  }
};

export const loginWithEmail = async (params) => {
  const res = await apiModels(
    "accounts/login",
    "POST",
    {
      params: {
        ...params,
        // origin: 'app',
        // adminMode: false
      },
    },
    null
  );
  const token = _.get(res, "token", null);
  setApiToken("token" + token);
  Sentry.setUser({
    id: res?.user?.id ?? "",
    email: res?.user?.email ?? "",
    username: res?.user?.name ?? "",
  });
  crashlytics().setUserId(res?.user?.id ?? "");
  crashlytics().setAttributes({
    email: res?.user?.email ?? "",
    username: res?.user?.name ?? "",
  });
  return res;
};

export async function getListingType() {
  return apiModels("catalog/listingTypes", "GET");
}

export const loginWithToken = async (params) =>
  await apiModels("authorization/token", "POST", params, null);

export const verifyCode = async (userID, type = "email", params) =>
  apiModels(
    `accounts/users/${userID}/verify/${type}`,
    "PATCH",
    { ...params, origin: "app" },
    null
  );

export const requestCode = async (param, userID, type = "email") =>
  apiModels(
    `accounts/users/${userID}/verify/${type}`,
    "POST",
    { ...param, origin: "app" },
    null
  );

export const forgotPassword = async (param) =>
  apiModels("accounts/login/forgotPassword", "POST", param, null);

export const validateCode = async (param) =>
  apiModels("accounts/login/validateCode", "POST", param, null);

export const resetPassword = async (userId, token, param) =>
  apiModels(
    `accounts/login/resetPassword/${userId}/${token}`,
    "POST",
    param,
    null
  );

export const getUserBalance = async (userID) => {
  if (userID) {
    const res = await apiModels(
      `banking/accounts/${userID}/balance`,
      "GET",
      null,
      null
    );
    if (res.error === "UserDetail not exists.") {
      return 0;
    }
    return 1;
  }
};

export const getUserProducts = async (type, userID) =>
  apiModels(`orders/orders?type=${type}&userId=${userID}`, "GET", null, null);

export const changePassword = async (userId, currentPassword, newPassword) =>
  apiModels(`accounts/users/${userId}/changePassword`, "PATCH", {
    params: {
      currentPassword,
      newPassword,
    },
  });
