import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApp } from '../../context/AppContext'
import { COLORS, SPACING, DEFAULT_GOALS } from '../../lib/constants'

export default function ProfileScreen() {
  const { user, setUserGoals } = useApp()
  const [editingGoals, setEditingGoals] = useState(false)
  const [goals, setGoals] = useState({
    calories: user?.daily_calorie_goal || DEFAULT_GOALS.calories,
    protein: user?.daily_protein_goal || DEFAULT_GOALS.protein,
    fat: user?.daily_fat_goal || DEFAULT_GOALS.fat,
  })

  const handleSaveGoals = async () => {
    await setUserGoals(goals)
    setEditingGoals(false)
    Alert.alert('Sparat!', 'Dina mål har uppdaterats.')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
        </View>

        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Användare'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dagliga mål</Text>
            {!editingGoals && (
              <TouchableOpacity onPress={() => setEditingGoals(true)}>
                <Text style={styles.editButton}>Redigera</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.goalsCard}>
            {editingGoals ? (
              <>
                <View style={styles.goalInput}>
                  <Text style={styles.goalLabel}>🔥 Kalorier (kcal)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(goals.calories)}
                    onChangeText={(v) => setGoals({ ...goals, calories: Number(v) })}
                    keyboardType="numeric"
                    placeholder="2000"
                  />
                </View>
                <View style={styles.goalInput}>
                  <Text style={styles.goalLabel}>💪 Protein (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(goals.protein)}
                    onChangeText={(v) => setGoals({ ...goals, protein: Number(v) })}
                    keyboardType="numeric"
                    placeholder="150"
                  />
                </View>
                <View style={styles.goalInput}>
                  <Text style={styles.goalLabel}>🧈 Fett (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(goals.fat)}
                    onChangeText={(v) => setGoals({ ...goals, fat: Number(v) })}
                    keyboardType="numeric"
                    placeholder="65"
                  />
                </View>
                <View style={styles.goalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditingGoals(false)}
                  >
                    <Text style={styles.cancelButtonText}>Avbryt</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveGoals}
                  >
                    <Text style={styles.saveButtonText}>Spara</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.goalItem}>
                  <Text style={styles.goalIcon}>🔥</Text>
                  <View>
                    <Text style={styles.goalValue}>{user?.daily_calorie_goal || DEFAULT_GOALS.calories}</Text>
                    <Text style={styles.goalUnit}>kcal per dag</Text>
                  </View>
                </View>
                <View style={styles.goalItem}>
                  <Text style={styles.goalIcon}>💪</Text>
                  <View>
                    <Text style={styles.goalValue}>{user?.daily_protein_goal || DEFAULT_GOALS.protein}g</Text>
                    <Text style={styles.goalUnit}>protein per dag</Text>
                  </View>
                </View>
                <View style={styles.goalItem}>
                  <Text style={styles.goalIcon}>🧈</Text>
                  <View>
                    <Text style={styles.goalValue}>{user?.daily_fat_goal || DEFAULT_GOALS.fat}g</Text>
                    <Text style={styles.goalUnit}>fett per dag</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <View style={styles.tipsCard}>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>📸</Text>
              <Text style={styles.tipText}>
                Ta ett foto av din mat för att snabbt få reda på näringsvärden
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>📊</Text>
              <Text style={styles.tipText}>
                Följ din progress över tid för att se mönster och förbättringar
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🎯</Text>
              <Text style={styles.tipText}>
                Sätt realistiska mål för bästa resultat på lång sikt
              </Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>MatKoll</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 120,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.surface,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  editButton: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  goalsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalInput: {
    marginBottom: SPACING.md,
  },
  goalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  goalButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  goalIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  goalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  goalUnit: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  tipsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  appVersion: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
})
