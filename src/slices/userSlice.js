// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../constants/ApiController';

export const loginAsync = createAsyncThunk('user/loginAsync', async (credentials) => {
  const response = await loginUser(credentials);
  return response; 
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    userInfo: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        console.log("4353534534534543", action.payload);
        state.status = 'succeeded';
        state.isLoggedIn = true;
        state.userInfo = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed';
        alert(action.error.message)
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
