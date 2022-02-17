import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { authReducers } from "./auth-slice";
import { usersReducers } from "./users-slice";

import createsagaMiddleware from "@redux-saga/core";
import rootSaga from "../saga/rootSaga";

const sagaMiddleware = createsagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducers,
    users: usersReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // allow Non-Serializable Data
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export const useStoreDispatch = () => useDispatch<StoreDispatch>();
export default store;
