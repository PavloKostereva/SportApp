import { Exercise, ExerciseCategory } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ExercisesContextType {
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'id'>) => Promise<void>;
  updateExercise: (id: string, exercise: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  getExercisesByCategory: (category: ExerciseCategory) => Exercise[];
  getCategoryName: (category: ExerciseCategory) => string;
}

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);

const EXERCISES_KEY = 'exercises_data';

const defaultExercises: Exercise[] = [
  {
    id: '1',
    name: 'Жим лежачи',
    category: 'chest',
    sets: 4,
    reps: 10,
    weight: 60,
    restTime: 90,
    difficulty: 'intermediate',
    location: 'gym',
    equipment: ['barbell'],
    duration: 20,
    calories: 150,
  },
  {
    id: '2',
    name: 'Жим лежачи на нахилі',
    category: 'chest',
    sets: 3,
    reps: 12,
    weight: 50,
    restTime: 90,
    difficulty: 'intermediate',
    location: 'gym',
    equipment: ['dumbbells'],
    duration: 15,
    calories: 120,
  },
  {
    id: '3',
    name: 'Розведення гантелей',
    category: 'chest',
    sets: 3,
    reps: 15,
    weight: 12,
    restTime: 60,
    difficulty: 'beginner',
    location: 'gym',
    equipment: ['dumbbells'],
    duration: 12,
    calories: 80,
  },
  {
    id: '4',
    name: 'Віджимання від підлоги',
    category: 'chest',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    location: 'home',
    equipment: ['bodyweight'],
    duration: 10,
    calories: 60,
  },
  {
    id: '5',
    name: 'Віджимання на брусах',
    category: 'chest',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'advanced',
    location: 'gym',
    equipment: ['bodyweight'],
    duration: 12,
    calories: 100,
  },

  // Спина
  {
    id: '6',
    name: 'Станова тяга',
    category: 'back',
    sets: 3,
    reps: 8,
    weight: 80,
    restTime: 120,
    difficulty: 'advanced',
    location: 'gym',
    equipment: ['barbell'],
    duration: 25,
    calories: 200,
  },
  {
    id: '7',
    name: 'Підтягування',
    category: 'back',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'intermediate',
    location: 'gym',
    equipment: ['bodyweight'],
    duration: 15,
    calories: 120,
  },
  {
    id: '8',
    name: 'Тяга штанги в нахилі',
    category: 'back',
    sets: 3,
    reps: 10,
    weight: 50,
    restTime: 90,
    difficulty: 'intermediate',
    location: 'gym',
    equipment: ['barbell'],
    duration: 18,
    calories: 140,
  },
  {
    id: '9',
    name: 'Тяга верхнього блоку',
    category: 'back',
    sets: 3,
    reps: 12,
    weight: 40,
    restTime: 60,
    difficulty: 'beginner',
    location: 'gym',
    equipment: ['machine', 'cable'],
    duration: 15,
    calories: 100,
  },
  {
    id: '10',
    name: 'Тяга гантелі однією рукою',
    category: 'back',
    sets: 3,
    reps: 12,
    weight: 20,
    restTime: 60,
    difficulty: 'beginner',
    location: 'home',
    equipment: ['dumbbells'],
    duration: 12,
    calories: 80,
  },

  // Ноги
  {
    id: '11',
    name: 'Присідання',
    category: 'legs',
    sets: 4,
    reps: 12,
    restTime: 90,
    difficulty: 'beginner',
    location: 'anywhere',
    equipment: ['bodyweight'],
    duration: 20,
    calories: 150,
  },
  {
    id: '12',
    name: 'Випади',
    category: 'legs',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'intermediate',
    location: 'anywhere',
    equipment: ['bodyweight'],
    duration: 15,
    calories: 100,
  },
  {
    id: '13',
    name: 'Жим ногами',
    category: 'legs',
    sets: 3,
    reps: 15,
    weight: 100,
    restTime: 90,
    difficulty: 'beginner',
    location: 'gym',
    equipment: ['machine'],
    duration: 18,
    calories: 120,
  },
  {
    id: '14',
    name: 'Розгинання ніг',
    category: 'legs',
    sets: 3,
    reps: 15,
    weight: 30,
    restTime: 60,
    difficulty: 'beginner',
    location: 'gym',
    equipment: ['machine'],
    duration: 12,
    calories: 80,
  },
  {
    id: '15',
    name: 'Згинання ніг',
    category: 'legs',
    sets: 3,
    reps: 15,
    weight: 30,
    restTime: 60,
    difficulty: 'beginner',
    location: 'gym',
    equipment: ['machine'],
    duration: 12,
    calories: 80,
  },
  {
    id: '16',
    name: 'Підйоми на носки',
    category: 'legs',
    sets: 3,
    reps: 20,
    weight: 40,
    restTime: 45,
    difficulty: 'beginner',
    location: 'gym',
    equipment: ['dumbbells', 'machine'],
    duration: 10,
    calories: 60,
  },

  // Плечі
  {
    id: '17',
    name: 'Жим стоячи',
    category: 'shoulders',
    sets: 3,
    reps: 10,
    weight: 20,
    restTime: 60,
    difficulty: 'intermediate',
    location: 'gym',
    equipment: ['dumbbells', 'barbell'],
    duration: 15,
    calories: 100,
  },
  {
    id: '18',
    name: 'Розведення гантелей в сторони',
    category: 'shoulders',
    sets: 3,
    reps: 15,
    weight: 8,
    restTime: 60,
    difficulty: 'beginner',
    location: 'home',
    equipment: ['dumbbells'],
    duration: 12,
    calories: 70,
  },
  {
    id: '19',
    name: 'Жим Арнольда',
    category: 'shoulders',
    sets: 3,
    reps: 12,
    weight: 15,
    restTime: 60,
    difficulty: 'advanced',
    location: 'gym',
    equipment: ['dumbbells'],
    duration: 15,
    calories: 110,
  },
  {
    id: '20',
    name: 'Підйом гантелей перед собою',
    category: 'shoulders',
    sets: 3,
    reps: 12,
    weight: 10,
    restTime: 60,
    difficulty: 'beginner',
    location: 'home',
    equipment: ['dumbbells'],
    duration: 10,
    calories: 60,
  },

  // Руки
  {
    id: '21',
    name: 'Біцепс з гантелями',
    category: 'arms',
    sets: 3,
    reps: 12,
    weight: 10,
    restTime: 45,
    difficulty: 'beginner',
    location: 'home',
    equipment: ['dumbbells'],
    duration: 10,
    calories: 50,
  },
  {
    id: '22',
    name: 'Молоток',
    category: 'arms',
    sets: 3,
    reps: 12,
    weight: 10,
    restTime: 45,
    difficulty: 'beginner',
    location: 'home',
    equipment: ['dumbbells'],
    duration: 10,
    calories: 50,
  },
  {
    id: '23',
    name: 'Французький жим',
    category: 'arms',
    sets: 3,
    reps: 12,
    weight: 15,
    restTime: 60,
    difficulty: 'intermediate',
    location: 'gym',
    equipment: ['dumbbells', 'barbell'],
    duration: 12,
    calories: 80,
  },
  {
    id: '24',
    name: 'Віджимання для трицепса',
    category: 'arms',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'intermediate',
    location: 'home',
    equipment: ['bodyweight'],
    duration: 10,
    calories: 70,
  },
  {
    id: '25',
    name: 'Підйом на біцепс зі штангою',
    category: 'arms',
    sets: 3,
    reps: 10,
    weight: 25,
    restTime: 60,
    difficulty: 'intermediate',
    location: 'gym',
    equipment: ['barbell'],
    duration: 12,
    calories: 90,
  },

  // Прес
  {
    id: '26',
    name: 'Планка',
    category: 'core',
    sets: 3,
    reps: 60,
    restTime: 30,
    difficulty: 'beginner',
    location: 'anywhere',
    equipment: ['bodyweight'],
    duration: 5,
    calories: 30,
  },
  {
    id: '27',
    name: 'Скручування',
    category: 'core',
    sets: 3,
    reps: 20,
    restTime: 45,
    difficulty: 'beginner',
    location: 'anywhere',
    equipment: ['bodyweight'],
    duration: 8,
    calories: 40,
  },
  {
    id: '28',
    name: 'Підйоми ніг',
    category: 'core',
    sets: 3,
    reps: 15,
    restTime: 45,
    difficulty: 'intermediate',
    location: 'anywhere',
    equipment: ['bodyweight'],
    duration: 10,
    calories: 50,
  },
  {
    id: '29',
    name: 'Російські скручування',
    category: 'core',
    sets: 3,
    reps: 20,
    restTime: 45,
    difficulty: 'intermediate',
    location: 'anywhere',
    equipment: ['bodyweight'],
    duration: 10,
    calories: 50,
  },
  {
    id: '30',
    name: 'Велосипед',
    category: 'core',
    sets: 3,
    reps: 20,
    restTime: 45,
    difficulty: 'beginner',
    location: 'anywhere',
    equipment: ['bodyweight'],
    duration: 8,
    calories: 40,
  },

  // Кардіо
  {
    id: '31',
    name: 'Біг на місці',
    category: 'cardio',
    sets: 1,
    reps: 20,
    restTime: 0,
    difficulty: 'beginner',
    location: 'anywhere',
    equipment: ['bodyweight'],
    duration: 15,
    calories: 120,
  },
  {
    id: '32',
    name: 'Стрибки',
    category: 'cardio',
    sets: 3,
    reps: 30,
    restTime: 30,
    difficulty: 'intermediate',
    location: 'anywhere',
    equipment: ['bodyweight'],
    duration: 10,
    calories: 100,
  },
  {
    id: '33',
    name: 'Берпі',
    category: 'cardio',
    sets: 3,
    reps: 10,
    restTime: 60,
    difficulty: 'advanced',
    location: 'anywhere',
    equipment: ['bodyweight'],
    duration: 15,
    calories: 150,
  },
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

  const getExercisesByCategory = (category: ExerciseCategory) => {
    return exercises.filter((ex) => ex.category === category);
  };

  const getCategoryName = (category: ExerciseCategory): string => {
    const names: Record<ExerciseCategory, string> = {
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
