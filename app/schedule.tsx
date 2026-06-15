import { fetchPets } from "@/features/pets/petsSlice";
import {
    addReminder,
    editReminder,
    fetchAllReminders,
} from "@/features/reminders/remindersSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MoveLeft, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ScheduleScreen() {
  const dispatch = useAppDispatch();

  const { reminders, isLoading, error } = useAppSelector(
    (state) => state.reminders
  );
  const { pets } = useAppSelector((state) => state.pets);

  const [showForm, setShowForm] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");

  const areAllRemindersEnabled =
    reminders.length > 0 &&
    reminders.every((reminder) => !reminder.is_completed);

  useEffect(() => {
    dispatch(fetchPets());
    dispatch(fetchAllReminders());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedPetId && pets.length > 0) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  const formatReminderTime = (date: string) => {
    return new Date(date).toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const handleToggleAllReminders = async () => {
    const newCompletedValue = areAllRemindersEnabled;

    try {
      await Promise.all(
        reminders.map((reminder) =>
          dispatch(
            editReminder({
              id: reminder.id,
              updates: {
                is_completed: newCompletedValue,
              },
            })
          ).unwrap()
        )
      );

      dispatch(fetchAllReminders());
    } catch {
      Alert.alert("Błąd", "Nie udało się zmienić wszystkich przypomnień.");
    }
  };

  const handleAddReminder = async () => {
    if (!selectedPetId) {
      Alert.alert("Brak zwierząt", "Najpierw dodaj zwierzę.");
      return;
    }

    if (!title.trim() || !time.trim()) {
      Alert.alert("Brak danych", "Uzupełnij tytuł i godzinę.");
      return;
    }

    const [hours, minutes] = time.split(":");

    if (
      hours === undefined ||
      minutes === undefined ||
      Number.isNaN(Number(hours)) ||
      Number.isNaN(Number(minutes))
    ) {
      Alert.alert("Niepoprawna godzina", "Wpisz godzinę w formacie HH:MM.");
      return;
    }

    const reminderDate = new Date();
    reminderDate.setHours(Number(hours));
    reminderDate.setMinutes(Number(minutes));
    reminderDate.setSeconds(0);
    reminderDate.setMilliseconds(0);

    try {
      await dispatch(
        addReminder({
          pet_id: selectedPetId,
          title: title.trim(),
          description: description.trim() || null,
          reminder_time: reminderDate.toISOString(),
          is_completed: false,
          notification_id: null,
        })
      ).unwrap();

      setTitle("");
      setDescription("");
      setTime("");
      setShowForm(false);

      dispatch(fetchAllReminders());
    } catch {
      Alert.alert("Błąd", "Nie udało się dodać zadania.");
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MoveLeft size={32} color="#0044FF" strokeWidth={1.5} />
          </TouchableOpacity>

          <Text style={styles.title}>Harmonogram</Text>
        </View>

        {isLoading && <Text style={styles.infoText}>Ładowanie...</Text>}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!isLoading && reminders.length === 0 && (
          <Text style={styles.infoText}>Brak zadań w harmonogramie</Text>
        )}

        {reminders.length > 0 && (
          <View style={styles.masterSwitchCard}>
            <View style={styles.masterSwitchWrapper}>
              <Switch
                value={areAllRemindersEnabled}
                onValueChange={handleToggleAllReminders}
                trackColor={{
                  false: "#D9D9D9",
                  true: "#0044FF",
                }}
                thumbColor="#FFFFFF"
                style={styles.switch}
              />
            </View>

            <View style={styles.reminderTextContainer}>
              <Text style={styles.masterSwitchTitle}>
                Wszystkie przypomnienia
              </Text>
            </View>
          </View>
        )}

        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderCard}>
            <View style={styles.reminderTextContainer}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>

              <Text style={styles.reminderDescription}>
                O {formatReminderTime(reminder.reminder_time)}
                {reminder.description ? `, ${reminder.description}` : ""}
              </Text>
            </View>

            <View style={styles.switchWrapper}>
              <Switch
                value={!reminder.is_completed}
                onValueChange={() =>
                  handleToggleReminder(reminder.id, reminder.is_completed)
                }
                trackColor={{
                  false: "#D9D9D9",
                  true: "#0044FF",
                }}
                thumbColor="#FFFFFF"
                style={styles.switch}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => setShowForm((current) => !current)}
        >
          <View style={styles.addIconCircle}>
            <Plus size={20} color="#0044FF" strokeWidth={2} />
          </View>

          <Text style={styles.addTaskText}>Dodać zadanie</Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.label}>Dla zwierzęcia</Text>

            <View style={styles.petSelector}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petButton,
                    selectedPetId === pet.id && styles.petButtonSelected,
                  ]}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Text
                    style={[
                      styles.petButtonText,
                      selectedPetId === pet.id && styles.petButtonTextSelected,
                    ]}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Tytuł"
              placeholderTextColor="#8A8A8A"
            />

            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Opis"
              placeholderTextColor="#8A8A8A"
            />

            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="O której? np. 07:00"
              placeholderTextColor="#8A8A8A"
              keyboardType="numbers-and-punctuation"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddReminder}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  title: {
    flex: 1,
    textAlign: "center",
    marginRight: 32,
    fontSize: 24,
    fontWeight: "700",
    color: "#0044FF",
  },
  infoText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#676767",
    marginBottom: 14,
  },
  errorText: {
    fontSize: 15,
    color: "#FF3030",
    marginBottom: 14,
  },
  masterSwitchCard: {
    minHeight: 62,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    paddingLeft: 5,
    paddingVertical: 10,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#0022FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.52,
    shadowRadius: 2,
    elevation: 2,
  },
  masterSwitchTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0044FF",
    marginBottom: 3,
  },
  masterSwitchText: {
    fontSize: 12,
    color: "#676767",
  },
  reminderCard: {
    minHeight: 62,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#0022FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.52,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 3,
  },
  reminderDescription: {
    fontSize: 12,
    color: "#000000",
  },
  addTaskButton: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D6DEFF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  addIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D6DEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  addTaskText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0044FF",
  },
  formCard: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 10,

    shadowColor: "#0022FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.52,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: "#676767",
    marginBottom: 8,
  },
  petSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  petButton: {
    minWidth: 76,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#D6DEFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  petButtonSelected: {
    backgroundColor: "#0044FF",
    borderColor: "#0044FF",
  },
  petButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0044FF",
  },
  petButtonTextSelected: {
    color: "#FFFFFF",
  },
  input: {
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 13,
    color: "#000000",
  },
  saveButton: {
    height: 42,
    borderRadius: 9,
    backgroundColor: "#0044FF",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  switchWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  masterSwitchWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});
