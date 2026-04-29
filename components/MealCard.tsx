import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Meal } from '../types'
import { COLORS, SPACING, MEAL_TYPES, MEAL_ICONS } from '../lib/constants'

interface MealCardProps {
  meal: Meal
  onPress?: () => void
  onDelete?: () => void
}

export default function MealCard({ meal, onPress, onDelete }: MealCardProps) {
  const time = new Date(meal.scanned_at).toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{MEAL_ICONS[meal.meal_type]}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.mealType}>{MEAL_TYPES[meal.meal_type]}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.foodName}>{meal.food_name}</Text>
        <View style={styles.macros}>
          <Text style={styles.macro}>
            🔥 {Math.round(meal.calories)} kcal
          </Text>
          <Text style={styles.macro}>
            💪 {Math.round(meal.protein)}g P
          </Text>
          <Text style={styles.macro}>
            🧈 {Math.round(meal.fat)}g F
          </Text>
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  mealType: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  macros: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  macro: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  deleteText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
})
