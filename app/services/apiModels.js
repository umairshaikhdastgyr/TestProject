import Config from "#config";
const { API_URL } = Config;
const controller = new AbortController();
const { signal } = controller;
import { LocalStorage } from "#services";
import crashlytics from '@react-native-firebase/crashlytics';
import * as Sentry from "@sentry/react-native";
import { apiErrorHandler } from "./apiErrorHandler";
export const apiModels = async (
  url,
  method,
  parameters,
  token,
  isFullUrl = false
) => {
  // console.log(
  //   url,
  //   "-----url---------",
  //   method,
  //   "--------method-----",
  //   JSON.stringify(parameters),
  //   "--------parameters-----"
  // );
  let ret = null;
  let queryURL = "";
  let params = {};
  let response = null;
  let count = 0;
  try {
    //Fetching JWT token which will be used for authorization
    const tokens = await LocalStorage.getTokens();
    queryURL = isFullUrl ? url : `${API_URL}/${url}`;
    // console.log("🚀 ~ file: apiModels.js:30 ~ queryURL", queryURL);
    const body = parameters ? JSON.stringify(parameters) : "";
    const headers = tokens
      ? {
          "Content-Type": "application/json",
          "x-api-key": Config.ApiKey,
          Authorization: tokens.token,
        }
      : {
          "Content-Type": "application/json",
          "x-api-key": Config.ApiKey,
        };
    if (token && token !== "") {
      headers.Authorization = token;
    }
    params = { headers, method };
    // console.log("🚀 ~ file: apiModels.js:46 ~ params", params);
    if (
      method.toUpperCase() === "POST" ||
      method.toUpperCase() === "PUT" ||
      method.toUpperCase() === "DELETE" ||
      method.toUpperCase() === "PATCH"
    ) {
      params.body = body;
    } else if (method.toUpperCase() === "GET" && parameters) {
      let inlineQuery = "?";
      Object.keys(parameters).forEach((key) => {
        inlineQuery += `${key}=${parameters[key]}&`;
      });
      queryURL += inlineQuery;
      if (url.startsWith("catalog/posts") && parameters.postStatus != "Draft") {
        queryURL = queryURL + "cheapest=true";
      }
    }
    response = await fetch(queryURL, params);
  
    ret = await response.json();
    if (url.includes("/follow") && method === "GET") {
      ret = {
        data: ret,
        status: response?.status,
      };
    } else if (url.includes("/followers") && method === "GET") {
      ret = {
        data: ret,
        status: response?.status,
      };
    } else if (url.includes("content/global") && method === "GET") {
      ret = {
        data: ret,
        status: response?.status,
      };
    } else {
      ret = ret.status ? { ...ret } : { ...ret, status: response?.status };
    }
    if (response?.status >= 400) {
    }
    if (response?.status == 500) {
      ret = { error: response?.statusText, success: false, errorCode: 500 };
    }
  } catch (err) {
    if (response?.status == 200) {
      ret = { success: true, status: response?.status };
    } else {
      ret = { error: true, success: false, errorCode: -1 };
      crashlytics().log(
        `API: ${queryURL} Error code: ${response?.status}`,
      );
      Sentry.captureException(err);
      apiErrorHandler(response);
    }
  }
  return ret;
};
export const apiBlobModels = async (
  url,
  method,
  parameters,
  token,
  isFullUrl = false
) => {
  let ret = null;
  let queryURL = "";
  let params = {};
  try {
    queryURL = isFullUrl ? url : `${API_URL}/${url}`;
    const body = parameters ? JSON.stringify(parameters) : "";
    // console.log('body===>', JSON.stringify(parameters));
    const headers = {
      "Content-Type": "application/json",
    };
    if (token && token !== "") {
      headers.authorization = token;
    }
    params = { headers, method };
    if (
      method.toUpperCase() === "POST" ||
      method.toUpperCase() === "PUT" ||
      method.toUpperCase() === "DELETE" ||
      method.toUpperCase() === "PATCH"
    ) {
      params.body = body;
    } else if (method.toUpperCase() === "GET" && parameters) {
      let inlineQuery = "?";
      Object.keys(parameters).forEach((key) => {
        inlineQuery += `${key}=${parameters[key]}&`;
      });
      queryURL += inlineQuery;
    }
    // params.signal = signal;
    // console.log("request result", queryURL, params, ret);
    if (__DEV__) {
      //  console.log('request result', queryURL, params, ret);
    }
    const response = await fetch(queryURL, params);
    ret = await response.blob();
    // console.log({ ret });
    if (response?.status >= 400) {
    }
  } catch (err) {
    if (__DEV__) {
      // console.log('err', queryURL, params, err);
    }
    ret = { error: true, success: false, errorCode: -1 };
  }
  return ret;
};
// Abort fetch in testing
export const abortFetch = async () => {
  controller.abort();
};
