import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useApp } from '../../context/AppContext'
import MealCard from '../../components/MealCard'
import { COLORS, SPACING, MEAL_TYPES } from '../../lib/constants'
import { Meal } from '../../types'
import { supabase } from '../../lib/supabase'

type MealType = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'

export default function HistoryScreen() {
  const router = useRouter()
  const { user, refreshProgress } = useApp()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedFilter, setSelectedFilter] = useState<MealType>('all')
  const [meals, setMeals] = useState<Meal[]>([])

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date
  })

  useEffect(() => {
    fetchMeals()
  }, [selectedDate, selectedFilter, user])

  const fetchMeals = async () => {
    if (!user || !supabase) return

    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    let query = supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .gte('scanned_at', startOfDay.toISOString())
      .lte('scanned_at', endOfDay.toISOString())
      .order('scanned_at', { ascending: true })

    if (selectedFilter !== 'all') {
      query = query.eq('meal_type', selectedFilter)
    }

    const { data } = await query
    setMeals(data || [])
  }

  const deleteMeal = async (mealId: string) => {
    if (!supabase) return
    
    Alert.alert(
      'Ta bort måltid',
      'Är du säker på att du vill ta bort denna måltid?',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('meals').delete().eq('id', mealId)
            fetchMeals()
            refreshProgress()
          },
        },
      ]
    )
  }

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, fat: 0 }
  )

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Idag'
    if (date.toDateString() === yesterday.toDateString()) return 'Igår'
    
    return date.toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric' })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Historik</Text>
        </View>

        {/* Date Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateSelector}
          contentContainerStyle={styles.dateSelectorContent}
        >
          {dates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                date.toDateString() === selectedDate.toDateString() &&
                  styles.dateItemActive,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dateDay,
                  date.toDateString() === selectedDate.toDateString() &&
                    styles.dateDayActive,
                ]}
              >
                {date.toLocaleDateString('sv-SE', { weekday: 'short' }).slice(0, 2)}
              </Text>
              <Text
                style={[
                  styles.dateNumber,
                  date.toDateString() === selectedDate.toDateString() &&
                    styles.dateNumberActive,
                ]}
              >
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterSelector}
          contentContainerStyle={styles.filterContent}
        >
          {[{ key: 'all', label: 'Alla' }, ...Object.entries(MEAL_TYPES).map(([key, label]) => ({ key, label }))].map(
            ({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterButton,
                  selectedFilter === key && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter(key as MealType)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === key && styles.filterTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* Daily Totals */}
        <View style={styles.totalsCard}>
          <Text style={styles.totalsTitle}>Dagens total</Text>
          <View style={styles.totalsRow}>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>🔥 {Math.round(totals.calories)}</Text>
              <Text style={styles.totalLabel}>kcal</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>💪 {Math.round(totals.protein)}g</Text>
              <Text style={styles.totalLabel}>protein</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>🧈 {Math.round(totals.fat)}g</Text>
              <Text style={styles.totalLabel}>fett</Text>
            </View>
          </View>
        </View>

        {/* Meals List */}
        <ScrollView
          style={styles.mealsList}
          showsVerticalScrollIndicator={false}
        >
          {meals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyText}>Inga måltider denna dag</Text>
            </View>
          ) : (
            meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onDelete={() => deleteMeal(meal.id)}
              />
            ))
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dateSelector: {
    marginBottom: SPACING.md,
  },
  dateSelectorContent: {
    gap: SPACING.sm,
    paddingRight: SPACING.lg,
  },
  dateItem: {
    width: 56,
    height: 72,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateDay: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  dateDayActive: {
    color: COLORS.surface,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dateNumberActive: {
    color: COLORS.surface,
  },
  filterSelector: {
    marginBottom: SPACING.lg,
  },
  filterContent: {
    gap: SPACING.sm,
    paddingRight: SPACING.lg,
  },
  filterButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.surface,
  },
  totalsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  totalsTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  totalItem: {
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mealsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
})
