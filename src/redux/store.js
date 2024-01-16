import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TheMovieSlice from './slices/TheMovieSlice';
import OrientationSlice from './slices/OrientationSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['TheMovieSlice'], // Array of slice names to persist
  blacklist: ['OrientationSlice'], // Array of slice names to exclude from storage
};

const rootReducer = combineReducers({
  TheMovieSlice: TheMovieSlice,
  OrientationSlice: OrientationSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);