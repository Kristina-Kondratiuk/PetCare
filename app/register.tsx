import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { clearAuthError, registerUser } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function Register() {
  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  const [image, setImage] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validatePassword = (value: string) => {
    const hasUppercase = /[A-Z]/.test(value);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(value);

    return (
      value.length >= 8 &&
      value.length <= 72 &&
      hasUppercase &&
      hasSpecialCharacter
    );
  };

  const handleRegister = async () => {
    setValidationError(null);
    dispatch(clearAuthError());

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setValidationError("Uzupełnij wymagane pola");
      return;
    }

    if (!validatePassword(password)) {
      setValidationError(
        "Hasło musi mieć 8-72 znaki, jedną wielką literę i jeden znak specjalny"
      );
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Podane hasła nie są zgodne");
      return;
    }

    const result = await dispatch(
      registerUser({
        email: email.trim(),
        password,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
      <Text style={styles.text}>Rejestracja</Text>

      <TouchableOpacity onPress={pickImage} style={styles.avatar}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarPlaceholder}>+</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.addPhotoText}>Dodaj zdjęcie</Text>

      <TextInput
        style={styles.input}
        placeholder="Imię"
        placeholderTextColor="#676767"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nazwisko"
        placeholderTextColor="#676767"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#676767"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        placeholderTextColor="#676767"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Powtórz hasło"
        placeholderTextColor="#676767"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {validationError && (
        <Text style={styles.errorText}>{validationError}</Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.textButton}>
          {isLoading ? "Rejestracja..." : "Zarejestruj się"}
        </Text>
      </TouchableOpacity>
      </KeyboardAwareScrollView>

      <LinearGradient
        colors={[
          "rgba(255,255,255,1)",
          "rgba(255,255,255,1)",
          "rgba(255,255,255,0.98)",
          "rgba(255,255,255,0.95)",
          "rgba(255,255,255,0.85)",
          "rgba(255,255,255,0.6)",
          "rgba(255,255,255,0)",
        ]}
        locations={[0, 0.2, 0.35, 0.5, 0.7, 0.85, 1]}
        style={styles.topFade}
        pointerEvents="none"
      />

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 95,
    zIndex: 999,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#0044FF",
    marginBottom: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#BDBDBD",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    fontSize: 44,
    color: "#ffffff",
  },
  addPhotoText: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
    color: "#000000",
  },
  input: {
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    height: 48,
    width: 335,
    borderRadius: 11,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0044FF",
    height: 56,
    width: 335,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  textButton: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    width: 335,
  },
});
