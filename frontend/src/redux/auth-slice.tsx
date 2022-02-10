import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../api/api";

const calculateDurationSession = (expiresAt: string) => {
  const now = new Date().getTime();
  const expires_at = new Date(expiresAt).getTime();

  const remaining_time = expires_at - now;
  return remaining_time;
};

const getStoredData = () => {
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt") || "";

  const remaining_time = calculateDurationSession(expiresAt);
  if (remaining_time <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");

    return null;
  } else {
    return { token: token, expiresAt: expiresAt };
  }
};

const storedData = getStoredData();

const initialAuthState = {
  isLoggedIn: storedData?.token ? true : false,
  token: storedData?.token || null,
};

export const refreshToken = createAsyncThunk(`auth/refreshToken`, async () => {
  const res = await axios.get<{ access_token: string }>(`auth/refreshToken`);
  return res.data.access_token;
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("expiresAt", action.payload.expiresAt);
    },

    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");

      state.isLoggedIn = false;
      state.token = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      const new_token = action.payload;

      localStorage.setItem("token", new_token);
      state.isLoggedIn = true;
      state.token = new_token;
    });
  },
});

export const authActions = authSlice.actions;
export const authReducers = authSlice.reducer;
