import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useLocalSearchParams } from 'expo-router'
import { COLORS, SPACING, MEAL_TYPES } from '../../lib/constants'

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams()

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Måltidsdetaljer',
          headerBackTitle: 'Tillbaka',
        }}
      />
      <View style={styles.content}>
        <Text style={styles.text}>Måltid {id}</Text>
        <Text style={styles.subtext}>
          Detaljer för denna måltid kommer snart...
        </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtext: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
})
