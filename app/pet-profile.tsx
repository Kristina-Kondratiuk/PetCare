import { router, useLocalSearchParams } from "expo-router";
import { MoveLeft, Pencil, Trash2 } from "lucide-react-native";
import { useEffect } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { fetchPets, removePet } from "@/features/pets/petsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function PetProfile() {
  const dispatch = useAppDispatch();
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { pets } = useAppSelector((state) => state.pets);

  const pet = pets.find((item) => item.id === petId);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  const handleDeletePet = () => {
    if (!pet) return;

    Alert.alert(
      "Usunąć pupila?",
      `Czy na pewno chcesz usunąć profil ${pet.name}?`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(removePet(pet.id)).unwrap();
              router.back();
            } catch {
              Alert.alert("Błąd", "Nie udało się usunąć pupila.");
            }
          },
        },
      ]
    );
  };

  if (!pet) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MoveLeft size={38} color="#0044FF" strokeWidth={1.5} />
          </TouchableOpacity>

          <Text style={styles.title}>Profil pupila</Text>
        </View>

        <Text style={styles.emptyText}>Nie znaleziono pupila.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MoveLeft size={38} color="#0044FF" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Profil pupila</Text>
      </View>

      <View style={styles.avatarWrapper}>
        {pet?.photo_url ? (
          <Image source={{ uri: pet.photo_url }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarPlaceholder}>+</Text>
        )}
      </View>

      <Text style={styles.petName}>{pet?.name ?? "Miki"}</Text>

      <View style={styles.info}>
        <Text style={styles.row}>
          <Text style={styles.label}>Typ: </Text>
          {pet.type}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Rasa:</Text>{" "}
          {pet.breed ?? "Brak informacji"}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Data urodzenia:</Text>{" "}
          {pet.birth_date ?? "Brak informacji"}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Waga:</Text>{" "}
          {pet.weight ? `${pet.weight} kg` : "Brak informacji"}
        </Text>
      </View>

      <Text style={styles.descriptionTitle}>Opis:</Text>

      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionText}>{pet.notes ?? "Brak opisu."}</Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: "/edit-pet-profile",
            params: { petId: pet.id },
          })
        }
      >
        <Text style={styles.editButtonText}>Edytuj profil</Text>
        <Pencil size={22} color="#FFFFFF" strokeWidth={1.8} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePet}>
        <Text style={styles.deleteButtonText}>Usuń pupila</Text>
        <Trash2 size={20} color="#0044FF" strokeWidth={1.8} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginTop: 80,
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: 80,
    fontSize: 24,
    fontWeight: "700",
    color: "#0044FF",
  },
  avatarWrapper: {
    width: 142,
    height: 142,
    borderRadius: 71,
    backgroundColor: "#E5E5E5",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,

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
  petName: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#0044FF",
    marginBottom: 30,
  },
  info: {
    marginBottom: 30,
  },
  row: {
    fontSize: 18,
    color: "#000000",
    marginBottom: 13,
  },
  label: {
    color: "#0044FF",
    fontWeight: "700",
  },
  descriptionTitle: {
    fontSize: 18,
    color: "#0044FF",
    fontWeight: "700",
    marginBottom: 10,
  },
  descriptionBox: {
    borderWidth: 1.5,
    borderColor: "#0044FF",
    borderRadius: 11,
    padding: 15,
    marginBottom: 30,
  },
  descriptionText: {
    color: "#0044FF",
    fontSize: 13,
    lineHeight: 17,
  },
  editButton: {
    height: 52,
    borderRadius: 11,
    backgroundColor: "#0044FF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  deleteButton: {
    height: 52,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#0044FF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  deleteButtonText: {
    color: "#0044FF",
    fontSize: 17,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#676767",
    textAlign: "center",
    marginTop: 40,
  },
});
