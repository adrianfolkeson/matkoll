import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Meal, DailyProgress } from '../types'
import { supabase } from '../lib/supabase'
import { DEFAULT_GOALS } from '../lib/constants'

interface AppContextType {
  user: User | null
  loading: boolean
  todayProgress: DailyProgress
  setUserGoals: (goals: { calories?: number; protein?: number; fat?: number }) => Promise<void>
  addMeal: (meal: Omit<Meal, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  deleteMeal: (mealId: string) => Promise<void>
  refreshProgress: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [todayProgress, setTodayProgress] = useState<DailyProgress>({
    calories: 0,
    protein: 0,
    fat: 0,
    meals: [],
  })

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const fetchMeals = async (date: string = getTodayDate()) => {
    if (!user) return

    const { data: meals, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .gte('scanned_at', `${date}T00:00:00`)
      .lte('scanned_at', `${date}T23:59:59`)
      .order('scanned_at', { ascending: true })

    if (error) {
      console.error('Error fetching meals:', error)
      return
    }

    const totals = (meals || []).reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        fat: acc.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, fat: 0 }
    )

    setTodayProgress({
      ...totals,
      meals: meals || [],
    })
  }

  const fetchUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profile) {
      setUser({
        ...profile,
        daily_calorie_goal: profile.daily_calorie_goal || DEFAULT_GOALS.calories,
        daily_protein_goal: profile.daily_protein_goal || DEFAULT_GOALS.protein,
        daily_fat_goal: profile.daily_fat_goal || DEFAULT_GOALS.fat,
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchMeals()
    }
  }, [user])

  const setUserGoals = async (goals: { calories?: number; protein?: number; fat?: number }) => {
    if (!user) return

    const updates: Partial<User> = {}
    if (goals.calories !== undefined) updates.daily_calorie_goal = goals.calories
    if (goals.protein !== undefined) updates.daily_protein_goal = goals.protein
    if (goals.fat !== undefined) updates.daily_fat_goal = goals.fat

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)

    if (!error) {
      setUser({ ...user, ...updates })
    }
  }

  const addMeal = async (meal: Omit<Meal, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return

    const { error } = await supabase.from('meals').insert({
      user_id: user.id,
      ...meal,
    })

    if (!error) {
      fetchMeals()
    }
  }

  const deleteMeal = async (mealId: string) => {
    const { error } = await supabase.from('meals').delete().eq('id', mealId)

    if (!error) {
      fetchMeals()
    }
  }

  const refreshProgress = async () => {
    await fetchMeals()
  }

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        todayProgress,
        setUserGoals,
        addMeal,
        deleteMeal,
        refreshProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
