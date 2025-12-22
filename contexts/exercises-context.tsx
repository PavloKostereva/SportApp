import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Exercise {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
  notes?: string;
}

export interface ExerciseProgress {
  exerciseId: string;
  date: string;
  completedSets: number;
  totalSets: number;
}

interface ExercisesContextType {
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'id'>) => Promise<void>;
  updateExercise: (id: string, exercise: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  getExercisesByCategory: (category: Exercise['category']) => Exercise[];
  getCategoryName: (category: Exercise['category']) => string;
}

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);

const EXERCISES_KEY = 'exercises_data';

const defaultExercises: Exercise[] = [
  { id: '1', name: 'Присідання', category: 'legs', sets: 3, reps: 12, restTime: 60 },
  { id: '2', name: 'Жим лежачи', category: 'chest', sets: 4, reps: 10, weight: 60, restTime: 90 },
  { id: '3', name: 'Станова тяга', category: 'back', sets: 3, reps: 8, weight: 80, restTime: 120 },
  { id: '4', name: 'Підтягування', category: 'back', sets: 3, reps: 12, restTime: 60 },
  { id: '5', name: 'Планка', category: 'core', sets: 3, reps: 60, restTime: 30 },
  { id: '6', name: 'Жим стоячи', category: 'shoulders', sets: 3, reps: 10, weight: 20, restTime: 60 },
  { id: '7', name: 'Біцепс з гантелями', category: 'arms', sets: 3, reps: 12, weight: 10, restTime: 45 },
  { id: '8', name: 'Біг на місці', category: 'cardio', sets: 1, reps: 20, restTime: 0 },
];

export function ExercisesProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>(defaultExercises);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const stored = await AsyncStorage.getItem(EXERCISES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setExercises(parsed);
      }
    } catch (error) {
      console.log('Error loading exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveExercises = async (newExercises: Exercise[]) => {
    try {
      await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(newExercises));
      setExercises(newExercises);
    } catch (error) {
      console.log('Error saving exercises:', error);
    }
  };

  const addExercise = async (exercise: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(),
    };
    const updated = [...exercises, newExercise];
    await saveExercises(updated);
  };

  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    const updated = exercises.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex));
    await saveExercises(updated);
  };

  const deleteExercise = async (id: string) => {
    const updated = exercises.filter((ex) => ex.id !== id);
    await saveExercises(updated);
  };

  const getExercisesByCategory = (category: Exercise['category']) => {
    return exercises.filter((ex) => ex.category === category);
  };

  const getCategoryName = (category: Exercise['category']): string => {
    const names: Record<Exercise['category'], string> = {
      chest: 'Груди',
      back: 'Спина',
      legs: 'Ноги',
      shoulders: 'Плечі',
      arms: 'Руки',
      core: 'Прес',
      cardio: 'Кардіо',
    };
    return names[category];
  };

  if (isLoading) {
    return null;
  }

  return (
    <ExercisesContext.Provider
      value={{
        exercises,
        addExercise,
        updateExercise,
        deleteExercise,
        getExercisesByCategory,
        getCategoryName,
      }}>
      {children}
    </ExercisesContext.Provider>
  );
}

export function useExercises() {
  const context = useContext(ExercisesContext);
  if (context === undefined) {
    throw new Error('useExercises must be used within an ExercisesProvider');
  }
  return context;
}

