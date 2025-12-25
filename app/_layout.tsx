import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { ExercisesProvider } from '@/contexts/exercises-context';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';
import { UserProvider } from '@/contexts/user-context';
import { WorkoutDaysProvider } from '@/contexts/workout-days-context';
import '@/i18n/config';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { currentTheme } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationThemeProvider value={currentTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ExercisesProvider>
          <WorkoutDaysProvider>
            <RootLayoutNav />
          </WorkoutDaysProvider>
        </ExercisesProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
