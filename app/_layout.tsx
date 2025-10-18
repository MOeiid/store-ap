import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AppProviders } from "@/src/components/AppProviders";
import { LockScreen } from "@/src/components/LockScreen";
import { UserActivityTracker } from "@/src/components/UserActivityTracker";
import { useAppSelector } from "@/src/hooks/redux";
import { LoginScreen } from "@/src/screens/LoginScreen";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppContent() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLocked } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <LoginScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <UserActivityTracker style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
        <LockScreen visible={isLocked} />
      </UserActivityTracker>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
