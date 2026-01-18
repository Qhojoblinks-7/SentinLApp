import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../store/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://10.99.140.107:8000/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    console.log('Auth API Token:', token);
    if (token) {
      headers.set('authorization', `Token ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: 'register/',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ token: data.token, user: data.user }));
        } catch (error) {
          // Handle error
        }
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login/',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Login data:', data);
          dispatch(setCredentials({ token: data.token, user: data.user }));
        } catch (error) {
          console.log('Login error:', error);
          // Handle error
        }
      },
    }),
    getProfile: builder.query({
      query: () => {
        console.log('Retrieving profile data');
        return 'profile/';
      },
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
    registerPushToken: builder.mutation({
      query: (token) => ({
        url: 'register-push-token/',
        method: 'POST',
        body: { push_token: token },
      }),
    }),
    toggleSicknessMode: builder.mutation({
      query: () => ({
        url: 'toggle-sickness-mode/',
        method: 'POST',
      }),
    }),
    voiceChat: builder.mutation({
      query: (audioFile) => ({
        url: 'voice-chat/',
        method: 'POST',
        body: audioFile, // FormData
      }),
    }),
    textChat: builder.mutation({
      query: (message) => ({
        url: 'text-chat/',
        method: 'POST',
        body: { message },
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetProfileQuery, useRegisterPushTokenMutation, useToggleSicknessModeMutation, useVoiceChatMutation, useTextChatMutation } = authApi;