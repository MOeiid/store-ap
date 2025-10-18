import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../types";

const initialState: AppState = {
  isOnline: true,
  lastSyncTime: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    updateLastSyncTime: (state) => {
      state.lastSyncTime = Date.now();
    },
  },
});

export const { setOnlineStatus, updateLastSyncTime } = appSlice.actions;
export default appSlice.reducer;
