import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometricType?: LocalAuthentication.AuthenticationType[];
}

export const biometricUtils = {
  async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  },

  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    return await LocalAuthentication.supportedAuthenticationTypesAsync();
  },

  async authenticate(reason?: string): Promise<BiometricResult> {
    try {
      const isAvailable = await this.isAvailable();

      if (!isAvailable) {
        return {
          success: false,
          error: "Biometric authentication is not available on this device",
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason || "Please authenticate to unlock the app",
        fallbackLabel: "Use Password",
        cancelLabel: "Cancel",
      });

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || "Authentication failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  async authenticateWithFallback(
    reason?: string,
    onPasswordFallback?: () => void
  ): Promise<BiometricResult> {
    const result = await this.authenticate(reason);

    if (!result.success && onPasswordFallback) {
      Alert.alert(
        "Authentication Failed",
        "Biometric authentication failed. Would you like to use password instead?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Use Password",
            onPress: onPasswordFallback,
          },
        ]
      );
    }

    return result;
  },
};
