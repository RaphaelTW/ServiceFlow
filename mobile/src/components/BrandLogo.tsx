import { StyleSheet, View } from 'react-native';

export function BrandLogo({ size = 62 }: { size?: number }) {
  const nodeOne = size * 0.28;
  const nodeTwo = size * 0.24;

  return (
    <View style={[styles.logo, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <View style={[styles.track, { width: size * 0.58, height: Math.max(3, size * 0.08), left: size * 0.22, top: size * 0.54 }]} />
      <View style={[styles.node, { width: nodeOne, height: nodeOne, left: size * 0.18, bottom: size * 0.18 }]} />
      <View style={[styles.node, { width: nodeTwo, height: nodeTwo, right: size * 0.17, top: size * 0.18 }]} />
      <View style={[styles.spark, { width: size * 0.1, height: size * 0.1, right: size * 0.18, bottom: size * 0.18 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    overflow: 'hidden',
    backgroundColor: '#0a84ff',
    shadowColor: '#007aff',
    shadowOpacity: 0.24,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8
  },
  track: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    transform: [{ rotate: '-34deg' }]
  },
  node: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#ffffff'
  },
  spark: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.82)'
  }
});
