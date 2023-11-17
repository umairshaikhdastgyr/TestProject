import axios from "axios";


const baseURL = 'https://dummyjson.com';

const api = axios.create({
  baseURL,
});

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getProducts = async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const searchProducts = async (searchText) => {
    try {
      const response = await api.get(`/products/search?q=${searchText}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getProduct = async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const addProducts = async (data) => {
    try {
      const response = await api.post(`/products/add`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };








