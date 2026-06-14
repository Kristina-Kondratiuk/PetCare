import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { fetchPets } from "@/features/pets/petsSlice";
import {
  editReminder,
  fetchReminders,
} from "@/features/reminders/remindersSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { pets, isLoading, error } = useAppSelector((state) => state.pets);
  const { reminders } = useAppSelector((state) => state.reminders);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  useEffect(() => {
    if (pets.length > 0) {
      dispatch(fetchReminders(pets[0].id));
    }
  }, [dispatch, pets]);

  const handleToggleReminder = (id: string, isCompleted?: boolean) => {
    dispatch(
      editReminder({
        id,
        updates: {
          is_completed: !isCompleted,
        },
      })
    );
  };

  const formatReminderTime = (date: string) => {
    return new Date(date).toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.greeting}>Cześć, Magdalena!</Text>

        <Text style={styles.sectionTitle}>Moje zwierzęta:</Text>

        {isLoading && <Text style={styles.petInfo}>Ładowanie...</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!isLoading && pets.length === 0 && (
          <Text style={styles.petInfo}>Nie dodano jeszcze zwierząt</Text>
        )}

        <View style={styles.petsContainer}>
          {pets.map((pet) => (
            <View key={pet.id} style={styles.petCard}>
              {pet.photo_url ? (
                <Image
                  source={{ uri: pet.photo_url }}
                  style={styles.petImage}
                />
              ) : (
                <View style={styles.petImage} />
              )}

              <View>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petInfo}>{pet.type}</Text>
                <Text style={styles.petInfo}>
                  {pet.breed || pet.birth_date || "Brak informacji"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>Harmonogram spacerów</Text>

          {reminders.length > 0 ? (
            reminders.map((reminder) => (
              <View key={reminder.id} style={styles.scheduleItem}>
                <View>
                  <Text style={styles.scheduleItemTitle}>{reminder.title}</Text>

                  <Text style={styles.scheduleItemText}>
                    {reminder.description ??
                      `O ${formatReminderTime(reminder.reminder_time)}`}
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.checkbox,
                    reminder.is_completed && styles.checkboxChecked,
                  ]}
                  onPress={() =>
                    handleToggleReminder(reminder.id, reminder.is_completed)
                  }
                >
                  {reminder.is_completed && (
                    <Text style={styles.checkboxCheck}>✓</Text>
                  )}
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={styles.scheduleItemText}>Brak przypomnień</Text>
          )}
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
    shadowRadius: 2,
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
    shadowRadius: 2,
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
    shadowRadius: 2,
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
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: "#0022FF",
    borderColor: "#0022FF",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxCheck: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
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
    shadowRadius: 2,
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
    shadowRadius: 2,
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

  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
