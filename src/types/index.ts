export interface AppState {
  isOnline: boolean;
  lastSyncTime: number | null;
}

export interface RootState {
  auth: import("./auth").AuthState;
  app: AppState;
}
