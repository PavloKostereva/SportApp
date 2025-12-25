export type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
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
