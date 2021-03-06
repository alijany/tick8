// Import the RTK Query methods from the React-specific entry point
import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      console.warn({ type: action.type, body: action.payload || action.error })
    }
    return next(action)
  }

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({
    baseUrl: window.location.origin,
  }),
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({})
})