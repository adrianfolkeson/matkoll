import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useApp } from '../../context/AppContext'
import CircularProgress from '../../components/CircularProgress'
import MacroCard from '../../components/MacroCard'
import MealCard from '../../components/MealCard'
import { COLORS, SPACING } from '../../lib/constants'

export default function HomeScreen() {
  const router = useRouter()
  const { user, todayProgress } = useApp()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Godmorgon'
    if (hour < 18) return 'God eftermiddag'
    return 'God kväll'
  }

  const caloriePercentage = Math.round((todayProgress.calories / (user?.daily_calorie_goal || 2000)) * 100)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{user?.name || 'Användare'}</Text>
        </View>
        <View style={styles.progressSection}>
          <CircularProgress current={todayProgress.calories} goal={user?.daily_calorie_goal || 2000} size={180} strokeWidth={14} label="Kalorier" unit="kcal" />
          <Text style={styles.progressText}>{caloriePercentage}% av dagens mål</Text>
        </View>
        <View style={styles.macroSection}>
          <MacroCard label="Protein" current={todayProgress.protein} goal={user?.daily_protein_goal || 150} unit="g" color={COLORS.secondary} icon="💪" />
          <MacroCard label="Fett" current={todayProgress.fat} goal={user?.daily_fat_goal || 65} unit="g" color={COLORS.accent} icon="🧈" />
        </View>
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dagens måltider</Text>
            <Text style={styles.viewAll} onPress={() => router.push('/history')}>Se alla</Text>
          </View>
          {todayProgress.meals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyText}>Inga måltider ännu idag</Text>
              <Text style={styles.emptySubtext}>Tryck på "Skanna" för att lägga till din första måltid</Text>
            </View>
          ) : (
            todayProgress.meals.slice(0, 3).map((meal) => (
              <MealCard key={meal.id} meal={meal} onPress={() => router.push(`/meal/${meal.id}`)} />
            ))
          )}
        </View>
        <View style={styles.quickAddSection}>
          <Text style={styles.quickAddButton} onPress={() => router.push('/scan')}>+ Lägg till måltid</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: 120 },
  header: { marginBottom: SPACING.lg },
  greeting: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  name: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary, marginTop: 4 },
  progressSection: { alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 24, padding: SPACING.xl, marginBottom: SPACING.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  progressText: { fontSize: 14, color: COLORS.textSecondary, marginTop: SPACING.md, fontWeight: '500' },
  macroSection: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.lg },
  mealsSection: { marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  viewAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  emptyState: { alignItems: 'center', padding: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: 16 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.xs },
  emptySubtext: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  quickAddSection: { alignItems: 'center' },
  quickAddButton: { backgroundColor: COLORS.primary, color: COLORS.surface, paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, borderRadius: 24, fontSize: 16, fontWeight: '700', overflow: 'hidden' },
})
