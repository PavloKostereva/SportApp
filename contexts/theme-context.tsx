import * as SystemUI from 'expo-system-ui';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  currentTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useRNColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');

  const currentTheme: 'light' | 'dark' = themeMode === 'auto' ? systemTheme ?? 'light' : themeMode;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(currentTheme === 'dark' ? '#151718' : '#ffffff').catch(() => {
      // Ignore errors on platforms that don't support this
    });
  }, [currentTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
