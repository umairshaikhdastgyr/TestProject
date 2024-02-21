import { axiosClient } from "./axiosClient";
import Config from "#config";
const { API_URL } = Config;
export const apiInstance = axiosClient(API_URL);
