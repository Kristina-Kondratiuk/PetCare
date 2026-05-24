import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createReminder, deleteReminder, getReminders, Reminder, updateReminder } from "./remindersService";

type RemindersState = {
    reminders: Reminder[];
    isLoading: boolean;
    error: string | null;
};

const initialState: RemindersState = {
    reminders: [],
    isLoading: false,
    error: null,
};

export const fetchReminders = createAsyncThunk(
    "reminders/fetchReminders",
    async (petId: string, { rejectWithValue }) => {
        try {
            return await getReminders(petId);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to fetch reminders");
        }
    }
);

export const addReminder = createAsyncThunk(
    "reminders/addReminder",
    async (reminder: Omit<Reminder, "id" | "user_id" | "created_at" | "updated_at">, { rejectWithValue }) => {
        try {
            return await createReminder(reminder);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to add reminder");
        }
    }
);

export const editReminder = createAsyncThunk(
    "reminders/editReminder",
    async ({ id, updates }: {
        id: string;
        updates: Partial<Omit<Reminder, "id" | "user_id">>;
    }, { rejectWithValue }) => {
        try {
            return await updateReminder(id, updates);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to update reminder");
        }
    }
);

export const removeReminder = createAsyncThunk(
    "reminder/removeReminder",
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteReminder(id);
            return id;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Failed to delete reminder");
        }
    }
);

const remindersSlice = createSlice({
    name: "reminders",
    initialState,
    reducers: {
        clearRemindersError(state) {
            state.error = null;
        },
        clearReminders(state) {
            state.reminders = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReminders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchReminders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.reminders = action.payload;
            })
            .addCase(fetchReminders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                    ? action.payload
                    : "Failed to fetch reminders";
            })
            .addCase(addReminder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addReminder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.reminders.unshift(action.payload);
            })
            .addCase(addReminder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                    ? action.payload
                    : "Failed to add reminder";
            })
            .addCase(editReminder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editReminder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                
                const index = state.reminders.findIndex((reminder) => reminder.id === action.payload.id);

                if (index !== -1) {
                    state.reminders[index] = action.payload;
                }
            })
            .addCase(editReminder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                    ? action.payload
                    : "Failed to update reminder";
            })
            .addCase(removeReminder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeReminder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.reminders = state.reminders.filter((reminder) => reminder.id !== action.payload);
            })
            .addCase(removeReminder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                    ? action.payload
                    : "Failed to delete reminder";
            });
    },
});

export const { clearRemindersError, clearReminders } = remindersSlice.actions;
export default remindersSlice.reducer;