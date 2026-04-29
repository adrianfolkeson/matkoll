import React from 'react'
import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../lib/constants'

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  const isFocused = focused === true
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.icon, isFocused && styles.iconFocused]}>{icon}</Text>
      <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text>
    </View>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingBottom: 24,
          paddingTop: 8,
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon icon="🏠" label="Hem" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon icon="📷" label="Skanna" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon icon="📅" label="Historik" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon icon="👤" label="Profil" focused={focused} />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  labelFocused: {
    color: COLORS.primary,
    fontWeight: '600',
  },
})
