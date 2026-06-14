import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPetPhotos, PetPhoto, uploadPetPhoto } from "./petPhotosService";

type PetPhotosState = {
  photos: PetPhoto[];
  isLoading: boolean;
  error: string | null;
};

const initialState: PetPhotosState = {
  photos: [],
  isLoading: false,
  error: null,
};

export const fetchPetPhotos = createAsyncThunk(
  "petPhotos/fetchPetPhotos",
  async (petId: string, { rejectWithValue }) => {
    try {
      return await getPetPhotos(petId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Failed to fetch pet photos");
    }
  }
);

export const addPetPhotoFromDevice = createAsyncThunk(
  "petPhotos/addPetPhotoFromDevice",
  async (
    { petId, imageUri }: { petId: string; imageUri: string },
    { rejectWithValue }
  ) => {
    try {
      return await uploadPetPhoto(petId, imageUri);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Failed to upload pet photo");
    }
  }
);

const petPhotosSlice = createSlice({
  name: "petPhotos",
  initialState,
  reducers: {
    clearPetPhotos(state) {
      state.photos = [];
      state.error = null;
    },
    clearPetPhotosError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPetPhotos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPetPhotos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(fetchPetPhotos.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch pet photos";
      })
      .addCase(addPetPhotoFromDevice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPetPhotoFromDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.photos.unshift(action.payload);
      })
      .addCase(addPetPhotoFromDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to upload pet photo";
      });
  },
});

export const { clearPetPhotos, clearPetPhotosError } = petPhotosSlice.actions;

export default petPhotosSlice.reducer;