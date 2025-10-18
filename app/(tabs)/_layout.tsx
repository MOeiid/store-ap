import { Tabs } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { useAppDispatch } from "@/src/hooks/redux";
import { logout } from "@/src/store/authSlice";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarLabelStyle: {
            marginTop: 6,
          },
          tabBarStyle: {
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "All Products",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="bag.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Smartphones",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="iphone" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="logout"
          options={{
            title: "Sign Out",
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={24}
                name="rectangle.portrait.and.arrow.right"
                color={color}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                onPress={handleLogout}
                style={props.style}
                accessibilityLabel="Sign Out"
                accessibilityRole="button"
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleLogout();
            },
          }}
        />
      </Tabs>

      <ConfirmationModal
        visible={showLogoutModal}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmStyle="destructive"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
