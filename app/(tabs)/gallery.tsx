import { fetchPets } from "@/features/pets/petsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const previewPhotos = [1, 2, 3, 4];

export default function GalleryScreen() {
  const dispatch = useAppDispatch();
  const { pets } = useAppSelector((state) => state.pets);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Galeria zdjęć</Text>

        <View style={styles.addPhotoButton}>
          <Text style={styles.addPhotoText}>+ Dodać zdjęcia zwierzęta</Text>
        </View>

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
              {previewPhotos.map((photo) => (
                <View key={photo} style={styles.photo} />
              ))}
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
    height: 49,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
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
});
