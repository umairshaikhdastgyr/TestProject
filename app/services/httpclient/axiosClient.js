import {handleApiError, handleRequest, handleResponse} from './clientHelper';

import Axios from 'axios';

export function axiosClient(baseURL) {
  const clientInstance = Axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      "x-api-key": "Api-Key 9e32712d-26c1-48a5-8fbf-66dfc1a7fa4e"
    },
  });

  clientInstance.interceptors.request.use(handleRequest);
  clientInstance.interceptors.response.use(handleResponse, handleApiError);

  return clientInstance;
}
