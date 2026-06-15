import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../store";

import { getCurrentUser } from "@/features/auth/authService";
import { setUser } from "@/features/auth/authSlice";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const user = useSelector((state: any) => state.auth.user);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (currentUser) {
          dispatch(setUser(currentUser));
        }
      } catch (error) {
        console.log("Auto login error:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    loadUser();
  }, [dispatch]);

  useEffect(() => {
    if (isCheckingAuth) return;
  
    const isAuthScreen =
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/register";
  
    if (!user && !isAuthScreen) {
      router.replace("/login");
    }
  
    if (user && isAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, pathname, isCheckingAuth, router]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="pet-profile" options={{ headerShown: false }} />
          <Stack.Screen name="edit-pet-profile" options={{ headerShown: false }} />
          <Stack.Screen name="schedule" options={{ headerShown: false }} />
          <Stack.Screen name="add-pet-profile" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}