export interface WeightEntry {
  date: string;
  weight: number;
}

export type Lifestyle = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
export type Goal = 'lose' | 'gain' | 'maintain';

export interface UserData {
  weight: number | null;
  height: number | null;
  lifestyle: Lifestyle | null;
  goal: Goal | null;
  workoutTime: number | null;
  hasCompletedOnboarding: boolean;
  weightHistory: WeightEntry[];
  name?: string;
}
