import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Atlas</Text>

        <View style={styles.segmentedControl}>
          <Text style={styles.segmentOn}>Actions</Text>
          <Text style={styles.segment}>Crypto</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.assetRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.assetName}>Apple</Text>
              <Text style={styles.assetTicker}>AAPL</Text>
            </View>
            <Text style={styles.assetPrice}>$228,00</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Liquidités" value="10 000 €" />
          <StatCard label="Investi" value="6 850 €" />
          <StatCard label="Gain" value="+1 240 €" tone="up" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'up' | 'down' }) {
  const colors = {
    neutral: '#86868b',
    up: '#1d9a4b',
    down: '#e5322d',
  };

  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: colors[tone] }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f7' },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 20,
    color: '#1d1d1f',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#ececef',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  segment: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
    color: '#1d1d1f',
    fontWeight: '600',
  },
  segmentOn: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    color: '#1d1d1f',
    fontWeight: '600',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
  },
  assetName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1d1d1f',
  },
  assetTicker: {
    color: '#86868b',
    fontSize: 13,
    marginTop: 2,
  },
  assetPrice: {
    fontWeight: '700',
    color: '#1d1d1f',
  },
  statsGrid: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    borderRadius: 16,
    padding: 12,
  },
  statLabel: {
    color: '#86868b',
    fontSize: 12,
  },
  statValue: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
  },
});
