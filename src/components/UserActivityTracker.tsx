import React from "react";
import { View, ViewProps } from "react-native";
import { useAutoLock } from "../hooks/useAutoLock";

interface UserActivityTrackerProps extends ViewProps {
  children: React.ReactNode;
}

export const UserActivityTracker: React.FC<UserActivityTrackerProps> = ({
  children,
  ...props
}) => {
  const { resetInactivityTimer } = useAutoLock();

  return (
    <View {...props} onTouchStart={resetInactivityTimer}>
      {children}
    </View>
  );
};
