// TheMovieSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUpcomingMovies } from '../../services/WatchService';

export const getUpcoming = createAsyncThunk("TheMovieSlice/getUpcomingMovies", async (page) => {
  return await getUpcomingMovies(page);
});

export const TheMovieSlice = createSlice({
  name: 'TheMovieSlice',
  initialState: {
    upcomingMovies: [],
    status: 'idle',
    error: null,
  },
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUpcoming.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUpcoming.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const upcomingMovies = action.payload.results ?? []
        if(action.payload.page === 1){
          state.upcomingMovies = upcomingMovies;
        }else{
          state.upcomingMovies = [...state.upcomingMovies,...upcomingMovies];
        }
      })
      .addCase(getUpcoming.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = TheMovieSlice.actions;

export const SliceTheMovie = (state) => state.TheMovieSlice;

export default TheMovieSlice.reducer;
