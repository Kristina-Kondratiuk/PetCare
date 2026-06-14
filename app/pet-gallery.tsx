import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    addPetPhotoFromDevice,
    fetchPetPhotos,
} from "@/features/petPhotos/petPhotosSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function PetGalleryScreen() {
  const dispatch = useAppDispatch();
  const { photos, isLoading, error } = useAppSelector(
    (state) => state.petPhotos
  );

  const { pets } = useAppSelector((state) => state.pets);
  const currentPet = pets[0];

  useEffect(() => {
    if (currentPet) {
      dispatch(fetchPetPhotos(currentPet.id));
    }
  }, [dispatch, currentPet]);

  const handleAddPhoto = async () => {
    if (!currentPet) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(
        addPetPhotoFromDevice({
          petId: currentPet.id,
          imageUri: result.assets[0].uri,
        })
      );
    }
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.backButton} onPress={() => router.back()}>
            ←
          </Text>
        </View>

        <Text style={styles.petName}>Luna</Text>

        <Pressable style={styles.addPhotoButton} onPress={handleAddPhoto}>
          <Text style={styles.addPhotoText}>
            {isLoading ? "Dodawanie..." : "+ Dodać zdjęcia zwierzęta"}
          </Text>
        </Pressable>

        <View style={styles.photosGrid}>
          {photos.length > 0 ? (
            photos.map((photo) => (
              <Image
                key={photo.id}
                source={{ uri: photo.photo_url }}
                style={styles.photo}
                resizeMode="cover"
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Brak zdjęć</Text>
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
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
    backgroundColor: "#ffffff",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  backButton: {
    fontSize: 32,
    color: "#0022FF",
  },

  petName: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 20,
  },

  addPhotoButton: {
    height: 49,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginBottom: 30,
    shadowColor: "#0022FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.52,
    shadowRadius: 2,
    elevation: 3,
  },

  addPhotoText: {
    fontFamily: "Inter",
    fontSize: 13,
    fontWeight: "500",
    color: "#000000",
  },

  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  photo: {
    width: "48%",
    height: 152,
    borderRadius: 16,
    backgroundColor: "#d9d9d9",
  },

  emptyText: {
    fontSize: 14,
    color: "#676767",
  },

  errorText: {
    color: "red",
    marginTop: 10,
  },
});
