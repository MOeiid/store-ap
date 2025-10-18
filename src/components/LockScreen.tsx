import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { unlockApp } from "../store/authSlice";
import { biometricUtils } from "../utils/biometric";

interface LockScreenProps {
  visible: boolean;
}

export const LockScreen: React.FC<LockScreenProps> = ({ visible }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);

    const result = await biometricUtils.authenticateWithFallback(
      "Unlock to access your store",
      () => setShowPasswordInput(true)
    );

    if (result.success) {
      dispatch(unlockApp());
    }

    setIsAuthenticating(false);
  };

  const handlePasswordAuth = () => {
    if (password.length > 0) {
      dispatch(unlockApp());
      setPassword("");
      setShowPasswordInput(false);
    } else {
      Alert.alert("Error", "Please enter a password");
    }
  };

  const handleUnlockPress = async () => {
    const isAvailable = await biometricUtils.isAvailable();
    if (isAvailable) {
      handleBiometricAuth();
    } else {
      setShowPasswordInput(true);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          {user?.image && (
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>👤</Text>
            </View>
          )}

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            {user?.firstName} {user?.lastName}
          </Text>

          {!showPasswordInput ? (
            <View style={styles.biometricSection}>
              <TouchableOpacity
                style={styles.unlockButton}
                onPress={handleUnlockPress}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.unlockIcon}>🔒</Text>
                    <Text style={styles.unlockText}>Tap to unlock</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.passwordSection}>
              <Text style={styles.passwordLabel}>Enter Password</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoFocus
                onSubmitEditing={handlePasswordAuth}
              />
              <TouchableOpacity
                style={styles.unlockButton}
                onPress={handlePasswordAuth}
              >
                <Text style={styles.unlockText}>Unlock</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowPasswordInput(false)}
              >
                <Text style={styles.backText}>Back to biometric</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 40,
  },
  biometricSection: {
    alignItems: "center",
  },
  unlockButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 160,
  },
  unlockIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  unlockText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  passwordSection: {
    width: "100%",
    alignItems: "center",
  },
  passwordLabel: {
    fontSize: 16,
    color: "white",
    marginBottom: 12,
  },
  passwordInput: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    width: "100%",
    marginBottom: 20,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  backText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
