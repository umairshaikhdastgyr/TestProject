import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestHeaders,
} from 'axios';

export const baseURL = 'https://api.themoviedb.org/3/movie'
export const imageURL = 'https://image.tmdb.org/t/p/w500'
// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: baseURL, // Your API base URL
});

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

// Request interceptor
api.interceptors.request.use(
  (config: AdaptAxiosRequestConfig) => {
    // You can modify the request config here
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can modify the response here
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default api;
