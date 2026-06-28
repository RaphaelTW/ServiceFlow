import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MetricCard } from '../components/MetricCard';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

type Dashboard = {
  metrics: {
    customers_count: number;
    open_orders: number;
    monthly_revenue: number;
  };
  upcoming: Array<{ id: number; title: string; scheduled_at?: string }>;
};

export function HomeScreen() {
  const { offline, setOffline, token, userName, logout } = useAuth();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  useEffect(() => {
    api<Dashboard>('/dashboard', token).then(setDashboard).catch(() => setDashboard(null));
  }, [token]);

  function confirmLogout() {
    Alert.alert('Sair da conta?', 'Sua sessão será encerrada neste aparelho.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout }
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ServiceFlow Mobile</Text>
          <Text style={styles.title}>Olá, {userName || 'técnico'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.syncButton} onPress={() => setOffline(!offline)}>
            <Ionicons name={offline ? 'cloud-offline-outline' : 'cloud-done-outline'} size={20} color={offline ? '#ff9f0a' : '#30b981'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.syncButton} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.grid}>
        <MetricCard label="Clientes" value={String(dashboard?.metrics.customers_count ?? '--')} icon={<Ionicons name="people-outline" size={24} color="#007aff" />} />
        <MetricCard label="OS abertas" value={String(dashboard?.metrics.open_orders ?? '--')} icon={<Ionicons name="clipboard-outline" size={24} color="#ff9f0a" />} />
      </View>
      <View style={styles.grid}>
        <MetricCard label="Receita mês" value={Number(dashboard?.metrics.monthly_revenue ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={<Ionicons name="cash-outline" size={24} color="#30b981" />} />
        <MetricCard label="Sync" value={offline ? 'Offline' : 'Online'} icon={<Ionicons name="swap-horizontal-outline" size={24} color="#007aff" />} />
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Próximos atendimentos</Text>
        {(dashboard?.upcoming ?? []).map((item) => (
          <View style={styles.row} key={item.id}>
            <Ionicons name="calendar-outline" size={20} color="#007aff" />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowMeta}>{item.scheduled_at ? new Date(item.scheduled_at).toLocaleString('pt-BR') : 'Sem data'} - GPS e assinatura habilitados</Text>
            </View>
          </View>
        ))}
        {dashboard?.upcoming?.length === 0 && <Text style={styles.muted}>Nenhum atendimento próximo.</Text>}
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Sincronização</Text>
        <Text style={styles.muted}>{offline ? 'Modo offline ativo. As alterações entram na fila local.' : 'Sincronização automática ativa para clientes, OS, fotos e assinaturas.'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerActions: { flexDirection: 'row', gap: 8 },
  eyebrow: { color: '#30b981', fontWeight: '900', textTransform: 'uppercase' },
  title: { color: '#111827', fontSize: 28, fontWeight: '900' },
  syncButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(221,227,235,0.86)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4
  },
  grid: { flexDirection: 'row', gap: 12 },
  panel: {
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(221,227,235,0.86)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.07,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4
  },
  panelTitle: { fontWeight: '900', fontSize: 16, marginBottom: 10, color: '#111827' },
  row: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#edf1f6' },
  rowBody: { flex: 1 },
  rowTitle: { fontWeight: '800', color: '#111827' },
  rowMeta: { color: '#64748b' },
  muted: { color: '#64748b', lineHeight: 20 }
});

