import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createMedicalRecord,
    deleteMedicalRecord,
    getMedicalRecords,
    MedicalRecord,
    updateMedicalRecord
} from "./medicalRecordsService";

type MedicalRecordState = {
    records: MedicalRecord[];
    isLoading: boolean;
    error: string | null;
};

const initialState: MedicalRecordState = {
    records: [],
    isLoading: false,
    error: null,
};

export const fetchMedicalRecords = createAsyncThunk(
    "medicalRecords/fethMedicalRecords",
    async (petId: string, { rejectWithValue }) => {
        try {
            return await getMedicalRecords(petId);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to fetch medical records");
        }
    }
);

export const addMedicalRecord = createAsyncThunk(
    "medicalRecords/addMedicalRecord",
    async (record: Omit<MedicalRecord, "id">, { rejectWithValue }) => {
        try {
            return await createMedicalRecord(record);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to add medical record");
        }
    }
);

export const editMedicalRecord = createAsyncThunk(
    "medicalRecords/editMedicalRecord",
    async (
        { id, updates }: { id: string; updates: Partial<Omit<MedicalRecord, "id">> },
        { rejectWithValue }
    ) => {
        try {
            return await updateMedicalRecord(id, updates);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to update medical record");
        }
    }
);

export const removeMedicalRecord = createAsyncThunk(
    "medicalRecords/removeMedicalRecord",
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteMedicalRecord(id);
            return id;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to delete medical record");
        }
    }
);

const medicalRecordsSlice = createSlice({
    name: "medicalRecords",
    initialState,
    reducers: {
        clearMedicalRecordsError(state) {
            state.error = null;
        },
        clearMedicalRecords(state) {
            state.records = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMedicalRecords.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.records = action.payload;
            })
            .addCase(fetchMedicalRecords.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    typeof action.payload === "string"
                    ? action.payload
                    : "Failed to fetch medical records";
            })
            .addCase(addMedicalRecord.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addMedicalRecord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.records.unshift(action.payload);
            })
            .addCase(addMedicalRecord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                    ? action.payload
                    : "Failed to add medical record";
            })
            .addCase(editMedicalRecord.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editMedicalRecord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;

                const index = state.records.findIndex((record) => record.id === action.payload.id);

                if (index !== -1) {
                    state.records[index] = action.payload;
                }
            })
            .addCase(editMedicalRecord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                    ? action.payload
                    : "Failed to update medical record";
            })
            .addCase(removeMedicalRecord.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeMedicalRecord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.records = state.records.filter((record) => record.id !== action.payload);
            })
            .addCase(removeMedicalRecord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                    ? action.payload
                    : "Failed to delete record";
            });
    },
});

export const { clearMedicalRecordsError, clearMedicalRecords } = medicalRecordsSlice.actions;
export default medicalRecordsSlice.reducer;