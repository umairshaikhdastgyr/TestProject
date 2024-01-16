import api from '../axiosInterceptor/api';

const api_key = '5d6b9887fd92d34784a5933f5d55c716'

export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await api.get(`/upcoming?api_key=${api_key}&page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const getMovieDetailes = async (movieId = 1) => {
  try {
    const response = await api.get(`/${movieId}?api_key=${api_key}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getMovieVideo = async (movieId = 1) => {
  try {
    const response = await api.get(`/${movieId}/videos?api_key=${api_key}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}


