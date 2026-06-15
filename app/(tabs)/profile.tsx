import { router } from "expo-router";
import {
  Bell,
  CalendarDays,
  History,
  LogOut,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { fetchPets } from "@/features/pets/petsSlice";
import { fetchProfile } from "@/features/profile/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Profile() {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { pets } = useAppSelector((state) => state.pets);
  const { profile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchPets());
    dispatch(fetchProfile());
  }, [dispatch]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mój profil</Text>

      <View style={styles.userCard}>
        {profile?.photo_url ? (
          <Image source={{ uri: profile.photo_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarPlaceholder}>Brak zdjęcia</Text>
          </View>
        )}

        <View>
          <Text style={styles.userName}>
            {profile?.first_name || profile?.last_name
              ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
              : user?.email ?? "Użytkownik"}
          </Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={styles.editText}>Edytuj</Text>
            <Pencil size={14} color="#0044FF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Zarządzanie profilem</Text>

      {pets.map((pet) => (
        <PetCard
          key={pet.id}
          id={pet.id}
          name={pet.name}
          type={pet.type}
          image={pet.photo_url}
        />
      ))}

      <MenuItem
        title="Dodaj zwierzęta"
        icon={<Plus size={22} color="#0044FF" strokeWidth={2} />}
        hideArrow
      />

      <MenuItem
        title="Ustawienia powiadomień"
        icon={<Bell size={22} color="#0044FF" strokeWidth={2} />}
        right={
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{
              false: "#D9D9D9",
              true: "#0044FF",
            }}
            thumbColor="#FFFFFF"
          />
        }
      />
      <MenuItem
        title="Harmonogram"
        icon={<CalendarDays size={22} color="#0044FF" strokeWidth={2} />}
        onPress={() => router.push("/schedule")}
      />
      <MenuItem
        title="Historia przypomnień"
        icon={<History size={22} color="#0044FF" strokeWidth={2} />}
      />
      <MenuItem
        title="Wyloguj się"
        icon={<LogOut size={22} color="#0044FF" strokeWidth={2} />}
      />
      <MenuItem
        title="Usunięcie konta"
        icon={<Trash2 size={22} color="#FF3030" strokeWidth={2} />}
        danger
      />
    </ScrollView>
  );
}

function PetCard({ id, name, type, image }: any) {
  return (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() =>
        router.push({ pathname: "/pet-profile", params: { petId: id } })
      }
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.petImage} />
      ) : (
        <View style={styles.petImagePlaceholder}>
          <Text style={styles.petImageIcon}>📷</Text>
        </View>
      )}

      <View style={styles.petInfo}>
        <Text style={styles.petName}>{name}</Text>
        <Text style={styles.petType}>{type}</Text>
      </View>

      <View style={styles.rightSide}>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

function MenuItem({ title, icon, right, danger, hideArrow, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, danger && styles.dangerItem]}
      onPress={onPress}
    >
      <View style={styles.iconCircle}>{icon}</View>

      <Text style={[styles.menuText, danger && styles.dangerText]}>
        {title}
      </Text>

      <View style={[styles.rightSide, right && styles.switchSide]}>
        {right
          ? right
          : !hideArrow && (
              <Text style={[styles.arrow, danger && styles.dangerText]}>›</Text>
            )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 20,
    paddingBottom: 99,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginTop: 48,
    marginBottom: 30,
  },
  userCard: {
    height: 115,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",

    shadowColor: "#0022FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.52,
    shadowRadius: 2,
    elevation: 3,

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 26,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 90,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarPlaceholder: {
    fontSize: 10,
    color: "#676767",
    textAlign: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#0044FF",
    borderRadius: 21,
    paddingHorizontal: 25,
    paddingVertical: 7,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editText: {
    color: "#0044FF",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#676767",
    marginBottom: 18,
  },
  petCard: {
    height: 72,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",

    shadowColor: "#0022FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.52,
    shadowRadius: 2,
    elevation: 3,

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },

  petImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#D6DEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  petImageIcon: {
    fontSize: 25,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    color: "#0044FF",
    fontWeight: "700",
    fontSize: 16,
  },
  petType: {
    color: "#676767",
    fontSize: 12,
  },
  menuItem: {
    height: 55,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",

    shadowColor: "#0022FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.52,
    shadowRadius: 2,
    elevation: 3,

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  dangerItem: {
    borderColor: "#FF5A5A",
    borderRadius: 13,
    borderWidth: 1.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5EAFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconText: {
    color: "#0044FF",
    fontSize: 16,
  },
  menuText: {
    flex: 1,
    color: "#0044FF",
    fontWeight: "700",
    fontSize: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSide: {
    width: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    color: "#0044FF",
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "300",
  },
  switchSide: {
    width: 56,
    alignItems: "flex-end",
  },
  dangerText: {
    color: "#FF3030",
  },
});
