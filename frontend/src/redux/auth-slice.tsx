import { createSlice } from "@reduxjs/toolkit";

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
  isLoggedIn: storedData?.token || false,
  token: storedData?.token || null,
};

const authSlice = createSlice({
  name: "Auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      const new_state = {
        isLoggedIn: true,
        token: action.payload.token,
      };

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("expiresAt", action.payload.expiresAt);

      return new_state;
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");

      return { isLoggedIn: false, token: null };
    },
  },
});

export const authActions = authSlice.actions;
export const authReducers = authSlice.reducer;
