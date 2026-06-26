import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MetricCard } from '../components/MetricCard';
import { useAuth } from '../context/AuthContext';

export function HomeScreen() {
  const { offline, setOffline } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ServiceFlow Mobile</Text>
          <Text style={styles.title}>Operação em campo</Text>
        </View>
        <TouchableOpacity style={styles.syncButton} onPress={() => setOffline(!offline)}>
          <Ionicons name={offline ? 'cloud-offline-outline' : 'cloud-done-outline'} size={20} color={offline ? '#b45309' : '#0f766e'} />
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        <MetricCard label="Clientes" value="32" icon={<Ionicons name="people-outline" size={24} color="#2563eb" />} />
        <MetricCard label="OS abertas" value="8" icon={<Ionicons name="clipboard-outline" size={24} color="#b45309" />} />
      </View>
      <View style={styles.grid}>
        <MetricCard label="Receita mês" value="R$ 8,4k" icon={<Ionicons name="cash-outline" size={24} color="#0f766e" />} />
        <MetricCard label="Pendências" value="3" icon={<Ionicons name="alert-circle-outline" size={24} color="#be123c" />} />
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Próximos atendimentos</Text>
        {['Manutenção mensal', 'Instalação residencial', 'Visita técnica'].map((item, index) => (
          <View style={styles.row} key={item}>
            <Ionicons name="calendar-outline" size={20} color="#2563eb" />
            <View>
              <Text style={styles.rowTitle}>{item}</Text>
              <Text style={styles.rowMeta}>{index + 1} dia(s) - GPS e assinatura habilitados</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Sincronização</Text>
        <Text style={styles.muted}>{offline ? 'Modo offline ativo. As alterações entram na fila local.' : 'Sincronização automática ativa para clientes, OS, fotos e assinaturas.'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 14
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eyebrow: {
    color: '#0f766e',
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  title: {
    color: '#172033',
    fontSize: 28,
    fontWeight: '900'
  },
  syncButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dde3eb'
  },
  grid: {
    flexDirection: 'row',
    gap: 12
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dde3eb'
  },
  panelTitle: {
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 10,
    color: '#172033'
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f6'
  },
  rowTitle: {
    fontWeight: '800',
    color: '#172033'
  },
  rowMeta: {
    color: '#64748b'
  },
  muted: {
    color: '#64748b',
    lineHeight: 20
  }
});

