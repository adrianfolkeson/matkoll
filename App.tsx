import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { AppProvider } from '../context/AppContext'
import { COLORS, SPACING } from '../lib/constants'

// Simple Tab Screens
function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Hem</Text>
        <Text style={styles.welcome}>Välkommen till MatKoll!</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Dagens progress</Text>
          <Text style={styles.cardText}>Inga måltider loggade än</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('scan')}>
          <Text style={styles.buttonText}>+ Skanna mat</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function ScanScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.center}>
        <Text style={styles.title}>Skanna mat</Text>
        <Text style={styles.subtitle}>Ta ett foto för att analysera</Text>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraText}>Kamera</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

function HistoryScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Historik</Text>
        <Text style={styles.subtitle}>Dina tidigare måltider</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Ingen historik än</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profil</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Inställningar</Text>
          <Text style={styles.cardText}>Dagliga mål</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const screens: Record<string, React.ComponentType<any>> = {
  home: HomeScreen,
  scan: ScanScreen,
  history: HistoryScreen,
  profile: ProfileScreen,
}

const tabIcons: Record<string, string> = {
  home: '🏠',
  scan: '📷',
  history: '📅',
  profile: '👤',
}

function TabBar({ activeTab, onTabPress }: { activeTab: string; onTabPress: (tab: string) => void }) {
  return (
    <View style={styles.tabBar}>
      {Object.keys(screens).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.tabItem}
          onPress={() => onTabPress(tab)}
        >
          <Text style={[styles.tabIcon, activeTab === tab && styles.tabIconActive]}>
            {tabIcons[tab]}
          </Text>
          <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

function MainNavigator() {
  const [activeTab, setActiveTab] = useState('home')
  const ScreenComponent = screens[activeTab]
  
  return (
    <View style={styles.container}>
      <ScreenComponent navigation={{ navigate: setActiveTab }} />
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  welcome: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  cameraPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.surface,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  cameraText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
})
