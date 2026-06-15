import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { uploadPetProfilePhoto } from "@/features/petPhotos/petPhotosService";
import { editPet, fetchPets } from "@/features/pets/petsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LinearGradient } from "expo-linear-gradient";

export default function EditPetProfile() {
  const dispatch = useAppDispatch();
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { pets, isLoading } = useAppSelector((state) => state.pets);

  const pet = pets.find((item) => item.id === petId);

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  useEffect(() => {
    if (pet) {
      setImage(pet.photo_url ?? null);
      setName(pet.name ?? "");
      setType(pet.type ?? "");
      setBreed(pet.breed ?? "");
      setBirthDate(pet.birth_date ?? "");
      setWeight(pet.weight ?? "");
      setDescription(pet.notes ?? "");
    }
  }, [pet]);

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

  const savePetProfile = async () => {
    if (!pet) return;

    if (!name.trim() || !type.trim()) {
      Alert.alert("Brak danych", "Uzupełnij imię i typ pupila.");
      return;
    }

    try {
      let photoUrl = pet.photo_url;

      if (image && image !== pet.photo_url) {
        photoUrl = await uploadPetProfilePhoto(pet.id, image);
      }

      await dispatch(
        editPet({
          id: pet.id,
          updates: {
            photo_url: photoUrl,
            name: name.trim(),
            type: type.trim(),
            breed: breed.trim() || undefined,
            birth_date: birthDate.trim() || undefined,
            weight: weight.trim() || undefined,
            notes: description.trim() || undefined,
          },
        })
      ).unwrap();

      router.replace({
        pathname: "/pet-profile",
        params: { petId: pet.id },
      });
    } catch {
      Alert.alert("Błąd", "Nie udało się zapisać profilu pupila.");
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
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

        <Text style={styles.label}>Opis</Text>
        <TextInput
          style={[styles.input, styles.description]}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Imię</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Typ</Text>
        <TextInput style={styles.input} value={type} onChangeText={setType} />

        <Text style={styles.label}>Rasa</Text>
        <TextInput style={styles.input} value={breed} onChangeText={setBreed} />

        <Text style={styles.label}>Data urodzenia</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <Text style={styles.label}>Waga</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
        />

        <TouchableOpacity style={styles.button} onPress={savePetProfile}>
          <Text style={styles.buttonText}>
            {isLoading ? "Zapisywanie" : "Zapisz zmiany"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  addPhotoText: {
    textAlign: "center",
    fontSize: 15,
    color: "#000000",
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: "#676767",
    marginBottom: 5,
    marginLeft: 9,
  },
  input: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: "#0044FF",
    borderRadius: 11,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#0044FF",
    fontWeight: "600",
  },
  description: {
    minHeight: 80,
    maxHeight: 170,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: "top",
  },
  button: {
    minHeight: 52,
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
});
