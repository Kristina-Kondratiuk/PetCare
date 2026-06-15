export type MapPlaceType = "vet" | "shelter";

export type MapPlace = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  type: MapPlaceType;
};

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
    "addr:street"?: string;
    "addr:housenumber"?: string;
    "addr:city"?: string;
  };
};

type OverpassResponse = {
  elements: OverpassElement[];
};

const buildAddress = (tags?: OverpassElement["tags"]) => {
  if (!tags) return undefined;

  const street = tags["addr:street"];
  const houseNumber = tags["addr:housenumber"];
  const city = tags["addr:city"];

  return [street, houseNumber, city].filter(Boolean).join(" ");
};

const getOverpassAmenity = (type: MapPlaceType) => {
  if (type === "vet") return "veterinary";

  return "animal_shelter";
};

export const getNearbyPetPlaces = async (
  latitude: number,
  longitude: number,
  type: MapPlaceType
): Promise<MapPlace[]> => {
  const radius = type === "shelter" ? 20000 : 5000;
  const amenity = getOverpassAmenity(type);

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="${amenity}"](around:${radius},${latitude},${longitude});
      way["amenity"="${amenity}"](around:${radius},${latitude},${longitude});
      relation["amenity"="${amenity}"](around:${radius},${latitude},${longitude});
    );
    out center tags;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch nearby pet places");
  }

  const data = (await response.json()) as OverpassResponse;

  const places: MapPlace[] = [];

  data.elements.forEach((element) => {
    const elementLatitude = element.lat ?? element.center?.lat;
    const elementLongitude = element.lon ?? element.center?.lon;

    if (!elementLatitude || !elementLongitude) {
      return;
    }

    places.push({
      id: `${type}-${element.id}`,
      name:
        element.tags?.name ??
        (type === "vet" ? "Klinika weterynaryjna" : "Schronisko"),
      latitude: elementLatitude,
      longitude: elementLongitude,
      address: buildAddress(element.tags),
      type,
    });
  });

  return places;
};
