import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Provider, useDispatch } from 'react-redux';
import { store } from '../store';

import { getCurrentUser } from '@/features/auth/authService';
import { setUser } from '@/features/auth/authSlice';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  // Auto-login: check if user session exists in Supabase on app start
  // If yes, restore user in Redux store
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();

        if (user) {
          dispatch(setUser(user));
        }
      } catch (error) {
        console.log("Auto login error:", error);
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
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