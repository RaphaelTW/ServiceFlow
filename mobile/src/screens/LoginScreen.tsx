import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BrandLogo } from '../components/BrandLogo';
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
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={styles.hero}>
        <BrandLogo />
        <Text style={styles.title}>ServiceFlow</Text>
        <Text style={styles.subtitle}>Clientes, ordens e financeiro com a fluidez de um app moderno.</Text>
      </View>
      <View style={styles.securityRow}>
        <Ionicons name="shield-checkmark-outline" size={18} color="#30b981" />
        <Text style={styles.securityText}>Acesso seguro</Text>
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
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f5f7', overflow: 'hidden' },
  glowOne: { position: 'absolute', width: 280, height: 280, borderRadius: 140, left: -120, top: 80, backgroundColor: 'rgba(0,122,255,0.14)' },
  glowTwo: { position: 'absolute', width: 300, height: 300, borderRadius: 150, right: -150, bottom: 80, backgroundColor: 'rgba(48,185,129,0.14)' },
  hero: { alignItems: 'center', marginBottom: 26 },
  title: { marginTop: 16, color: '#111827', fontSize: 34, fontWeight: '900' },
  subtitle: { marginTop: 8, color: '#64748b', textAlign: 'center', lineHeight: 21 },
  securityRow: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, paddingHorizontal: 12, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.72)', borderWidth: 1, borderColor: 'rgba(221,227,235,0.8)' },
  securityText: { color: '#30b981', fontWeight: '900' },
  card: { gap: 12, padding: 16, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.86)', borderWidth: 1, borderColor: 'rgba(221,227,235,0.88)', shadowColor: '#0f172a', shadowOpacity: 0.09, shadowRadius: 28, shadowOffset: { width: 0, height: 18 }, elevation: 6 },
  inputRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, borderRadius: 16, backgroundColor: 'rgba(246,247,251,0.9)' },
  input: { flex: 1, color: '#111827' },
  button: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#007aff' },
  buttonText: { color: '#ffffff', fontWeight: '900', fontSize: 16 }
});

