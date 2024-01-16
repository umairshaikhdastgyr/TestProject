// OrientationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Orientation } from '../../utils';

export const OrientationSlice = createSlice({
  name: 'OrientationSlice',
  initialState: {
    orientation: Orientation.Portrait
  },
  reducers: {
    updateOrientation: (state, action) => {
      state.orientation = action.payload;
    },
  }
});

export const { updateOrientation } = OrientationSlice.actions;

export const SliceUpdateOrientation = (state) => state.OrientationSlice;

export default OrientationSlice.reducer;
