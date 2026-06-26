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
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dde3eb',
    padding: 14
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
