import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { eventApi } from "./api/eventApi"; // Ensure the correct path
import userReducer from "../features/userSlice";
import eventReducer from "../features/eventSlice";

export const store = configureStore({
  reducer: {
    auth: userReducer,
    event: eventReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer, // Add eventApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      userApi.middleware,
      eventApi.middleware,
    ]), // Add eventApi middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
