export const metadata = {
  title: 'Atlas',
  description: 'Portfolio and market simulator',
};

export default function Page() {
  return (
    <main style={{
      fontFamily: 'Inter, sans-serif',
      background: '#f5f5f7',
      color: '#1d1d1f',
      minHeight: '100vh',
      padding: '24px 16px 100px',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 38, letterSpacing: '-0.04em' }}>Marchés</h1>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            background: '#e8e8ec',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
          }}>⚙</div>
        </header>

        <div style={{
          display: 'flex',
          background: '#ececef',
          borderRadius: 12,
          padding: 4,
          marginBottom: 16,
        }}>
          {['Actions', 'Crypto'].map((label, index) => (
            <button
              key={label}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: 10,
                padding: '10px 12px',
                background: index === 0 ? '#fff' : 'transparent',
                boxShadow: index === 0 ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                fontWeight: 600,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 24, padding: 16, boxShadow: '0 12px 36px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: '#4f46e5', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>Apple</div>
              <div style={{ color: '#86868b', fontSize: 13 }}>AAPL</div>
            </div>
            <div style={{ fontWeight: 700 }}>$228,00</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 18 }}>
            <Stat label="Liquidités" value="10 000 €" />
            <Stat label="Investi" value="6 850 €" />
            <Stat label="Gain" value="+1 240 €" tone="up" />
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <h2 style={{ margin: '0 0 12px' }}>Aperçu</h2>
          <div style={{ background: '#fff', borderRadius: 22, padding: 16, boxShadow: '0 12px 36px rgba(0,0,0,0.08)' }}>
            <div style={{ height: 140, display: 'flex', alignItems: 'end', gap: 8 }}>
              {[20, 40, 30, 60, 42, 70, 75, 68, 82, 88, 80, 92].map((value, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: `${value}%`,
                    background: 'linear-gradient(180deg, #1d9a4b 0%, #7ae3a5 100%)',
                    borderRadius: '12px 12px 0 0',
                    minHeight: 20,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'up' | 'down' }) {
  const color = tone === 'up' ? '#1d9a4b' : tone === 'down' ? '#e5322d' : '#86868b';
  return (
    <div style={{ background: '#f5f5f7', borderRadius: 16, padding: 12 }}>
      <div style={{ color: '#86868b', fontSize: 12 }}>{label}</div>
      <div style={{ color, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  );
}
