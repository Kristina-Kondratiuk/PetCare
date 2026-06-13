import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.greeting}>Cześć, Magdalena!</Text>

        <Text style={styles.sectionTitle}>Moje zwierzęta:</Text>

        <View style={styles.petsContainer}>
          <View style={styles.petCard}>
            <Image
              source={{ uri: "https://placehold.co/60x60" }}
              style={styles.petImage}
            />
            <View>
              <Text style={styles.petName}>Miki</Text>
              <Text style={styles.petInfo}>Pies</Text>
              <Text style={styles.petInfo}>1 rok 4 miesiące</Text>
            </View>
          </View>

          <View style={styles.petCard}>
            <Image
              source={{ uri: "https://placehold.co/60x60" }}
              style={styles.petImage}
            />
            <View>
              <Text style={styles.petName}>Luna</Text>
              <Text style={styles.petInfo}>Kotka</Text>
              <Text style={styles.petInfo}>8 miesięcy</Text>
            </View>
          </View>
        </View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>Harmonogram spacerów</Text>

          <View style={styles.scheduleItem}>
            <View>
              <Text style={styles.scheduleItemTitle}>Rano</Text>
              <Text style={styles.scheduleItemText}>
                O 7:00, przypomnienie 10 min wcześniej
              </Text>
            </View>
            <View style={styles.checkbox} />
          </View>

          <View style={styles.scheduleItem}>
            <View>
              <Text style={styles.scheduleItemTitle}>Południe</Text>
              <Text style={styles.scheduleItemText}>
                O 13:00, przypomnienie 10 min wcześniej
              </Text>
            </View>
            <View style={styles.checkbox} />
          </View>

          <View style={styles.scheduleItem}>
            <View>
              <Text style={styles.scheduleItemTitle}>Wieczór</Text>
              <Text style={styles.scheduleItemText}>
                O 18:00, przypomnienie 10 min wcześniej
              </Text>
            </View>
            <View style={styles.checkbox} />
          </View>
        </View>

        <View style={styles.galleryContainer}>
          <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>Galeria zdjęć</Text>
            <Text style={styles.galleryArrow}>→</Text>
          </View>

          <View style={styles.addPhotoButton}>
            <Text style={styles.addPhotoText}>+ Dodaj zdjęcia zwierzęta</Text>
          </View>

          <Text style={styles.petGalleryTitle}>Luna</Text>

          <View style={styles.photosGrid}>
            <View style={styles.photoPlaceholder} />
            <View style={styles.photoPlaceholder} />
            <View style={styles.photoPlaceholder} />
            <View style={styles.photoPlaceholder} />
          </View>
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
      {/* <LinearGradient
        colors={[
          "rgba(255,255,255,1)",
          "rgba(255,255,255,0.7)",
          "rgba(255,255,255,0.3)",
          "rgba(255,255,255,0)",
        ]}
        style={styles.gradient}
      /> */}
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
    paddingBottom: 15,
  },

  greeting: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 50,
  },

  sectionTitle: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 15,
  },

  petsContainer: {
    flexDirection: "row",
    gap: 5,
  },

  petCard: {
    flex: 1,
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#ffffff",
    shadowColor: "#0022FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.52,
    shadowRadius: 4,
    elevation: 4,
  },

  petImage: {
    width: 54,
    height: 54,
    borderRadius: 11,
    backgroundColor: "#d9d9d9",
  },

  petName: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },

  petInfo: {
    fontFamily: "Inter",
    fontSize: 10,
    fontWeight: "500",
  },

  scheduleContainer: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
    marginTop: 40,
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowColor: "#0022FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.52,
    shadowRadius: 4,
    elevation: 4,
  },

  scheduleTitle: {
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "700",
    color: "#0022FF",
    marginLeft: 5,
    marginBottom: 30,
  },

  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 13,
    backgroundColor: "#ffffff",
    marginBottom: 13,
    paddingVertical: 18,
    paddingLeft: 13,
    paddingRight: 16,
    shadowColor: "#0022FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.52,
    shadowRadius: 4,
  },

  scheduleItemTitle: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 10,
  },

  scheduleItemText: {
    fontFamily: "Inter",
    fontSize: 13,
    fontWeight: "500",
    color: "#000000",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderColor: "#000000",
    borderWidth: 1,
  },

  galleryContainer: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
    marginTop: 40,
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowColor: "#0022FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.52,
    shadowRadius: 4,
    elevation: 4,
  },

  galleryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  galleryTitle: {
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "700",
    color: "#0022FF",
    marginLeft: 5,
  },

  galleryArrow: {},

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
    shadowRadius: 4,
    elevation: 4,
    marginTop: 30,
  },

  addPhotoText: {
    fontFamily: "Inter",
    fontSize: 13,
    fontWeight: "500",
    color: "#000000",
  },

  petGalleryTitle: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginTop: 30,
    marginBottom: 20,
  },

  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
    marginTop: 16,
  },

  photoPlaceholder: {
    flex: 1,
    height: 142,
    borderRadius: 16,
    backgroundColor: "#d9d9d9",
    marginBottom: 12,
  },
});
