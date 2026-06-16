import { addPetPhotoFromDevice } from "@/features/petPhotos/petPhotosSlice";
import { fetchPets } from "@/features/pets/petsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function CameraScreen() {
  const dispatch = useAppDispatch();
  const { pets } = useAppSelector((state) => state.pets);
  const hasOpenedCamera = useRef(false);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  const openCamera = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Brak dostępu", "Aplikacja potrzebuje dostępu do kamery.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      router.back();
      return;
    }

    const imageUri = result.assets[0].uri;

    if (pets.length === 0) {
      Alert.alert("Brak zwierząt", "Najpierw dodaj zwierzę.");
      return;
    }

    Alert.alert("Dodaj zdjęcie", "Wybierz zwierzę", [
      ...pets.map((pet) => ({
        text: pet.name,
        onPress: async () => {
          await dispatch(
            addPetPhotoFromDevice({
              petId: pet.id,
              imageUri,
            })
          );

          router.push({
            pathname: "/pet-gallery",
            params: {
              petId: pet.id,
              petName: pet.name,
            },
          });
        },
      })),
      {
        text: "Anuluj",
        style: "cancel",
        onPress: () => router.back(),
      },
    ]);
  }, [dispatch, pets]);

  useFocusEffect(
    useCallback(() => {
      if (!hasOpenedCamera.current) {
        hasOpenedCamera.current = true;
        openCamera();
      }

      return () => {
        hasOpenedCamera.current = false;
      };
    }, [openCamera])
  );

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});