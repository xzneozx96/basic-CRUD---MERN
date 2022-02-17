import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { authReducers } from "./auth-slice";
import { usersReducers } from "./users-slice";

const store = configureStore({
  reducer: {
    auth: authReducers,
    users: usersReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // allow Non-Serializable Data
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export const useStoreDispatch = () => useDispatch<StoreDispatch>();
export default store;
