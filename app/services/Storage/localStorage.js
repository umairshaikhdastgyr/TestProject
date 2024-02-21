import { setToken } from "#services/httpclient/clientHelper";
import Storage from "./storageModel";

class LocalStorage {
  static checkIfFirstOpen = async () => {
    let result = null;
    try {
      result = await Storage.getItem("FirstOpen");
    } catch (e) {
      console.info("e checkIntroScreen", e);
    }
    return result !== "true";
  };

  static setFirstOpened = async () => {
    await Storage.setItem("FirstOpen", "true");
  };

  static setUserInformation = async (user) => {
    try {
      await Storage.setJSON("UserInformation", user);
    } catch (e) {
      console.info("e saveUserInformation", e);
    }
  };

  static getUserInformation = async () => {
    let user = null;
    try {
      user = await Storage.getJSON("UserInformation");
    } catch (e) {
      console.info("e getUserInformation", e);
    }
    return user;
  };

  static clearUserInformation = async () => {
    try {
      await Storage.removeItem("UserInformation");
    } catch (e) {
      console.info("e getUserInformation", e);
    }
  };

  static setTokens = async (token, refresh_token) => {
    try {
      const tokens = {
        token,
        refresh_token,
      };
      setToken(tokens.token);
      await Storage.setJSON("tokens", tokens);
    } catch (e) {
      console.info("e saveRefreshToken", e);
    }
  };
  static setApiKey = async (key) => {
    try {
      const key = key;

      await Storage.setJSON("apiKey", key);
    } catch (e) {
      console.info("e saveRefreshToken", e);
    }
  };

  static getTokens = async () => {
    let tokens = null;
    try {
      tokens = await Storage.getJSON("tokens");
    } catch (e) {
      console.info("e getRefreshToken", e);
    }

    return tokens;
  };
  static getApiKey = async () => {
    let apiKey = null;
    try {
      apiKey = await Storage.getJSON("apiKey");
    } catch (e) {
      console.info("e getRefreshToken", e);
    }
    return "Api-Key 9e32712d-26c1-48a5-8fbf-66dfc1a7fa4e";
  };
  static clearStorage = async () => {
    try {
      await Storage.clearAll();
    } catch (e) {
      console.info("e clearStorage", e);
    }
  };

  static clearSignOut = async () => {
    try {
      await Storage.removeItem("tokens");
      await Storage.removeItem("UserInformation");
      await Storage.removeItem("ChatInfo");
      await Storage.removeItem("NotificationInfo");
    } catch (e) {
      console.info("e clearSignOut", e);
    }
  };

  static setRecentSearches = async (recentSearches) => {
    try {
      await Storage.setJSON("RecentSearches", recentSearches);
    } catch (e) {
      console.info("e setRecentSearches", e);
    }
  };

  static getRecentSearches = async () => {
    let user = null;
    try {
      user = await Storage.getJSON("RecentSearches");
    } catch (e) {
      console.info("e getRecentSearches", e);
    }
    return user;
  };

  static setChatData = async (chatInfo) => {
    try {
      await Storage.setJSON("ChatInfo", chatInfo);
    } catch (e) {
      console.info("e saveChatData", e);
    }
  };

  static getChatData = async () => {
    let chatInfo = null;
    try {
      chatInfo = await Storage.getJSON("ChatInfo");
    } catch (e) {
      console.info("e getChatData", e);
    }
    return chatInfo;
  };

  static setNotificationData = async (notificationInfo) => {
    try {
      await Storage.setJSON("NotificationInfo", notificationInfo);
    } catch (e) {
      console.info("e saveChatData", e);
    }
  };

  static getNotificationData = async () => {
    let notificationInfo = null;
    try {
      notificationInfo = await Storage.getJSON("NotificationInfo");
    } catch (e) {
      console.info("e getNotificationData", e);
    }
    return notificationInfo;
  };

  static setUserLastLocation = async (location) => {
    try {
      await Storage.setJSON("LastLocation", location);
    } catch (e) {
      console.info("error setUserLastLocation", e);
    }
  };

  static getUserLastLocation = async () => {
    let location = null;
    try {
      location = await Storage.getJSON("LastLocation");
    } catch (e) {
      console.info("e getUserLastLocation", e);
    }
    return location;
  };
}

export default LocalStorage;
