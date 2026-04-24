import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, register } from "./authService";

type User = {
    id: string;
    email: string;
} | null;

type AuthState = {
    user: User;
    isLoading: boolean;
    error: string | null;
};

type LoginData = {
    email: string;
    password: string;
};

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }: LoginData, { rejectWithValue }) => {
        try {
            const user = await login({ email, password });
            return user;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Login failed");
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async ({ email, password }: LoginData, { rejectWithValue }) => {
        try {
            const user = await register({ email, password });
            return user;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Registration failed");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.error = null;
        },
        clearAuthError(state) {
            state.error = null;
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                    ? action.payload
                    : "Login failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    typeof action.payload === "string"
                    ? action.payload
                    : "Registration failed";
            })
    },
});

export const { logout, clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;