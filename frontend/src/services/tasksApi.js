import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from '../store/store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://10.71.110.107:8000/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Token ${token}`);
    }
    return headers;
  },
});

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery,
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => 'tasks/',
      providesTags: ['Task'], // This allows "Auto-refreshing" when data changes
    }),
    getHistory: builder.query({
      query: () => 'history/',
      providesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `tasks/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Task'], // Automatically refetches the list after an update
    }),
    createTask: builder.mutation({
      query: (task) => ({
        url: 'tasks/',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const { useGetTasksQuery, useUpdateTaskMutation, useGetHistoryQuery, useCreateTaskMutation } = tasksApi;