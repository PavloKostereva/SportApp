export type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';
export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseLocation = 'gym' | 'home' | 'outdoor' | 'anywhere';
export type ExerciseEquipment =
  | 'bodyweight'
  | 'dumbbells'
  | 'barbell'
  | 'machine'
  | 'cable'
  | 'resistance-band'
  | 'kettlebell'
  | 'none';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
  notes?: string;
  difficulty?: ExerciseDifficulty;
  location?: ExerciseLocation;
  equipment?: ExerciseEquipment[];
  duration?: number; // Duration in minutes
  calories?: number; // Estimated calories burned
}

export interface ExerciseProgress {
  exerciseId: string;
  date: string;
  completedSets: number;
  totalSets: number;
}
