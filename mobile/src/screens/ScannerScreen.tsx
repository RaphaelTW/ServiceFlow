import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="scan-outline" size={44} color="#2563eb" />
        <Text style={styles.title}>Scanner QR e código de barras</Text>
        <Text style={styles.muted}>Permita acesso à câmera para localizar produtos, OS e etiquetas.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'code128'] }} />
      <View style={styles.overlay}>
        <Text style={styles.scanText}>Aponte para o QR Code ou código de barras</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101827' },
  camera: { flex: 1 },
  overlay: { position: 'absolute', left: 18, right: 18, bottom: 28, padding: 16, borderRadius: 8, backgroundColor: 'rgba(16, 24, 39, 0.82)' },
  scanText: { color: '#ffffff', fontWeight: '900', textAlign: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#f6f7fb' },
  title: { marginTop: 12, fontSize: 22, fontWeight: '900', color: '#172033', textAlign: 'center' },
  muted: { marginTop: 10, color: '#64748b', textAlign: 'center', lineHeight: 20 },
  button: { marginTop: 18, height: 44, paddingHorizontal: 18, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563eb' },
  buttonText: { color: '#ffffff', fontWeight: '900' }
});

