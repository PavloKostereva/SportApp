import { Exercise, WorkoutDay } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface WorkoutDaysContextType {
  workoutDays: WorkoutDay[];
  addWorkoutDay: (day: Omit<WorkoutDay, 'id'>) => Promise<void>;
  updateWorkoutDay: (id: string, updates: Partial<WorkoutDay>) => Promise<void>;
  deleteWorkoutDay: (id: string) => Promise<void>;
  addExerciseToDay: (dayId: string, exerciseId: string) => Promise<void>;
  removeExerciseFromDay: (dayId: string, exerciseId: string) => Promise<void>;
  getDayExercises: (dayId: string, allExercises: Exercise[]) => Exercise[];
  markDayAsCompleted: (dayId: string) => Promise<void>;
  unmarkDayAsCompleted: (dayId: string) => Promise<void>;
}

const WorkoutDaysContext = createContext<WorkoutDaysContextType | undefined>(undefined);

const WORKOUT_DAYS_KEY = 'workout_days_data';

const defaultWorkoutDays: WorkoutDay[] = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  dayNumber: i + 1,
  name: `День ${i + 1}`,
  exercises: [],
  completed: false,
}));

export function WorkoutDaysProvider({ children }: { children: ReactNode }) {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(defaultWorkoutDays);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkoutDays();
  }, []);

  const createWorkoutProgram = (): WorkoutDay[] => {
    const program: WorkoutDay[] = [];

    const workoutTemplates = [
      // День 1: Груди + Трицепс
      { name: 'День 1: Груди + Трицепс', exercises: ['1', '2', '3', '23', '24'] },
      // День 2: Спина + Біцепс
      { name: 'День 2: Спина + Біцепс', exercises: ['6', '7', '8', '21', '25'] },
      // День 3: Ноги + Прес
      { name: 'День 3: Ноги + Прес', exercises: ['11', '12', '13', '26', '27'] },
      // День 4: Плечі + Руки
      { name: 'День 4: Плечі + Руки', exercises: ['17', '18', '19', '22', '24'] },
      // День 5: Кардіо + Прес
      { name: 'День 5: Кардіо + Прес', exercises: ['31', '32', '28', '29'] },
      // День 6: Відпочинок
      { name: 'День 6: Відпочинок', exercises: [] },
      // День 7: Повний body
      { name: 'День 7: Повний body', exercises: ['1', '6', '11', '17', '26', '31'] },
    ];

    for (let i = 0; i < 30; i++) {
      const templateIndex = i % 7;
      const template = workoutTemplates[templateIndex];
      const weekNumber = Math.floor(i / 7) + 1;

      program.push({
        id: String(i + 1),
        dayNumber: i + 1,
        name: template.name,
        exercises: [...template.exercises],
        completed: false,
      });
    }

    return program;
  };

  const loadWorkoutDays = async () => {
    try {
      const stored = await AsyncStorage.getItem(WORKOUT_DAYS_KEY);
      if (stored) {
        const loadedDays = JSON.parse(stored);
        // Перевіряємо, чи є вправи в днях
        const hasExercises = loadedDays.some((d: WorkoutDay) => d.exercises.length > 0);

        if (!hasExercises || loadedDays.length < 30) {
          // Якщо немає вправ або менше 30 днів, створюємо програму
          const program = createWorkoutProgram();

          if (loadedDays.length > 0) {
            // Зберігаємо статус завершення з існуючих днів
            const existingDaysMap = new Map<number, WorkoutDay>(
              loadedDays.map((d: WorkoutDay) => [d.dayNumber, d]),
            );
            const updatedProgram = program.map((day) => {
              const existing = existingDaysMap.get(day.dayNumber);
              if (existing) {
                return {
                  ...day,
                  completed: existing.completed,
                  date: existing.date,
                  // Зберігаємо вправи, якщо вони вже були додані користувачем
                  exercises: existing.exercises.length > 0 ? existing.exercises : day.exercises,
                };
              }
              return day;
            });
            await saveWorkoutDays(updatedProgram);
            setWorkoutDays(updatedProgram);
          } else {
            await saveWorkoutDays(program);
            setWorkoutDays(program);
          }
        } else {
          setWorkoutDays(loadedDays);
        }
      } else {
        const program = createWorkoutProgram();
        await saveWorkoutDays(program);
        setWorkoutDays(program);
      }
    } catch (error) {
      console.log('Error loading workout days:', error);
      const program = createWorkoutProgram();
      await saveWorkoutDays(program);
      setWorkoutDays(program);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorkoutDays = async (days: WorkoutDay[]) => {
    try {
      await AsyncStorage.setItem(WORKOUT_DAYS_KEY, JSON.stringify(days));
      setWorkoutDays(days);
    } catch (error) {
      console.log('Error saving workout days:', error);
    }
  };

  const addWorkoutDay = async (day: Omit<WorkoutDay, 'id'>) => {
    const newDay: WorkoutDay = {
      ...day,
      id: Date.now().toString(),
    };
    const updated = [...workoutDays, newDay].sort((a, b) => a.dayNumber - b.dayNumber);
    await saveWorkoutDays(updated);
  };

  const updateWorkoutDay = async (id: string, updates: Partial<WorkoutDay>) => {
    const updated = workoutDays.map((day) => (day.id === id ? { ...day, ...updates } : day));
    await saveWorkoutDays(updated);
  };

  const deleteWorkoutDay = async (id: string) => {
    const updated = workoutDays.filter((day) => day.id !== id);
    await saveWorkoutDays(updated);
  };

  const addExerciseToDay = async (dayId: string, exerciseId: string) => {
    const updated = workoutDays.map((day) => {
      if (day.id === dayId && !day.exercises.includes(exerciseId)) {
        return { ...day, exercises: [...day.exercises, exerciseId] };
      }
      return day;
    });
    await saveWorkoutDays(updated);
  };

  const removeExerciseFromDay = async (dayId: string, exerciseId: string) => {
    const updated = workoutDays.map((day) => {
      if (day.id === dayId) {
        return { ...day, exercises: day.exercises.filter((id) => id !== exerciseId) };
      }
      return day;
    });
    await saveWorkoutDays(updated);
  };

  const getDayExercises = (dayId: string, allExercises: Exercise[]): Exercise[] => {
    const day = workoutDays.find((d) => d.id === dayId);
    if (!day) return [];
    return allExercises.filter((ex) => day.exercises.includes(ex.id));
  };

  const markDayAsCompleted = async (dayId: string) => {
    const updated = workoutDays.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          completed: true,
          date: new Date().toISOString().split('T')[0],
        };
      }
      return day;
    });
    await saveWorkoutDays(updated);
  };

  const unmarkDayAsCompleted = async (dayId: string) => {
    const updated = workoutDays.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          completed: false,
          date: undefined,
        };
      }
      return day;
    });
    await saveWorkoutDays(updated);
  };

  if (isLoading) {
    return null;
  }

  return (
    <WorkoutDaysContext.Provider
      value={{
        workoutDays,
        addWorkoutDay,
        updateWorkoutDay,
        deleteWorkoutDay,
        addExerciseToDay,
        removeExerciseFromDay,
        getDayExercises,
        markDayAsCompleted,
        unmarkDayAsCompleted,
      }}>
      {children}
    </WorkoutDaysContext.Provider>
  );
}

export function useWorkoutDays() {
  const context = useContext(WorkoutDaysContext);
  if (context === undefined) {
    throw new Error('useWorkoutDays must be used within a WorkoutDaysProvider');
  }
  return context;
}
