import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const StorageKeys = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  LAST_ACTIVITY: "last_activity",
  REACT_QUERY_CACHE: "react_query_cache",
  SUPERADMIN_USERNAME: "superadmin_username",
} as const;

export const storageUtils = {
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },

  getItem: (key: string): string | undefined => {
    return storage.getString(key);
  },

  removeItem: (key: string): void => {
    storage.delete(key);
  },

  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  getObject: <T>(key: string): T | null => {
    try {
      const data = storage.getString(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clear: (): void => {
    storage.clearAll();
  },

  setNumber: (key: string, value: number): void => {
    storage.set(key, value);
  },

  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },

  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, value);
  },

  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },
};
