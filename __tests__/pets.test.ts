import petsReducer, {
    addPet,
    clearPetsError,
    editPet,
    fetchPets,
    removePet,
} from "@/features/pets/petsSlice";
  
  jest.mock("@/features/pets/petsService", () => ({
    getPets: jest.fn(),
    createPet: jest.fn(),
    updatePet: jest.fn(),
    deletePet: jest.fn(),
  }));
  
  const firstPet = {
    id: "pet-1",
    name: "Luna",
    type: "Kotka",
    breed: "Brytyjska",
    birth_date: "2024-01-01",
    weight: "4",
    photo_url: "https://example.com/luna.jpg",
    notes: "Spokojna kotka",
  };
  
  const secondPet = {
    id: "pet-2",
    name: "Miki",
    type: "Pies",
    breed: "Beagle",
    birth_date: "2021-04-15",
    weight: "12",
    photo_url: undefined,
    notes: "Lubi spacery",
  };
  
  describe("petsSlice", () => {
    it("returns initial state", () => {
      const state = petsReducer(undefined, { type: "unknown" });
  
      expect(state.pets).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  
    it("clears pets error", () => {
      const previousState = {
        pets: [],
        isLoading: false,
        error: "Failed to fetch pets",
      };
  
      const state = petsReducer(previousState, clearPetsError());
  
      expect(state.error).toBeNull();
    });
  
    it("sets loading state while fetching pets", () => {
      const state = petsReducer(undefined, fetchPets.pending("request-id"));
  
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  
    it("stores fetched pets", () => {
      const state = petsReducer(
        undefined,
        fetchPets.fulfilled([firstPet, secondPet], "request-id")
      );
  
      expect(state.pets).toHaveLength(2);
      expect(state.pets[0].name).toBe("Luna");
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  
    it("adds new pet to the beginning of the list", () => {
      const previousState = {
        pets: [firstPet],
        isLoading: false,
        error: null,
      };
  
      const state = petsReducer(
        previousState,
        addPet.fulfilled(secondPet, "request-id", {
          name: "Miki",
          type: "Pies",
        })
      );
  
      expect(state.pets).toHaveLength(2);
      expect(state.pets[0].id).toBe("pet-2");
    });
  
    it("updates existing pet", () => {
      const previousState = {
        pets: [firstPet],
        isLoading: false,
        error: null,
      };
  
      const updatedPet = {
        ...firstPet,
        name: "Luna Updated",
        weight: "5",
      };
  
      const state = petsReducer(
        previousState,
        editPet.fulfilled(updatedPet, "request-id", {
          id: "pet-1",
          updates: {
            name: "Luna Updated",
            weight: "5",
          },
        })
      );
  
      expect(state.pets[0].name).toBe("Luna Updated");
      expect(state.pets[0].weight).toBe("5");
    });
  
    it("removes pet from list", () => {
      const previousState = {
        pets: [firstPet, secondPet],
        isLoading: false,
        error: null,
      };
  
      const state = petsReducer(
        previousState,
        removePet.fulfilled("pet-1", "request-id", "pet-1")
      );
  
      expect(state.pets).toHaveLength(1);
      expect(state.pets[0].id).toBe("pet-2");
    });
  });