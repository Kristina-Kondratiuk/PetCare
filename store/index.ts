import petPhotosReducer from "@/features/petPhotos/petPhotosSlice";
import petsReducer from "@/features/pets/petsSlice";
import remindersReducer from "@/features/reminders/remindersSlice";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import medicalRecordsReducer from "../features/medicalRecords/medicalRecordsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        pets: petsReducer,
        medicalRecords: medicalRecordsReducer,
        reminders: remindersReducer,
        petPhotos: petPhotosReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;