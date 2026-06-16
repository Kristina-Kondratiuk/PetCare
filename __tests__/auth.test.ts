import authReducer, {
  clearAuthError,
  loginUser,
  logout,
  registerUser,
  setUser,
} from "@/features/auth/authSlice";

jest.mock("@/features/auth/authService", () => ({
  login: jest.fn(),
  register: jest.fn(),
  logoutUser: jest.fn(),
}));

describe("authSlice", () => {
  it("returns initial state", () => {
    const state = authReducer(undefined, { type: "unknown" });

    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("sets current user", () => {
    const user = { id: "user-1", email: "test@example.com" };

    const state = authReducer(undefined, setUser(user));

    expect(state.user).toEqual(user);
  });

  it("logs out user and clears error", () => {
    const previousState = {
      user: { id: "user-1", email: "test@example.com" },
      isLoading: false,
      error: "Some error",
    };

    const state = authReducer(previousState, logout());

    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  it("clears auth error", () => {
    const previousState = {
      user: null,
      isLoading: false,
      error: "Login failed",
    };

    const state = authReducer(previousState, clearAuthError());

    expect(state.error).toBeNull();
  });

  it("handles successful login", () => {
    const user = { id: "user-1", email: "test@example.com" };

    const state = authReducer(
      undefined,
      loginUser.fulfilled(user, "request-id", {
        email: "test@example.com",
        password: "Password!",
      })
    );

    expect(state.user).toEqual(user);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("handles registration error", () => {
    const state = authReducer(
      undefined,
      registerUser.rejected(null, "request-id", {
        email: "test@example.com",
        password: "wrong",
      }, "Registration failed")
    );

    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Registration failed");
  });
});