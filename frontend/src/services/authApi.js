import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../store/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://10.48.20.107:8000/api/',
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
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetProfileQuery } = authApi;