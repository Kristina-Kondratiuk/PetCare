import authReducer from "@/features/auth/authSlice";
import medicalRecordsReducer from "@/features/medicalRecords/medicalRecordsSlice";
import petPhotosReducer from "@/features/petPhotos/petPhotosSlice";
import petsReducer from "@/features/pets/petsSlice";
import profileReducer from "@/features/profile/profileSlice";
import remindersReducer from "@/features/reminders/remindersSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        pets: petsReducer,
        medicalRecords: medicalRecordsReducer,
        reminders: remindersReducer,
        petPhotos: petPhotosReducer,
        profile: profileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;