import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { CustomersScreen } from './src/screens/CustomersScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { LoginScreen } from './src/screens/LoginScreen';

const tabs = [
  { key: 'home', label: 'Home', icon: 'grid-outline' },
  { key: 'customers', label: 'Clientes', icon: 'people-outline' },
  { key: 'orders', label: 'Ordens', icon: 'clipboard-outline' },
  { key: 'scanner', label: 'Scanner', icon: 'scan-outline' }
] as const;

function AppShell() {
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('home');
  const { token } = useAuth();

  if (!token) {
    return <LoginScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.backgroundGlow} />
      <View style={styles.content}>
        {tab === 'home' && <HomeScreen />}
        {tab === 'customers' && <CustomersScreen />}
        {tab === 'orders' && <OrdersScreen />}
        {tab === 'scanner' && <ScannerScreen />}
      </View>
      <View style={styles.tabs}>
        {tabs.map((item) => (
          <TouchableOpacity key={item.key} style={[styles.tab, tab === item.key && styles.activeTab]} onPress={() => setTab(item.key)}>
            <Ionicons name={item.icon} size={22} color={tab === item.key ? '#007aff' : '#64748b'} />
            <Text style={[styles.tabText, tab === item.key && styles.activeText]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7'
  },
  backgroundGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    right: -160,
    top: -120,
    backgroundColor: 'rgba(0,122,255,0.12)'
  },
  content: {
    flex: 1
  },
  tabs: {
    flexDirection: 'row',
    margin: 12,
    padding: 8,
    gap: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(221,227,235,0.86)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 17
  },
  activeTab: {
    backgroundColor: 'rgba(0,122,255,0.1)'
  },
  tabText: {
    marginTop: 3,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700'
  },
  activeText: {
    color: '#007aff'
  }
});
