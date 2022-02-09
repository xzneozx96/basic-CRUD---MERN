import { configureStore } from "@reduxjs/toolkit";
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
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["users/newUser/fulfilled"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
