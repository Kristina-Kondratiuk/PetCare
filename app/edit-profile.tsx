import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { uploadProfilePhoto } from "@/features/profile/profileService";
import {
  fetchProfile,
  saveProfile as saveProfileThunk,
} from "@/features/profile/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function EditProfile() {
  const dispatch = useAppDispatch();
  const { profile, isLoading } = useAppSelector((state) => state.profile);
  const { user } = useAppSelector((state) => state.auth);

  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
      setImage(profile.photo_url);
    }
  }, [profile]);

  const pickImageFromGallery = async () => {
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

  const takePhotoWithCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Brak dostępu", "Aplikacja potrzebuje dostępu do kamery.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert("Dodaj zdjęcie", "Wybierz źródło zdjęcia", [
      {
        text: "Galeria",
        onPress: pickImageFromGallery,
      },
      {
        text: "Aparat",
        onPress: takePhotoWithCamera,
      },
      {
        text: "Anuluj",
        style: "cancel",
      },
    ]);
  };

  const handleSaveProfile = async () => {
    try {
      let photoUrl = profile?.photo_url ?? null;

      if (image && image !== profile?.photo_url) {
        photoUrl = await uploadProfilePhoto(image);
      }

      await dispatch(
        saveProfileThunk({
          first_name: firstName,
          last_name: lastName,
          photo_url: photoUrl,
        })
      ).unwrap();

      router.replace("/profile");
    } catch {
      Alert.alert("Błąd", "Nie udało się zapisać profilu.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MoveLeft size={36} color="#0044FF" strokeWidth={1.5} />
        </TouchableOpacity>

        <Text style={styles.title}>Ustawienia profilu</Text>
      </View>

      <TouchableOpacity style={styles.avatar} onPress={showImageOptions}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarPlaceholder}>+</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={showImageOptions}>
        <Text style={styles.addPhotoText}>Dodaj zdjęcie</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Imię</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Nazwisko</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={user?.email ?? ""}
        editable={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>
          {isLoading ? "Zapisywanie" : "Zapisz zmiany"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    marginTop: 50,
    marginBottom: 28,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: 50,
    fontSize: 24,
    fontWeight: "700",
    color: "#0044FF",
  },
  avatar: {
    width: 142,
    height: 142,
    borderRadius: 71,
    backgroundColor: "#E5E5E5",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,

    borderWidth: 3,
    borderColor: "#FFFFFF",

    shadowColor: "#0044FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.52,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 71,
  },
  avatarPlaceholder: {
    fontSize: 44,
    color: "#ffffff",
  },
  label: {
    fontSize: 15,
    color: "#676767",
    marginBottom: 5,
    marginLeft: 9,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: "#0044FF",
    borderRadius: 11,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#0044FF",
    fontWeight: "600",
  },
  button: {
    height: 52,
    borderRadius: 11,
    backgroundColor: "#0044FF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
  },
  addPhotoText: {
    textAlign: "center",
    fontSize: 15,
    color: "#000000",
    marginBottom: 14,
  },
});
