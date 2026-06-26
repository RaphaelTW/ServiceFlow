import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type CustomerListItem = {
  id: number;
  name: string;
  phone: string;
  city: string;
};

const customers: CustomerListItem[] = [
  { id: 1, name: 'Ana Martins', phone: '(11) 99999-1010', city: 'São Paulo' },
  { id: 2, name: 'Oficina Sol Nascente', phone: '(21) 3333-2020', city: 'Rio de Janeiro' },
  { id: 3, name: 'Condomínio Atlântico', phone: '(31) 98888-3030', city: 'Belo Horizonte' }
];

export function CustomersScreen() {
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
        <TextInput placeholder="Pesquisar por nome, CPF/CNPJ ou WhatsApp" style={styles.input} />
      </View>
      <FlatList
        data={customers}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: CustomerListItem }) => (
          <View style={styles.card}>
            <View style={styles.avatar}><Text>{item.name.slice(0, 1)}</Text></View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.phone} - {item.city}</Text>
            </View>
            <Ionicons name="logo-whatsapp" size={22} color="#0f766e" />
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
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, padding: 12, borderRadius: 8, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dde3eb' },
  input: { flex: 1 },
  list: { gap: 10, paddingTop: 14 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#dde3eb' },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff' },
  info: { flex: 1 },
  name: { fontWeight: '900', color: '#172033' },
  meta: { color: '#64748b', marginTop: 3 }
});
