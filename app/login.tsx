import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { clearAuthError, loginUser } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Login() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logowanie</Text>

      <TextInput
        style={styles.input}
        placeholder="Login"
        placeholderTextColor="#676767"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          dispatch(clearAuthError());
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Hasło"
        placeholderTextColor="#676767"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          dispatch(clearAuthError());
        }}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.textButton}>
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0044FF",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    height: 56,
    width: 335,
    borderRadius: 11,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#0044FF",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#0044FF",
    height: 56,
    width: 335,
    borderRadius: 11,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    fontSize: 19,
    color: "#ffffff",
    fontWeight: "600",
  },
  registerText: {
    fontSize: 16,
    color: "#000000",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});
