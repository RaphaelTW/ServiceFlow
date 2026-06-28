import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function MetricCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 126,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(221,227,235,0.86)',
    padding: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.07,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4
  },
  icon: {
    marginBottom: 12
  },
  label: {
    color: '#64748b',
    fontWeight: '700'
  },
  value: {
    marginTop: 8,
    color: '#172033',
    fontSize: 24,
    fontWeight: '900'
  }
});
