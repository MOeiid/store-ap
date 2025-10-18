import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../hooks/redux";

export const OfflineIndicator = () => {
  const { isOnline } = useAppSelector((state) => state.app);

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📡 Offline - Cached data only</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF6B35",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});
