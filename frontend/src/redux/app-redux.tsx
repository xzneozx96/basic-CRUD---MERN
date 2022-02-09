import { configureStore } from "@reduxjs/toolkit";
import { authReducers } from "./auth-slice";
import { usersReducers } from "./users-slice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authReducers,
    users: usersReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // allow Non-Serializable Data
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "users/newUser/pending",
          "users/newUser/fulfilled",
          "users/newUser/rejected",
          "users/getAllUsers/pending",
          "users/getAllUsers/fulfilled",
          "users/getAllUsers/rejected",
          "users/updateUser/pending",
          "users/updateUser/fulfilled",
          "users/updateUser/rejected",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export const useStoreDispatch = () => useDispatch<StoreDispatch>();
export default store;
