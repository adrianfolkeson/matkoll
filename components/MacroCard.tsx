import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS, SPACING } from '../lib/constants'

interface MacroCardProps {
  label: string
  current: number
  goal: number
  unit?: string
  color?: string
  icon: string
}

export default function MacroCard({
  label,
  current,
  goal,
  unit = 'g',
  color = COLORS.primary,
  icon,
}: MacroCardProps) {
  const percentage = Math.min((current / goal) * 100, 100)

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>
        {Math.round(current)}
        <Text style={styles.unit}> / {goal}{unit}</Text>
      </Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  icon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  unit: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  progressContainer: {
    marginTop: 'auto',
  },
  progressBackground: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
})
