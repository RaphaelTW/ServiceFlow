import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api, request } from '../services/api';

type OrderListItem = {
  id: number;
  code: string;
  title: string;
  status: string;
  total: number;
  is_active?: number;
};

export function OrdersScreen() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]);

  async function load() {
    setOrders(await api<OrderListItem[]>('/work-orders', token));
  }

  useEffect(() => {
    load().catch(() => setOrders([]));
  }, [token]);

  function confirmStatus(item: OrderListItem) {
    const active = item.is_active === undefined || item.is_active === 1;
    Alert.alert(active ? 'Desativar ordem?' : 'Ativar ordem?', active ? 'A OS ficará no histórico.' : 'A OS voltará para a operação.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: active ? 'Desativar' : 'Ativar',
        style: active ? 'destructive' : 'default',
        onPress: async () => {
          await request(active ? `/work-orders/${item.id}` : `/work-orders/${item.id}/activate`, active ? 'DELETE' : 'PATCH', token);
          await load();
        }
      }
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ordens</Text>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const active = item.is_active === undefined || item.is_active === 1;
          return (
            <View style={[styles.card, !active && styles.inactiveCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.code}>{item.code}</Text>
                <Text style={styles.value}>{Number(item.total ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
              </View>
              <Text style={styles.name}>{item.title}</Text>
              <View style={styles.actions}>
                <Text style={styles.status}>{item.status}</Text>
                <View style={styles.actionIcons}>
                  <Ionicons name="camera-outline" size={21} color="#007aff" />
                  <Ionicons name="location-outline" size={21} color="#30b981" />
                  <Ionicons name="create-outline" size={21} color="#5856d6" />
                  <TouchableOpacity onPress={() => confirmStatus(item)}>
                    <Ionicons name={active ? 'trash-outline' : 'checkmark-circle-outline'} size={21} color={active ? '#ff3b30' : '#30b981'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
  list: { gap: 12, paddingTop: 16 },
  card: { padding: 16, borderRadius: 18, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dde3eb' },
  inactiveCard: { opacity: 0.58 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  code: { color: '#007aff', fontWeight: '900' },
  value: { color: '#30b981', fontWeight: '900' },
  name: { marginTop: 12, fontSize: 17, fontWeight: '900', color: '#111827' },
  actions: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  status: { color: '#64748b', fontWeight: '800' },
  actionIcons: { flexDirection: 'row', gap: 12 }
});

