import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@serviceflow.local');
  const [password, setPassword] = useState('ServiceFlow@123');
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      Alert.alert('Não foi possível entrar', err instanceof Error ? err.message : 'Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logo}><Text style={styles.logoText}>SF</Text></View>
        <Text style={styles.title}>ServiceFlow</Text>
        <Text style={styles.subtitle}>Clientes, ordens e financeiro com a fluidez de um app moderno.</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={20} color="#64748b" />
          <TextInput autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="E-mail" style={styles.input} />
        </View>
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
          <TextInput secureTextEntry value={password} onChangeText={setPassword} placeholder="Senha" style={styles.input} />
        </View>
        <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f5f7' },
  hero: { alignItems: 'center', marginBottom: 26 },
  logo: { width: 66, height: 66, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#007aff' },
  logoText: { color: '#ffffff', fontSize: 24, fontWeight: '900' },
  title: { marginTop: 16, color: '#111827', fontSize: 34, fontWeight: '900' },
  subtitle: { marginTop: 8, color: '#64748b', textAlign: 'center', lineHeight: 21 },
  card: { gap: 12, padding: 16, borderRadius: 22, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dde3eb' },
  inputRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: '#f6f7fb' },
  input: { flex: 1, color: '#111827' },
  button: { height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#007aff' },
  buttonText: { color: '#ffffff', fontWeight: '900', fontSize: 16 }
});

