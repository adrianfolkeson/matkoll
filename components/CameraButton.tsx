import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { COLORS, SPACING } from '../lib/constants'

interface CameraButtonProps {
  onPress: () => void
  onGalleryPress?: () => void
}

export default function CameraButton({ onPress, onGalleryPress }: CameraButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>📷</Text>
        <Text style={styles.text}>Skanna mat</Text>
      </TouchableOpacity>
      
      {onGalleryPress && (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onGalleryPress}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryIcon}>🖼️</Text>
          <Text style={styles.secondaryText}>Galleri</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  text: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  secondaryIcon: {
    fontSize: 16,
  },
  secondaryText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
})
