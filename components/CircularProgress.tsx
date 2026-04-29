import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { COLORS } from '../lib/constants'

interface CircularProgressProps {
  current: number
  goal: number
  size?: number
  strokeWidth?: number
  color?: string
  label: string
  unit?: string
}

export default function CircularProgress({
  current,
  goal,
  size = 120,
  strokeWidth = 10,
  color = COLORS.primary,
  label,
  unit = 'g',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = Math.min((current / goal) * 100, 100)
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (percentage >= 100) return COLORS.success
    if (percentage >= 75) return COLORS.primary
    if (percentage >= 50) return COLORS.accent
    return COLORS.error
  }

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke={COLORS.border}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={getColor()}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={styles.value}>
          {Math.round(current)}
          <Text style={styles.goal}>/{goal}</Text>
        </Text>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  goal: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  unit: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
})
