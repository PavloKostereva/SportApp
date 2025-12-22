import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface UserData {
  weight: number | null;
  height: number | null;
  lifestyle: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active' | null;
  goal: 'lose' | 'gain' | 'maintain' | null;
  workoutTime: number | null;
  hasCompletedOnboarding: boolean;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_DATA_KEY = 'user_data';

const defaultUserData: UserData = {
  weight: null,
  height: null,
  lifestyle: null,
  goal: null,
  workoutTime: null,
  hasCompletedOnboarding: false,
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_DATA_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const loadedData = { ...defaultUserData, ...parsed };
        console.log('Loaded user data:', loadedData);
        setUserData(loadedData);
      } else {
        console.log('No stored user data found');
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (data: UserData) => {
    try {
      console.log('Saving user data to storage:', data);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
      setUserData(data);
      console.log('User data saved successfully');
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  const updateUserData = async (data: Partial<UserData>) => {
    const newData = { ...userData, ...data };
    console.log('Updating user data:', { old: userData, new: newData, partial: data });
    await saveUserData(newData);
  };

  const completeOnboarding = async () => {
    const currentData = { ...userData };
    currentData.hasCompletedOnboarding = true;
    console.log('Completing onboarding with data:', currentData);
    await saveUserData(currentData);
  };

  const skipOnboarding = async () => {
    const currentData = { ...userData };
    currentData.hasCompletedOnboarding = true;
    console.log('Skipping onboarding with data:', currentData);
    await saveUserData(currentData);
  };

  if (isLoading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ userData, updateUserData, completeOnboarding, skipOnboarding }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
