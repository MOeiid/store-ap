import { QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { useAppDispatch } from "../hooks/redux";
import { useAutoLock } from "../hooks/useAutoLock";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { store } from "../store";
import { restoreSession } from "../store/authSlice";
import { queryClient } from "../utils/queryClient";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();

  useNetworkStatus();

  useAutoLock();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return <>{children}</>;
};

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppInitializer>{children}</AppInitializer>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};
