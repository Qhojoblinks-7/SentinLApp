import { configureStore } from '@reduxjs/toolkit';
import { tasksApi } from '../services/tasksApi';
import { authApi } from '../services/authApi';
import authSlice from './authSlice';

export const store = configureStore({
  reducer: {
    [tasksApi.reducerPath]: tasksApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authSlice,
    // Add other slices here (e.g., identity score)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware, authApi.middleware),
});