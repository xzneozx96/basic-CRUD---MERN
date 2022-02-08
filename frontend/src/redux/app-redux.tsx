import { configureStore } from "@reduxjs/toolkit";
import { authReducers } from "./auth-slice";

// we configure our Store as following in case there is only 1 slice
// const store = configureStore({ reducer: foodStoreSlice.reducer });

// we configure our Store as following in case there are multiple slices
const store = configureStore({
  reducer: {
    // cart: cartReducers,
    auth: authReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
