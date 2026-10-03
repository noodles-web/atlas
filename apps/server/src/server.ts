import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const markets = [
  { ticker: 'AAPL', name: 'Apple', price: '€228,00', up: '+2,32 %' },
  { ticker: 'MSFT', name: 'Microsoft', price: '€430,00', up: '+1,45 %' },
  { ticker: 'BTC', name: 'Bitcoin', price: '€62 000', up: '+3,94 %' },
  { ticker: 'ETH', name: 'Ethereum', price: '€2 400', up: '+2,87 %' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Marchés</Text>

        <View style={styles.segmentedControl}>
          <TouchableOpacity style={[styles.segment, styles.segmentOn]}>
            <Text style={styles.segmentLabel}>Actions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.segment}>
            <Text style={styles.segmentLabel}>Crypto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardList}>
          {markets.map((item, index) => (
            <View key={item.ticker} style={[styles.marketRow, index === 0 && styles.firstRow]}>
              <View style={[styles.avatar, { backgroundColor: index % 2 === 0 ? '#4f46e5' : '#1d9a4b' }]}>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
              </View>

              <View style={styles.meta}>
                <Text style={styles.assetName}>{item.name}</Text>
                <Text style={styles.assetTicker}>{item.ticker}</Text>
              </View>

              <View style={styles.sparklinePlaceholder} />

              <View style={styles.priceBlock}>
                <Text style={styles.assetPrice}>{item.price}</Text>
                <Text style={[styles.assetDelta, { color: '#1d9a4b' }]}>{item.up}</Text>
              </View>
            </View>
          ))}
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
  container: { padding: 18, paddingBottom: 120 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -1, marginBottom: 18, color: '#1d1d1f' },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(120,120,128,.12)',
    borderRadius: 12,
    padding: 3,
    marginBottom: 18,
  },
  segment: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentOn: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
  segmentLabel: { color: '#1d1d1f', fontWeight: '700' },
  cardList: {
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  marketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  firstRow: { borderTopWidth: 0 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700' },
  meta: { flex: 1, minWidth: 0 },
  assetName: { fontWeight: '700', color: '#1d1d1f' },
  assetTicker: { color: '#86868b', fontSize: 12, marginTop: 2 },
  sparklinePlaceholder: {
    width: 60,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(29,154,75,0.15)',
    marginHorizontal: 4,
  },
  priceBlock: { alignItems: 'flex-end' },
  assetPrice: { fontWeight: '700', color: '#1d1d1f', fontSize: 15 },
  assetDelta: { fontSize: 12, marginTop: 2 },
  statsGrid: { flexDirection: 'row', gap: 10, marginTop: 18 },
  statCard: { flex: 1, backgroundColor: '#f5f5f7', borderRadius: 16, padding: 12 },
  statLabel: { color: '#86868b', fontSize: 12 },
  statValue: { marginTop: 8, fontSize: 15, fontWeight: '700' },
});
