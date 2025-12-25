export interface FoodProduct {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  category: 'fruit' | 'vegetable' | 'meat' | 'dairy' | 'grain' | 'snack' | 'drink' | 'other';
  unit: 'g' | 'ml' | 'piece' | 'cup' | 'tbsp' | 'tsp';
  defaultAmount: number;
}

export interface FoodEntry {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  timestamp: number;
}

export interface DailyNutrition {
  date: string;
  entries: FoodEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  burnedCalories: number;
}

export interface NutritionGoal {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionRecommendation {
  type: 'warning' | 'info' | 'success' | 'suggestion';
  message: string;
  icon: string;
}

