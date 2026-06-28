import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api, request } from '../services/api';

type CustomerListItem = {
  id: number;
  name: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  is_active?: number;
};

export function CustomersScreen() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [query, setQuery] = useState('');

  async function load() {
    setCustomers(await api<CustomerListItem[]>('/customers', token));
  }

  useEffect(() => {
    load().catch(() => setCustomers([]));
  }, [token]);

  const filtered = useMemo(() => customers.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())), [customers, query]);

  function confirmStatus(item: CustomerListItem) {
    const active = item.is_active === undefined || item.is_active === 1;
    Alert.alert(active ? 'Desativar cliente?' : 'Ativar cliente?', active ? 'O cliente ficará no histórico.' : 'O cliente voltará para a operação.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: active ? 'Desativar' : 'Ativar',
        style: active ? 'destructive' : 'default',
        onPress: async () => {
          await request(active ? `/customers/${item.id}` : `/customers/${item.id}/activate`, active ? 'DELETE' : 'PATCH', token);
          await load();
        }
      }
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clientes</Text>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <View style={styles.search}>
        <Ionicons name="search-outline" size={18} color="#64748b" />
        <TextInput placeholder="Pesquisar por nome, CPF/CNPJ ou WhatsApp" value={query} onChangeText={setQuery} style={styles.input} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const active = item.is_active === undefined || item.is_active === 1;
          return (
            <TouchableOpacity style={[styles.card, !active && styles.inactiveCard]} onLongPress={() => confirmStatus(item)}>
              <View style={styles.avatar}><Text>{item.name.slice(0, 1)}</Text></View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.phone ?? item.whatsapp ?? '-'} - {item.city ?? 'Sem cidade'}</Text>
              </View>
              <TouchableOpacity style={styles.statusButton} onPress={() => confirmStatus(item)}>
                <Ionicons name={active ? 'trash-outline' : 'checkmark-circle-outline'} size={22} color={active ? '#ff3b30' : '#30b981'} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  button: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#007aff' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, padding: 12, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.86)', borderWidth: 1, borderColor: 'rgba(221,227,235,0.86)' },
  input: { flex: 1 },
  list: { gap: 10, paddingTop: 14 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: 'rgba(255,255,255,0.86)', borderRadius: 22, borderWidth: 1, borderColor: 'rgba(221,227,235,0.86)', shadowColor: '#0f172a', shadowOpacity: 0.07, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 3 },
  inactiveCard: { opacity: 0.58 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eaf4ff' },
  info: { flex: 1 },
  name: { fontWeight: '900', color: '#111827' },
  meta: { color: '#64748b', marginTop: 3 },
  statusButton: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f7fb' }
});

