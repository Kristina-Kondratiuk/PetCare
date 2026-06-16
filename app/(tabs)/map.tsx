import {
  getNearbyPetPlaces,
  MapPlace,
  MapPlaceType,
} from "@/services/mapService";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [selectedType, setSelectedType] = useState<MapPlaceType>("vet");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlaces = async (
    latitude: number,
    longitude: number,
    type: MapPlaceType
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const nearbyPlaces = await getNearbyPetPlaces(latitude, longitude, type);

      setPlaces(nearbyPlaces);
    } catch {
      setError("Nie udało się pobrać danych mapy.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted) {
          setError("Brak dostępu do lokalizacji.");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        await loadPlaces(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude,
            "vet"
          );
      } catch {
        setError("Nie udało się pobrać danych mapy.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMapData();
  }, []);

  const handleChangeType = (type: MapPlaceType) => {
    setSelectedType(type);

    if (location) {
      loadPlaces(location.coords.latitude, location.coords.longitude, type);
    }
  };

  if (isLoading && !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.message}>Ładowanie mapy...</Text>
      </View>
    );
  }

  if (error || !location) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? "Nie udało się pobrać lokalizacji."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.address}
            pinColor={place.type === "vet" ? "#E83E78" : "#0022FF"}
          />
        ))}
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>
          {selectedType === "vet"
            ? "Kliniki weterynaryjne w pobliżu"
            : "Schroniska w pobliżu"}
        </Text>

        <Text style={styles.infoText}>Znaleziono: {places.length}</Text>

        {isLoading && (
          <Text style={styles.loadingText}>Odświeżanie danych...</Text>
        )}

        <View style={styles.filterContainer}>
          <Pressable
            style={[
              styles.filterButton,
              selectedType === "vet" && styles.filterButtonActive,
            ]}
            onPress={() => handleChangeType("vet")}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === "vet" && styles.filterTextActive,
              ]}
            >
              Klinika weterynaryjna
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              selectedType === "shelter" && styles.filterButtonActive,
            ]}
            onPress={() => handleChangeType("shelter")}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === "shelter" && styles.filterTextActive,
              ]}
            >
              Schroniska
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },

  message: {
    marginTop: 12,
    fontSize: 16,
    color: "#676767",
  },

  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },

  infoBox: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 25,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#0022FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.52,
    shadowRadius: 2,
    elevation: 3,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },

  infoText: {
    fontSize: 14,
    color: "#676767",
  },

  loadingText: {
    fontSize: 13,
    color: "#0044FF",
    marginTop: 4,
  },

  filterContainer: {
    flexDirection: "row",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#D8DDFF",
    borderRadius: 14,
    overflow: "hidden",
  },

  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  filterButtonActive: {
    backgroundColor: "#0044FF",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000000",
  },

  filterTextActive: {
    color: "#ffffff",
  },
});
