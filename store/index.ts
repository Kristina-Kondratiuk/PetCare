import petsReducer from "@/features/pets/petsSlice";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import medicalRecordsReducer from "../features/medicalRecords/medicalRecordsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        pets: petsReducer,
        medicalRecords: medicalRecordsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;