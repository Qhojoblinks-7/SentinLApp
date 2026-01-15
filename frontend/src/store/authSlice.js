import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      console.log('setCredentials called:', { token, user });
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      AsyncStorage.setItem('token', token);
      AsyncStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
    loadCredentials: (state, action) => {
      const { token, user } = action.payload;
      console.log('loadCredentials called:', { token, user });
      state.token = token;
      state.user = user;
      state.isAuthenticated = !!token;
    },
  },
});

export const { setCredentials, logout, loadCredentials } = authSlice.actions;
export default authSlice.reducer;