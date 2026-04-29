import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { useApp } from '../../context/AppContext'
import CameraButton from '../../components/CameraButton'
import { scanFood } from '../../lib/minimax'
import { COLORS, SPACING, MEAL_TYPES } from '../../lib/constants'
import { Meal } from '../../types'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export default function ScanScreen() {
  const router = useRouter()
  const { addMeal } = useApp()
  const [loading, setLoading] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch')
  const [portion, setPortion] = useState(100)

  const pickImage = async (useCamera: boolean) => {
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      Alert.alert('Tillstånd nekad', 'Du måste ge tillstånd för att använda kameran.')
      return
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        })

    if (!result.canceled && result.assets[0].base64) {
      handleScan(result.assets[0].base64)
    }
  }

  const handleScan = async (base64: string) => {
    setLoading(true)
    try {
      const result = await scanFood(base64)
      
      // Calculate macros based on portion
      const calories = (result.calories * portion) / 100
      const protein = (result.protein * portion) / 100
      const fat = (result.fat * portion) / 100

      const meal: Omit<Meal, 'id' | 'user_id' | 'created_at'> = {
        meal_type: selectedMealType,
        food_name: result.food_name,
        calories,
        protein,
        fat,
        scanned_at: new Date().toISOString(),
      }

      await addMeal(meal)
      
      Alert.alert(
        'Måltid tillagd! ✅',
        `${result.food_name}\n🔥 ${Math.round(calories)} kcal\n💪 ${Math.round(protein)}g protein\n🧈 ${Math.round(fat)}g fett`,
        [{ text: 'OK', onPress: () => router.push('/') }]
      )
    } catch (error) {
      Alert.alert('Fel', 'Kunde inte analysera maten. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Skanna mat</Text>
          <Text style={styles.subtitle}>
            Ta en bild av din måltid så beräknar vi kalorier och makron
          </Text>
        </View>

        {/* Camera Button */}
        <View style={styles.cameraSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Analyserar din mat...</Text>
            </View>
          ) : (
            <>
              <CameraButton
                onPress={() => pickImage(true)}
                onGalleryPress={() => pickImage(false)}
              />
              <Text style={styles.hint}>
                Tryck på kameran för att ta ett foto
              </Text>
            </>
          )}
        </View>

        {/* Meal Type Selector */}
        <View style={styles.selectorSection}>
          <Text style={styles.selectorLabel}>Måltidstyp</Text>
          <View style={styles.mealTypes}>
            {(Object.keys(MEAL_TYPES) as MealType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeButton,
                  selectedMealType === type && styles.mealTypeButtonActive,
                ]}
                onPress={() => setSelectedMealType(type)}
              >
                <Text
                  style={[
                    styles.mealTypeText,
                    selectedMealType === type && styles.mealTypeTextActive,
                  ]}
                >
                  {MEAL_TYPES[type]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Portion Size */}
        <View style={styles.selectorSection}>
          <Text style={styles.selectorLabel}>Portionsstorlek: {portion}g</Text>
          <View style={styles.portionButtons}>
            {[50, 100, 150, 200, 250].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.portionButton,
                  portion === size && styles.portionButtonActive,
                ]}
                onPress={() => setPortion(size)}
              >
                <Text
                  style={[
                    styles.portionText,
                    portion === size && styles.portionTextActive,
                  ]}
                >
                  {size}g
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  cameraSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  hint: {
    marginTop: SPACING.lg,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectorSection: {
    marginBottom: SPACING.lg,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  mealTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  mealTypeButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mealTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  mealTypeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  mealTypeTextActive: {
    color: COLORS.surface,
  },
  portionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  portionButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  portionButtonActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  portionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  portionTextActive: {
    color: COLORS.surface,
  },
})
