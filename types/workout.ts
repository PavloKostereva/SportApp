import { Exercise } from './exercise';

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  name: string;
  exercises: string[]; // Array of exercise IDs
  completed: boolean;
  date?: string; // Optional date when workout was completed
}

export interface WorkoutDayWithExercises extends WorkoutDay {
  exerciseList: Exercise[];
}

