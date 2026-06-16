import {
  addPetPhotoFromDevice,
  fetchAllPetPhotos,
} from "@/features/petPhotos/petPhotosSlice";
import { fetchPets } from "@/features/pets/petsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { Plus } from "lucide-react-native";
import { useCallback } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function GalleryScreen() {
  const dispatch = useAppDispatch();
  const { pets } = useAppSelector((state) => state.pets);
  const { photos, isLoading } = useAppSelector((state) => state.petPhotos);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchPets());
      dispatch(fetchAllPetPhotos());
    }, [dispatch])
  );

  const handleAddPhoto = async (petId: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      await dispatch(
        addPetPhotoFromDevice({
          petId,
          imageUri: result.assets[0].uri,
        })
      );

      dispatch(fetchAllPetPhotos());
    }
  };

  const handleSelectPetForPhoto = () => {
    if (pets.length === 0) {
      Alert.alert("Brak zwierząt", "Najpierw dodaj zwierzę.");
      return;
    }

    Alert.alert("Dodaj zdjęcie", "Wybierz zwierzę", [
      ...pets.map((pet) => ({
        text: pet.name,
        onPress: () => handleAddPhoto(pet.id),
      })),
      {
        text: "Anuluj",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Galeria zdjęć</Text>

        <Pressable
          style={styles.addPhotoButton}
          onPress={handleSelectPetForPhoto}
        >
          <View>
            <Plus size={22} color="#0044FF" strokeWidth={1.5} />
          </View>
          <Text style={styles.addPhotoText}>
            {isLoading ? "Dodawanie..." : "Dodać zdjęcie zwierzęta"}
          </Text>
        </Pressable>

        {pets.map((pet) => (
          <View key={pet.id} style={styles.galleryCard}>
            <View style={styles.galleryHeader}>
              <Text style={styles.petTitle}>{pet.name}</Text>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/pet-gallery",
                    params: {
                      petId: pet.id,
                      petName: pet.name,
                    },
                  })
                }
              >
                <Text style={styles.seeMore}>Zobaczyć więcej</Text>
              </Pressable>
            </View>

            <View style={styles.photosGrid}>
              {photos.filter((photo) => photo.pet_id === pet.id).length > 0 ? (
                photos
                  .filter((photo) => photo.pet_id === pet.id)
                  .slice(0, 4)
                  .map((photo) => (
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
          </View>
        ))}
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
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,
  },

  title: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 24,
  },

  addPhotoButton: {
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0022FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.52,
    shadowRadius: 2,
    marginBottom: 24,
  },

  addPhotoText: {
    fontFamily: "Inter",
    fontSize: 13,
    marginLeft: 5,
    fontWeight: "500",
    color: "#000000",
  },

  galleryCard: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
    padding: 10,
    paddingBottom: 20,
    marginBottom: 18,
    shadowColor: "#0022FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.52,
    shadowRadius: 2,
  },

  galleryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },

  petTitle: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },

  seeMore: {
    fontFamily: "Inter",
    fontSize: 11,
    fontWeight: "500",
    color: "#0022FF",
    textDecorationLine: "underline",
  },

  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
    marginTop: 10,
  },

  photo: {
    width: "48%",
    height: 142,
    borderRadius: 16,
    backgroundColor: "#d9d9d9",
    marginBottom: 10,
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
