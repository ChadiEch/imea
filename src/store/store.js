// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authentications/auth/authSlice'; // Adjust path based on your directory structure

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
