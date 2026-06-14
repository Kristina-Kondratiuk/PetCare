import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const photos = [1, 2, 3, 4, 5, 6];

export default function PetGalleryScreen() {
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

        <View style={styles.addPhotoButton}>
          <Text style={styles.addPhotoText}>+ Dodać zdjęcia zwierzęta</Text>
        </View>

        <View style={styles.photosGrid}>
          {photos.map((photo) => (
            <View key={photo} style={styles.photo} />
          ))}
        </View>
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
});
