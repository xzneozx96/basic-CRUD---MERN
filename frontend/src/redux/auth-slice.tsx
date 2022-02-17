import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../api/api";
import jwt_decode from "jwt-decode";

const getStoredData = () => {
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt") || "";

  return { token, expiresAt };
};

const storedData = getStoredData();

const initialAuthState = {
  isLoggedIn: storedData?.token ? true : false,
  token: storedData?.token || null,
};

export const login = createAsyncThunk(
  "/auth/login",
  async (
    user_input: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post<{ access_token: string }>(
        `/auth/login`,
        user_input
      );

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const register = createAsyncThunk(
  "/auth/register",
  async (
    user_input: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`/auth/register`, user_input);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const logout = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get<{ access_token: string }>(`/auth/logout`);
    } catch (err: any) {
      return rejectWithValue("Internal Server Error");
    }
  }
);

export const refreshToken = createAsyncThunk(`auth/refreshToken`, async () => {
  const res = await axios.get<{ access_token: string }>(`auth/refreshToken`);
  return res.data.access_token;
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      let access_token = action.payload.access_token;

      state.isLoggedIn = true;
      state.token = access_token;

      // get expiration from decoded token
      const decoded_token =
        jwt_decode<{ username: string; exp: number }>(access_token);

      const expires_at = new Date(decoded_token.exp * 1000).toISOString();

      localStorage.setItem("token", access_token);
      localStorage.setItem("expiresAt", expires_at);
    });

    builder.addCase(logout.fulfilled, (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");

      state.isLoggedIn = false;
      state.token = null;
    });

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
