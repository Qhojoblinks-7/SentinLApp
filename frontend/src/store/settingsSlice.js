import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'settings',
  storage: AsyncStorage,
};

const initialState = {
  notifications: true,
  voiceCommands: true,
  nfcEnabled: false,
  darkMode: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setVoiceCommands: (state, action) => {
      state.voiceCommands = action.payload;
    },
    setNfcEnabled: (state, action) => {
      state.nfcEnabled = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const { setNotifications, setVoiceCommands, setNfcEnabled, setDarkMode } = settingsSlice.actions;

export default persistReducer(persistConfig, settingsSlice.reducer);