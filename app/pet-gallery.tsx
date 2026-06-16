import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { MoveLeft, Plus } from "lucide-react-native";
import { useEffect } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PetPhoto } from "@/features/petPhotos/petPhotosService";
import {
  addPetPhotoFromDevice,
  fetchPetPhotos,
  removePetPhoto,
} from "@/features/petPhotos/petPhotosSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function PetGalleryScreen() {
  const dispatch = useAppDispatch();
  const { photos, isLoading, error } = useAppSelector(
    (state) => state.petPhotos
  );

  const { petId, petName } = useLocalSearchParams<{
    petId: string;
    petName: string;
  }>();

  useEffect(() => {
    if (petId) {
      dispatch(fetchPetPhotos(petId));
    }
  }, [dispatch, petId]);

  const handleAddPhoto = async () => {
    if (!petId) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(
        addPetPhotoFromDevice({
          petId,
          imageUri: result.assets[0].uri,
        })
      );
    }
  };

  const handleDeletePhoto = (photo: PetPhoto) => {
    Alert.alert("Usunąć zdjęcie?", "Tej akcji nie można cofnąć.", [
      {
        text: "Anuluj",
        style: "cancel",
      },
      {
        text: "Usuń",
        style: "destructive",
        onPress: () => dispatch(removePetPhoto(photo)),
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MoveLeft size={36} color={"#0044ff"} strokeWidth={1.5} />
          </Pressable>

          <Text style={styles.petName}>{petName}</Text>
        </View>

        <Pressable style={styles.addPhotoButton} onPress={handleAddPhoto}>
          <View>
            <Plus size={22} color="#0044FF" strokeWidth={1.5} />
          </View>
          <Text style={styles.addPhotoText}>
            {isLoading ? "Dodawanie..." : "Dodać zdjęcie zwierzęta"}
          </Text>
        </Pressable>

        <View style={styles.photosGrid}>
          {photos.length > 0 ? (
            photos.map((photo) => (
              <Pressable
                key={photo.id}
                style={styles.photoWrapper}
                onLongPress={() => handleDeletePhoto(photo)}
              >
                <Image
                  source={{ uri: photo.photo_url }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              </Pressable>
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

  header: {
    position: "relative",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 1,
  },

  petName: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
  },

  addPhotoButton: {
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
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
    marginLeft: 5,
    fontWeight: "500",
    color: "#000000",
  },

  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  photoWrapper: {
    width: "48%",
    height: 152,
    borderRadius: 16,
    overflow: "hidden",
  },

  photo: {
    width: "100%",
    height: "100%",
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
