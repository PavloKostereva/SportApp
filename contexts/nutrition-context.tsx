import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { foodProducts } from '@/data/food-products';
import { DailyNutrition, FoodEntry, FoodProduct, NutritionGoal } from '@/types/nutrition';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { useUser } from './user-context';

interface NutritionContextType {
  products: FoodProduct[];
  dailyNutrition: DailyNutrition | null;
  nutritionHistory: DailyNutrition[];
  goal: NutritionGoal;
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => Promise<void>;
  removeFoodEntry: (entryId: string) => Promise<void>;
  updateFoodEntry: (entryId: string, amount: number) => Promise<void>;
  setBurnedCalories: (calories: number) => Promise<void>;
  calculateDailyGoal: () => NutritionGoal;
  getNutritionForDate: (date: string) => DailyNutrition;
  searchProducts: (query: string) => FoodProduct[];
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

const NUTRITION_DATA_KEY = 'nutrition_data';
const NUTRITION_GOAL_KEY = 'nutrition_goal';

const defaultGoal: NutritionGoal = {
  dailyCalories: 2000,
  protein: 150,
  carbs: 250,
  fat: 67,
};

export function NutritionProvider({ children }: { children: ReactNode }) {
  const { userData } = useUser();
  const [products] = useState<FoodProduct[]>(foodProducts);
  const [nutritionHistory, setNutritionHistory] = useState<DailyNutrition[]>([]);
  const [goal, setGoal] = useState<NutritionGoal>(defaultGoal);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNutritionData();
    loadGoal();
  }, []);

  useEffect(() => {
    if (userData.weight && userData.height && userData.goal) {
      const newGoal = calculateDailyGoal();
      setGoal(newGoal);
      saveGoal(newGoal);
    }
  }, [userData.weight, userData.height, userData.goal, userData.lifestyle]);

  const loadNutritionData = async () => {
    try {
      const stored = await AsyncStorage.getItem(NUTRITION_DATA_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNutritionHistory(parsed);
      }
    } catch (error) {
      console.log('Error loading nutrition data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNutritionData = async (data: DailyNutrition[]) => {
    try {
      await AsyncStorage.setItem(NUTRITION_DATA_KEY, JSON.stringify(data));
      setNutritionHistory(data);
    } catch (error) {
      console.log('Error saving nutrition data:', error);
    }
  };

  const loadGoal = async () => {
    try {
      const stored = await AsyncStorage.getItem(NUTRITION_GOAL_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setGoal(parsed);
      } else if (userData.weight && userData.height) {
        const calculatedGoal = calculateDailyGoal();
        setGoal(calculatedGoal);
        saveGoal(calculatedGoal);
      }
    } catch (error) {
      console.log('Error loading goal:', error);
    }
  };

  const saveGoal = async (newGoal: NutritionGoal) => {
    try {
      await AsyncStorage.setItem(NUTRITION_GOAL_KEY, JSON.stringify(newGoal));
      setGoal(newGoal);
    } catch (error) {
      console.log('Error saving goal:', error);
    }
  };

  const calculateDailyGoal = (): NutritionGoal => {
    if (!userData.weight || !userData.height) {
      return defaultGoal;
    }

    const weight = userData.weight;
    const height = userData.height / 100;
    const age = 30;

    let bmr = 10 * weight + 6.25 * (height * 100) - 5 * age + 5;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9,
    };

    const multiplier = activityMultipliers[userData.lifestyle || 'moderate'] || 1.55;
    let tdee = bmr * multiplier;

    if (userData.goal === 'lose') {
      tdee -= 500;
    } else if (userData.goal === 'gain') {
      tdee += 500;
    }

    const protein = Math.round(weight * 2);
    const fat = Math.round((tdee * 0.3) / 9);
    const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);

    return {
      dailyCalories: Math.round(tdee),
      protein,
      carbs,
      fat,
    };
  };

  const getNutritionForDate = (date: string): DailyNutrition => {
    const existing = nutritionHistory.find((n) => n.date === date);
    if (existing) {
      return existing;
    }

    return {
      date,
      entries: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      burnedCalories: 0,
    };
  };

  const calculateTotals = (entries: FoodEntry[]) => {
    return entries.reduce(
      (acc, entry) => ({
        totalCalories: acc.totalCalories + entry.calories,
        totalProtein: acc.totalProtein + entry.protein,
        totalCarbs: acc.totalCarbs + entry.carbs,
        totalFat: acc.totalFat + entry.fat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
    );
  };

  const addFoodEntry = async (entryData: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const product = products.find((p) => p.id === entryData.productId);
    if (!product) return;

    const ratio = entryData.amount / product.defaultAmount;
    const entry: FoodEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...entryData,
      calories: Math.round(product.calories * ratio),
      protein: Math.round(product.protein * ratio * 10) / 10,
      carbs: Math.round(product.carbs * ratio * 10) / 10,
      fat: Math.round(product.fat * ratio * 10) / 10,
      timestamp: Date.now(),
    };

    const today = entry.date;
    const existing = nutritionHistory.find((n) => n.date === today);
    const updatedHistory = [...nutritionHistory];

    if (existing) {
      const updatedEntries = [...existing.entries, entry];
      const totals = calculateTotals(updatedEntries);
      const index = updatedHistory.findIndex((n) => n.date === today);
      updatedHistory[index] = {
        ...existing,
        entries: updatedEntries,
        ...totals,
      };
    } else {
      const totals = calculateTotals([entry]);
      updatedHistory.push({
        date: today,
        entries: [entry],
        ...totals,
        burnedCalories: 0,
      });
    }

    await saveNutritionData(updatedHistory);
  };

  const removeFoodEntry = async (entryId: string) => {
    const updatedHistory = nutritionHistory.map((day) => {
      if (day.entries.some((e) => e.id === entryId)) {
        const updatedEntries = day.entries.filter((e) => e.id !== entryId);
        const totals = calculateTotals(updatedEntries);
        return {
          ...day,
          entries: updatedEntries,
          ...totals,
        };
      }
      return day;
    });

    await saveNutritionData(updatedHistory);
  };

  const updateFoodEntry = async (entryId: string, amount: number) => {
    const updatedHistory = nutritionHistory.map((day) => {
      const entryIndex = day.entries.findIndex((e) => e.id === entryId);
      if (entryIndex !== -1) {
        const entry = day.entries[entryIndex];
        const product = products.find((p) => p.id === entry.productId);
        if (product) {
          const ratio = amount / product.defaultAmount;
          const updatedEntry = {
            ...entry,
            amount,
            calories: Math.round(product.calories * ratio),
            protein: Math.round(product.protein * ratio * 10) / 10,
            carbs: Math.round(product.carbs * ratio * 10) / 10,
            fat: Math.round(product.fat * ratio * 10) / 10,
          };
          const updatedEntries = [...day.entries];
          updatedEntries[entryIndex] = updatedEntry;
          const totals = calculateTotals(updatedEntries);
          return {
            ...day,
            entries: updatedEntries,
            ...totals,
          };
        }
      }
      return day;
    });

    await saveNutritionData(updatedHistory);
  };

  const setBurnedCalories = async (calories: number) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = nutritionHistory.find((n) => n.date === today);
    const updatedHistory = [...nutritionHistory];

    if (existing) {
      const index = updatedHistory.findIndex((n) => n.date === today);
      updatedHistory[index] = {
        ...existing,
        burnedCalories: calories,
      };
    } else {
      updatedHistory.push({
        date: today,
        entries: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        burnedCalories: calories,
      });
    }

    await saveNutritionData(updatedHistory);
  };

  const searchProducts = (query: string): FoodProduct[] => {
    if (!query.trim()) return products;
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery),
    );
  };

  const today = new Date().toISOString().split('T')[0];
  const dailyNutrition = getNutritionForDate(today);

  if (isLoading) {
    return <LoadingOverlay visible={true} message="Завантаження харчування..." />;
  }

  return (
    <NutritionContext.Provider
      value={{
        products,
        dailyNutrition,
        nutritionHistory,
        goal,
        addFoodEntry,
        removeFoodEntry,
        updateFoodEntry,
        setBurnedCalories,
        calculateDailyGoal,
        getNutritionForDate,
        searchProducts,
      }}>
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}

