import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogin } from "../hooks/api";
import { useAppSelector } from "../hooks/redux";
import type { LoginCredentials } from "../types/auth";
import { StorageKeys, storageUtils } from "../utils/storage";

interface LoginFormData {
  username: string;
  password: string;
  isSuperAdmin: boolean;
}

export const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
      isSuperAdmin: false,
    },
  });

  const loginMutation = useLogin();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showSuperAdminOption, setShowSuperAdminOption] = useState(false);

  const watchedUsername = watch("username");
  const watchedIsSuperAdmin = watch("isSuperAdmin");

  useEffect(() => {
    if (watchedUsername === "emilys" || watchedUsername === "michaelw") {
      setShowSuperAdminOption(true);
    } else {
      setShowSuperAdminOption(false);
    }
  }, [watchedUsername]);

  useEffect(() => {
    if (watchedIsSuperAdmin && watchedUsername) {
      storageUtils.setItem(StorageKeys.SUPERADMIN_USERNAME, watchedUsername);
    } else if (!watchedIsSuperAdmin) {
      storageUtils.removeItem(StorageKeys.SUPERADMIN_USERNAME);
    }
  }, [watchedIsSuperAdmin, watchedUsername]);

  const onSubmit = (data: LoginFormData) => {
    const credentials: LoginCredentials = {
      username: data.username,
      password: data.password,
    };

    loginMutation.mutate(credentials);
  };

  const fillDemoCredentials = (type: "user" | "admin") => {
    if (type === "user") {
      control._reset({
        username: "emilys",
        password: "emilyspass",
        isSuperAdmin: false,
      });
    } else {
      control._reset({
        username: "michaelw",
        password: "michaelwpass",
        isSuperAdmin: true,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🛍️ Store App</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="username"
            rules={{ required: "Username is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  placeholder="Enter your username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoComplete="username"
                />
                {errors.username && (
                  <Text style={styles.errorText}>
                    {errors.username.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoComplete="password"
                />
                {errors.password && (
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />

          {showSuperAdminOption && (
            <Controller
              control={control}
              name="isSuperAdmin"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => onChange(!value)}
                >
                  <View
                    style={[styles.checkbox, value && styles.checkboxChecked]}
                  >
                    {value && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Designate as Super Admin (can delete products)
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Demo Accounts:</Text>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillDemoCredentials("user")}
            >
              <Text style={styles.demoButtonText}>Emily (Regular User)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillDemoCredentials("admin")}
            >
              <Text style={styles.demoButtonText}>Michael (Super Admin)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  demoSection: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  demoButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  demoButtonText: {
    fontSize: 14,
    color: "#333",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
});
