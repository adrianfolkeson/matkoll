import React from 'react'
import { Tabs } from 'expo-router'
import { Text, View, StyleSheet } from 'react-native'
import { COLORS } from '../../lib/constants'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hem',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Skanna',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>📷</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historik',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>📅</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  )
}
