import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginResponse, User } from "../types/auth";
import { StorageKeys, storageUtils } from "../utils/storage";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isLocked: false,
  lastActivity: Date.now(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      const { accessToken, refreshToken, ...user } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.isLocked = false;

      storageUtils.setItem(StorageKeys.ACCESS_TOKEN, accessToken);
      storageUtils.setItem(StorageKeys.REFRESH_TOKEN, refreshToken);
      storageUtils.setObject(StorageKeys.USER_DATA, user);
      storageUtils.setNumber(StorageKeys.LAST_ACTIVITY, Date.now());
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.isLocked = false;

      storageUtils.removeItem(StorageKeys.ACCESS_TOKEN);
      storageUtils.removeItem(StorageKeys.REFRESH_TOKEN);
      storageUtils.removeItem(StorageKeys.USER_DATA);
      storageUtils.removeItem(StorageKeys.LAST_ACTIVITY);
    },
    restoreSession: (state) => {
      const token = storageUtils.getItem(StorageKeys.ACCESS_TOKEN);
      const userData = storageUtils.getObject<User>(StorageKeys.USER_DATA);
      const lastActivity = storageUtils.getNumber(StorageKeys.LAST_ACTIVITY);

      if (token && userData) {
        state.accessToken = token;
        state.user = userData;
        state.isAuthenticated = true;
        state.lastActivity = lastActivity || Date.now();
        state.isLocked = true;
      }
    },
    lockApp: (state) => {
      state.isLocked = true;
    },
    unlockApp: (state) => {
      state.isLocked = false;
      state.lastActivity = Date.now();
      storageUtils.setNumber(StorageKeys.LAST_ACTIVITY, Date.now());
    },
    updateActivity: (state) => {
      state.lastActivity = Date.now();
      storageUtils.setNumber(StorageKeys.LAST_ACTIVITY, Date.now());
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  restoreSession,
  lockApp,
  unlockApp,
  updateActivity,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
