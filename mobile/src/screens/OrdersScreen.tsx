import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type OrderListItem = {
  id: number;
  code: string;
  title: string;
  status: string;
  value: string;
};

const orders: OrderListItem[] = [
  { id: 1, code: 'OS-0001', title: 'Instalação residencial', status: 'Concluída', value: 'R$ 320,00' },
  { id: 2, code: 'OS-0002', title: 'Manutenção mensal', status: 'Em andamento', value: 'R$ 180,00' },
  { id: 3, code: 'OS-0003', title: 'Visita técnica', status: 'Aberta', value: 'R$ 120,00' }
];

export function OrdersScreen() {
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
        renderItem={({ item }: { item: OrderListItem }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
            <Text style={styles.name}>{item.title}</Text>
            <View style={styles.actions}>
              <Text style={styles.status}>{item.status}</Text>
              <View style={styles.actionIcons}>
                <Ionicons name="camera-outline" size={21} color="#2563eb" />
                <Ionicons name="location-outline" size={21} color="#0f766e" />
                <Ionicons name="create-outline" size={21} color="#7c3aed" />
                <Ionicons name="logo-whatsapp" size={21} color="#0f766e" />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#172033' },
  button: { width: 42, height: 42, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563eb' },
  list: { gap: 12, paddingTop: 16 },
  card: { padding: 16, borderRadius: 8, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dde3eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  code: { color: '#2563eb', fontWeight: '900' },
  value: { color: '#0f766e', fontWeight: '900' },
  name: { marginTop: 12, fontSize: 17, fontWeight: '900', color: '#172033' },
  actions: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  status: { color: '#64748b', fontWeight: '800' },
  actionIcons: { flexDirection: 'row', gap: 12 }
});
