import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createPet, deletePet, getPets, Pet, updatePet } from "./petsService";

type PetsState = {
    pets: Pet[];
    isLoading: boolean;
    error: string | null;
};

const initialState: PetsState = {
    pets: [],
    isLoading: false,
    error: null,
};

export const fetchPets = createAsyncThunk(
    "pets/fetchPets",
    async (_, { rejectWithValue }) => {
        try {
            return await getPets();
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to fetch pets");
        }
    }
);

export const addPet = createAsyncThunk(
    "pets/addPet",
    async (pet: Omit<Pet, "id">, { rejectWithValue }) => {
        try {
            return await createPet(pet);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to add pet");
        }
    }
);

export const editPet = createAsyncThunk(
    "pets/editPet",
    async (
        { id, updates }: { id: string; updates: Partial<Omit<Pet, "id">> },
        { rejectWithValue }
    ) => {
        try {
            return await updatePet(id, updates);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to update pet");
        }
    }
);

export const removePet = createAsyncThunk(
    "pets/removePet",
    async (id: string, { rejectWithValue }) => {
        try {
            await deletePet(id);
            return id;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to delete pet");
        }
    }
);

const petsSlice = createSlice({
    name: "pets",
    initialState,
    reducers: {
        clearPetsError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPets.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.pets = action.payload;
            })
            .addCase(fetchPets.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    typeof action.payload === "string"
                        ? action.payload
                        : "Failed to fetch pets";
            })
            .addCase(addPet.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addPet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.pets.unshift(action.payload);
            })
            .addCase(addPet.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                        ? action.payload
                        : "Failed to add pet";
            })
            .addCase(editPet.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editPet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;

                const index = state.pets.findIndex((pet) => pet.id === action.payload.id);

                if (index !== -1) {
                    state.pets[index] = action.payload;
                }
            })
            .addCase(editPet.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                        ? action.payload
                        : "Failed to update pet";
            })
            .addCase(removePet.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removePet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.pets = state.pets.filter((pet) => pet.id !== action.payload);
            })
            .addCase(removePet.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                        ? action.payload
                        : "Failed to delete pet";
            });
    },
});

export const { clearPetsError } = petsSlice.actions;
export default petsSlice.reducer;