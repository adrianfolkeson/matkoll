export interface User {
  id: string
  email: string
  name: string
  daily_calorie_goal: number
  daily_protein_goal: number
  daily_fat_goal: number
  created_at: string
}

export interface Meal {
  id: string
  user_id: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  food_name: string
  calories: number
  protein: number
  fat: number
  image_url?: string
  scanned_at: string
  created_at: string
}

export interface FoodItem {
  id: string
  name: string
  calories_per_100g: number
  protein_per_100g: number
  fat_per_100g: number
  portion_default: number
}

export interface ScanResult {
  food_name: string
  calories: number
  protein: number
  fat: number
  confidence: number
}

export interface DailyProgress {
  calories: number
  protein: number
  fat: number
  meals: Meal[]
}
