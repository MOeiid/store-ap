import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { lockApp, updateActivity } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "./redux";

const INACTIVITY_TIMEOUT = 10000;

export const useAutoLock = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, lastActivity, isLocked } = useAppSelector(
    (state) => state.auth
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isAuthenticated && !isLocked) {
      dispatch(updateActivity());

      timeoutRef.current = setTimeout(() => {
        dispatch(lockApp());
      }, INACTIVITY_TIMEOUT);
    }
  }, [isAuthenticated, isLocked, dispatch]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivity;

        if (isAuthenticated && timeSinceLastActivity > INACTIVITY_TIMEOUT) {
          dispatch(lockApp());
        } else if (isAuthenticated && !isLocked) {
          resetInactivityTimer();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        if (isAuthenticated) {
          dispatch(lockApp());
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }

      appStateRef.current = nextAppState;
    },
    [isAuthenticated, lastActivity, isLocked, dispatch, resetInactivityTimer]
  );

  useEffect(() => {
    if (isAuthenticated && !isLocked) {
      resetInactivityTimer();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, isLocked, resetInactivityTimer]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleAppStateChange]);

  return { resetInactivityTimer };
};
