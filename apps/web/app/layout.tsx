'use client';

import { useMemo, useState } from 'react';

type AssetKind = 'stock' | 'crypto';

type Asset = {
  ticker: string;
  name: string;
  kind: AssetKind;
  price: number;
  history: number[];
};

type Position = {
  qty: number;
  cost: number;
};

const seedHistory = (base: number, drift: number) => {
  let current = base;
  const points: number[] = [];

  for (let i = 0; i < 48; i += 1) {
    const wave = (Math.random() - 0.48) * drift;
    current = Math.max(0.01, current * (1 + wave));
    points.push(current);
  }

  return points;
};

const DEFAULT_ASSETS: Asset[] = [
  { ticker: 'AAPL', name: 'Apple', kind: 'stock', price: 228, history: seedHistory(228, 0.04) },
  { ticker: 'MSFT', name: 'Microsoft', kind: 'stock', price: 430, history: seedHistory(430, 0.025) },
  { ticker: 'NVDA', name: 'NVIDIA', kind: 'stock', price: 135, history: seedHistory(135, 0.06) },
  { ticker: 'TSLA', name: 'Tesla', kind: 'stock', price: 250, history: seedHistory(250, 0.07) },
  { ticker: 'AMZN', name: 'Amazon', kind: 'stock', price: 190, history: seedHistory(190, 0.038) },
  { ticker: 'GOOGL', name: 'Alphabet', kind: 'stock', price: 175, history: seedHistory(175, 0.03) },
  { ticker: 'META', name: 'Meta', kind: 'stock', price: 560, history: seedHistory(560, 0.05) },
  { ticker: 'NFLX', name: 'Netflix', kind: 'stock', price: 700, history: seedHistory(700, 0.04) },
  { ticker: 'MC', name: 'LVMH', kind: 'stock', price: 640, history: seedHistory(640, 0.028) },
  { ticker: 'RMS', name: 'Hermès', kind: 'stock', price: 2300, history: seedHistory(2300, 0.02) },
  { ticker: 'AIR', name: 'Airbus', kind: 'stock', price: 150, history: seedHistory(150, 0.03) },
  { ticker: 'BTC', name: 'Bitcoin', kind: 'crypto', price: 62000, history: seedHistory(62000, 0.12) },
  { ticker: 'ETH', name: 'Ethereum', kind: 'crypto', price: 2400, history: seedHistory(2400, 0.1) },
  { ticker: 'SOL', name: 'Solana', kind: 'crypto', price: 140, history: seedHistory(140, 0.18) },
  { ticker: 'BNB', name: 'BNB', kind: 'crypto', price: 550, history: seedHistory(550, 0.14) },
  { ticker: 'XRP', name: 'XRP', kind: 'crypto', price: 0.55, history: seedHistory(0.55, 0.2) },
  { ticker: 'ADA', name: 'Cardano', kind: 'crypto', price: 0.35, history: seedHistory(0.35, 0.18) },
  { ticker: 'DOGE', name: 'Dogecoin', kind: 'crypto', price: 0.12, history: seedHistory(0.12, 0.3) },
];

const currency = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const formatCurrency = (value: number, digits = 0) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

const formatNumber = (value: number) => value.toLocaleString('fr-FR', { maximumFractionDigits: 5 });

const pct = (value: number) => `${value >= 0 ? '+' : '−'}${Math.abs(value).toFixed(2).replace('.', ',')} %`;
const toneFor = (value: number) => (value < 0 ? 'down' : 'up');

function sparkline(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values) || 1;
  const span = max - min || 1;

  const path = values
    .map((point, index) => {
      const x = (index * 100) / (values.length - 1);
      const y = 30 - ((point - min) / span) * 24;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return `
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <path d="${path} L 100 30 L 0 30 Z" fill="currentColor" opacity="0.08"></path>
      <path d="${path}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;
}

export default function AtlasPage() {
  const [nav, setNav] = useState<'markets' | 'portfolio' | 'profile'>('markets');
  const [kind, setKind] = useState<'stock' | 'crypto'>('stock');
  const [query, setQuery] = useState('');
  const [cash, setCash] = useState(10000);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [selectedTicker, setSelectedTicker] = useState<string | null>('AAPL');
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');

  const filteredAssets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEFAULT_ASSETS.filter((asset) => {
      const matchesKind = asset.kind === kind;
      if (!q) return matchesKind;
      const haystack = `${asset.name} ${asset.ticker}`.toLowerCase();
      return matchesKind && haystack.includes(q);
    });
  }, [kind, query]);

  const activeAsset = DEFAULT_ASSETS.find((asset) => asset.ticker === selectedTicker) ?? null;
  const positionForSelected = activeAsset ? positions[activeAsset.ticker] : null;
  const selectedDelta = activeAsset ? ((activeAsset.price / activeAsset.history[0] - 1) * 100) : 0;

  const portfolioIds = Object.keys(positions);
  const portfolioValue = useMemo(() => {
    const positionsTotal = portfolioIds.reduce((sum, ticker) => {
      const asset = DEFAULT_ASSETS.find((item) => item.ticker === ticker);
      const position = positions[ticker];
      if (!asset || !position) return sum;
      return sum + position.qty * asset.price;
    }, 0);

    return cash + positionsTotal;
  }, [cash, portfolioIds, positions]);

  const initialPortfolioValue = useMemo(() => {
    const baseline = portfolioIds.reduce((sum, ticker) => {
      const asset = DEFAULT_ASSETS.find((item) => item.ticker === ticker);
      const position = positions[ticker];
      if (!asset || !position) return sum;
      return sum + position.qty * asset.history[0];
    }, 0);

    return cash + baseline;
  }, [cash, portfolioIds, positions]);

  const portfolioDelta = portfolioValue - initialPortfolioValue;

  const addCustomAsset = () => {
    const sanitized = query.trim();
    if (!sanitized) return;

    const ticker = sanitized.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'NEW';
    const price = Number((5 + (ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 49500) / 100).toFixed(2));

    const customAsset: Asset = {
      ticker,
      name: sanitized,
      kind,
      price,
      history: seedHistory(price, kind === 'crypto' ? 0.18 : 0.06),
    };

    DEFAULT_ASSETS.push(customAsset);
    setSelectedTicker(ticker);
    setQuery('');
  };

  const handleTrade = () => {
    if (!activeAsset) return;
    const value = Number(amount.replace(',', '.'));
    if (!value || Number.isNaN(value)) return;

    const nextPositions = { ...positions };

    if (tradeMode === 'buy') {
      if (value > cash) return;
      const current = nextPositions[activeAsset.ticker] ?? { qty: 0, cost: 0 };
      const nextQty = current.qty + value / activeAsset.price;
      const nextCost = current.cost + value;
      nextPositions[activeAsset.ticker] = { qty: nextQty, cost: nextCost };
      setCash((prev) => prev - value);
    } else {
      const current = nextPositions[activeAsset.ticker];
      if (!current) return;

      const valueToSell = Math.min(value, current.qty * activeAsset.price);
      const newQty = current.qty - valueToSell / activeAsset.price;
      if (newQty <= 0.0001) delete nextPositions[activeAsset.ticker];
      else nextPositions[activeAsset.ticker] = { qty: newQty, cost: current.cost * (newQty / current.qty) };
      setCash((prev) => prev + valueToSell);
    }

    setPositions(nextPositions);
    setAmount('');
  };

  const canCreateCustom = !!query.trim() && !DEFAULT_ASSETS.some((asset) => asset.ticker.toLowerCase() === query.trim().toLowerCase() || asset.name.toLowerCase() === query.trim().toLowerCase());

  return (
    <>
      <main className="atlas-shell">
        <section className={`screen ${nav === 'markets' ? 'active' : ''}`} aria-label="Marchés">
          <h1>Marchés</h1>

          <label className="search-box" aria-label="Rechercher un actif">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher ou ajouter un actif"
              autoComplete="off"
            />
          </label>

          <div className="segmented">
            <button className={kind === 'stock' ? 'active' : ''} type="button" onClick={() => setKind('stock')}>Actions</button>
            <button className={kind === 'crypto' ? 'active' : ''} type="button" onClick={() => setKind('crypto')}>Crypto</button>
          </div>

          <div className="card-list">
            {filteredAssets.map((asset) => {
              const delta = ((asset.price / asset.history[0] - 1) * 100);
              const hasPosition = positions[asset.ticker];

              return (
                <button key={asset.ticker} type="button" className="market-row" onClick={() => setSelectedTicker(asset.ticker)}>
                  <span className="avatar" style={{ background: `hsl(${asset.ticker.charCodeAt(0) * 31 % 360} 58% 55%)` }}>{asset.name[0].toUpperCase()}</span>
                  <span className="meta">
                    <strong>{asset.name}</strong>
                    <small>{asset.ticker}</small>
                  </span>
                  <span className="sparkline lg" dangerouslySetInnerHTML={{ __html: sparkline(asset.history) }} />
                  <span className="price-block">
                    <strong>{formatCurrency(asset.price, Math.abs(asset.price) < 1 ? 2 : 0)}</strong>
                    <small className={toneFor(delta)}>{pct(delta)}</small>
                  </span>
                  {hasPosition ? <span className="badge">{formatNumber(hasPosition.qty)}</span> : null}
                </button>
              );
            })}

            {canCreateCustom && (
              <button type="button" className="market-row custom" onClick={addCustomAsset}>
                <span className="avatar neutral">+</span>
                <span className="meta">
                  <strong>Ajouter « {query} »</strong>
                  <small>{kind === 'crypto' ? 'Créer cette cryptomonnaie' : 'Créer cette entreprise'}</small>
                </span>
                <span className="empty-box"></span>
                <span className="empty-box"></span>
              </button>
            )}
          </div>
        </section>

        <section className={`screen ${nav === 'portfolio' ? 'active' : ''}`} aria-label="Portefeuille">
          <h1>Portefeuille</h1>

          <div className="portfolio-value">
            <small>Valeur totale</small>
            <h2>{formatCurrency(portfolioValue)}</h2>
            <div className={`delta ${toneFor(portfolioDelta / (initialPortfolioValue || 1) * 100)}`}>
              {portfolioDelta >= 0 ? '+' : '−'}{formatCurrency(Math.abs(portfolioDelta))} · {pct((initialPortfolioValue ? (portfolioDelta / initialPortfolioValue) * 100 : 0))}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-tile">
              <span>Liquidités</span>
              <strong>{formatCurrency(cash, 0)}</strong>
            </div>
            <div className="stat-tile">
              <span>Investi</span>
              <strong>{formatCurrency(Object.entries(positions).reduce((sum, [ticker, pos]) => {
                const asset = DEFAULT_ASSETS.find((item) => item.ticker === ticker);
                return sum + (asset ? pos.qty * asset.price : 0);
              }, 0), 0)}</strong>
            </div>
            <div className="stat-tile">
              <span>Gain total</span>
              <strong className={toneFor(portfolioDelta)}>{portfolioDelta >= 0 ? '+' : '−'}{formatCurrency(Math.abs(portfolioDelta), 0)}</strong>
            </div>
          </div>

          <div className="portfolio-list">
            {portfolioIds.length === 0 ? (
              <div className="empty-card">Votre portefeuille est vide.<br />Investissez depuis l’onglet Marchés.</div>
            ) : portfolioIds.map((ticker) => {
              const asset = DEFAULT_ASSETS.find((item) => item.ticker === ticker);
              const position = positions[ticker];
              if (!asset || !position) return null;
              const value = position.qty * asset.price;
              const delta = ((asset.price / asset.history[0] - 1) * 100);

              return (
                <button type="button" key={ticker} className="portfolio-item" onClick={() => setSelectedTicker(ticker)}>
                  <span className="avatar" style={{ background: `hsl(${ticker.charCodeAt(0) * 31 % 360} 58% 55%)` }}>{asset.name[0].toUpperCase()}</span>
                  <span className="meta">
                    <strong>{asset.name}</strong>
                    <small>{formatNumber(position.qty)} {ticker}</small>
                  </span>
                  <span className="price-block right">
                    <strong>{formatCurrency(value)}</strong>
                    <small className={toneFor(delta)}>{pct(delta)}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={`screen ${nav === 'profile' ? 'active' : ''}`} aria-label="Profil">
          <div className="profile-head">
            <h1>Profil</h1>
            <button type="button" className="icon-btn" aria-label="Paramètres">⚙</button>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">👤</div>
            <h3>Investisseur</h3>
            <small>Compte Atlas</small>
          </div>
        </section>
      </main>

      <nav className="bottom-nav" aria-label="Navigation principale">
        <button className={nav === 'markets' ? 'active' : ''} type="button" onClick={() => setNav('markets')}>
          <svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-9"></path><path d="M15 6h6v6"></path></svg>
          Marchés
        </button>
        <button className={nav === 'portfolio' ? 'active' : ''} type="button" onClick={() => setNav('portfolio')}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v9h9"></path></svg>
          Portefeuille
        </button>
        <button className={nav === 'profile' ? 'active' : ''} type="button" onClick={() => setNav('profile')}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"></path></svg>
          Profil
        </button>
      </nav>

      {activeAsset && (
        <>
          <div className="sheet-backdrop" onClick={() => setSelectedTicker(null)} />
          <aside className="sheet" aria-modal="true" role="dialog">
            <div className="sheet-grab" />
            <div className="sheet-header">
              <span className="avatar lg-avatar" style={{ background: `hsl(${activeAsset.ticker.charCodeAt(0) * 31 % 360} 58% 55%)` }}>{activeAsset.name[0].toUpperCase()}</span>
              <div>
                <strong>{activeAsset.name}</strong>
                <small>{activeAsset.ticker}</small>
              </div>
            </div>

            <div className="ticker-price">{formatCurrency(activeAsset.price, Math.abs(activeAsset.price) < 1 ? 2 : 0)}</div>
            <div className={`delta large ${toneFor(selectedDelta)}`}>{pct(selectedDelta)} aujourd’hui</div>
            <div className={`sparkline big ${toneFor(selectedDelta)}`} dangerouslySetInnerHTML={{ __html: sparkline(activeAsset.history) }} />

            <div className="segmented narrow">
              <button className={tradeMode === 'buy' ? 'active' : ''} type="button" onClick={() => setTradeMode('buy')}>Acheter</button>
              <button className={tradeMode === 'sell' ? 'active' : ''} type="button" onClick={() => setTradeMode('sell')}>Vendre</button>
            </div>

            <div className="amount-box">
              <input
                value={amount}
                inputMode="decimal"
                placeholder="0"
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9,.-]/g, ''))}
              />
              <span>€</span>
            </div>

            <p className="helper">≈ {formatNumber(Number(amount || 0) / activeAsset.price || 0)} {activeAsset.ticker}</p>
            <p className="helper muted">{tradeMode === 'buy' ? `Liquidités disponibles : ${formatCurrency(cash)}` : `Vous détenez ${formatNumber(positionForSelected?.qty || 0)} ${activeAsset.ticker}`}</p>

            <div className="chip-row">
              {[100, 500, 1000].map((step) => (
                <button key={step} type="button" onClick={() => setAmount(String((Number(amount || 0) + step).toFixed(2)).replace('.', ','))}>{`+${step.toLocaleString('fr-FR')}`}</button>
              ))}
              <button type="button" onClick={() => setAmount(String((tradeMode === 'buy' ? cash : (positionForSelected?.qty || 0) * activeAsset.price).toFixed(2)).replace('.', ','))}>Max</button>
            </div>

            <button className="cta" type="button" onClick={handleTrade}>{tradeMode === 'buy' ? 'Acheter' : 'Vendre'} {activeAsset.ticker}</button>
          </aside>
        </>
      )}

      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; background: #f5f5f7; color: #1d1d1f; font-family: Inter, system-ui, -apple-system, sans-serif; }
        button, input { font: inherit; }
        button { cursor: pointer; }
        .atlas-shell { max-width: 560px; margin: 0 auto; padding: 8px 16px 100px; }
        .screen { display: none; }
        .screen.active { display: block; }
        h1 { margin: 16px 4px 14px; font-size: clamp(34px, 4vw, 40px); letter-spacing: -.04em; }
        h2 { margin: 0; font-size: 44px; letter-spacing: -.04em; }
        h3 { margin: 8px 0 0; font-size: 26px; }
        .search-box {
          display: flex; align-items: center; gap: 8px; background: rgba(120,120,128,.12); border-radius: 12px; padding: 0 14px; color: #86868b;
        }
        .search-box svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.8; }
        .search-box input { flex: 1; border: 0; background: transparent; font-size: 16px; padding: 12px 0; color: #1d1d1f; outline: none; }
        .segmented {
          display: flex; background: rgba(120,120,128,.12); border-radius: 12px; padding: 3px; margin: 16px 0 14px; gap: 4px;
        }
        .segmented button {
          flex: 1; background: transparent; border: 0; border-radius: 10px; padding: 8px 14px; font-weight: 700; color: #1d1d1f;
        }
        .segmented button.active {
          background: #fff; box-shadow: 0 2px 16px rgba(0,0,0,.08); 
        }
        .card-list { display: grid; gap: 0; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,.08); }
        .market-row, .portfolio-item {
          display: grid; grid-template-columns: 40px 1fr 70px 110px 28px; align-items: center; gap: 10px; width: 100%; border: 0; border-top: 1px solid rgba(0,0,0,.08);
          background: transparent; text-align: left; padding: 12px 16px; color: #1d1d1f;
        }
        .market-row:first-child, .portfolio-item:first-child { border-top: 0; }
        .market-row.custom { background: rgba(120,120,128,.03); }
        .avatar {
          width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; color: #fff; font-weight: 700; font-style: normal;
        }
        .avatar.neutral { background: rgba(120,120,128,.16); color: #1d1d1f; }
        .meta { display: flex; flex-direction: column; min-width: 0; }
        .meta strong, .price-block strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .meta small, .price-block small { color: #86868b; font-size: 12px; }
        .sparkline { width: 70px; height: 28px; color: #1d9a4b; }
        .sparkline.big { width: 100%; height: 150px; margin: 14px 0 8px; }
        .sparkline.lg svg, .sparkline.big svg { width: 100%; height: 100%; display: block; }
        .price-block { display: flex; flex-direction: column; align-items: flex-end; min-width: 0; }
        .badge { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 6px; border-radius: 999px; background: rgba(120,120,128,.12); font-size: 11px; font-weight: 700; }
        .up { color: #1d9a4b; }
        .down { color: #e5322d; }
        .portfolio-value { background: #fff; border-radius: 20px; padding: 18px 16px 14px; box-shadow: 0 12px 36px rgba(0,0,0,.06); }
        .portfolio-value small { color: #86868b; font-size: 13px; }
        .portfolio-value h2 { margin: 6px 0 4px; }
        .delta { font-weight: 600; }
        .delta.large { text-align: center; font-size: 13px; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 20px 0 16px; }
        .stat-tile {
          background: #fff; border-radius: 16px; padding: 12px; box-shadow: 0 12px 20px rgba(0,0,0,.04); display: flex; flex-direction: column; gap: 8px;
        }
        .stat-tile span { color: #86868b; font-size: 12px; }
        .portfolio-list { display: grid; gap: 0; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,.08); }
        .portfolio-item { grid-template-columns: 40px 1fr auto; }
        .portfolio-item .meta { justify-content: center; }
        .portfolio-item .right { margin-left: 18px; }
        .empty-card {
          background: #fff; color: #86868b; border-radius: 20px; padding: 36px 18px; text-align: center; line-height: 1.6; box-shadow: 0 12px 36px rgba(0,0,0,.04);
        }
        .profile-head { display: flex; align-items: center; justify-content: space-between; }
        .icon-btn {
          width: 36px; height: 36px; border-radius: 50%; border: 0; background: rgba(120,120,128,.12); font-size: 20px;
        }
        .profile-card {
          display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 32px; padding: 24px 0 0; color: #1d1d1f;
        }
        .profile-avatar {
          display: grid; place-items: center; width: 104px; height: 104px; border-radius: 50%; background: #fff; font-size: 44px; box-shadow: 0 12px 32px rgba(0,0,0,.08); margin-bottom: 18px;
        }
        .profile-card small { color: #86868b; font-size: 14px; }
        .bottom-nav {
          position: fixed; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; gap: 8px; padding: 8px 0 calc(8px + env(safe-area-inset-bottom, 0px));
          background: rgba(245,245,247,.8); backdrop-filter: blur(16px); border-top: 1px solid rgba(0,0,0,.08); z-index: 8;
        }
        .bottom-nav button {
          border: 0; background: transparent; color: #86868b; display: flex; flex-direction: column; align-items: center; gap: 3px; min-width: 92px; padding: 4px 0 6px; font-size: 11px;
        }
        .bottom-nav button.active { color: #1d1d1f; }
        .bottom-nav svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .sheet-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,.42); z-index: 12;
        }
        .sheet {
          position: fixed; left: 0; right: 0; bottom: 0; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 28px 28px 0 0; padding: 10px 20px 32px; z-index: 13; box-shadow: 0 -28px 50px rgba(0,0,0,.18);
        }
        .sheet-grab { width: 38px; height: 5px; border-radius: 3px; background: rgba(120,120,128,.18); margin: 0 auto 18px; }
        .sheet-header { display: flex; align-items: center; gap: 12px; }
        .sheet-header strong { display: block; }
        .sheet-header small { color: #86868b; }
        .lg-avatar { width: 44px; height: 44px; }
        .ticker-price { margin-top: 10px; font-size: 46px; font-weight: 700; letter-spacing: -.04em; }
        .narrow { margin: 18px 0 14px; }
        .amount-box {
          display: flex; justify-content: center; align-items: baseline; gap: 4px; font-size: 42px; font-weight: 700; letter-spacing: -.04em; margin-top: 10px;
        }
        .amount-box input {
          border: 0; background: transparent; outline: none; width: 1.2ch; max-width: 70%; text-align: right; color: #1d1d1f; font: inherit; font-weight: 700;
        }
        .helper { text-align: center; color: #86868b; margin: 6px 0 0; }
        .helper.muted { margin-top: 4px; }
        .chip-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 20px 0; }
        .chip-row button {
          border: 0; background: rgba(120,120,128,.12); color: #1d1d1f; padding: 8px 14px; border-radius: 999px; font-weight: 700;
        }
        .cta {
          width: 100%; border: 0; border-radius: 16px; padding: 16px; background: #111; color: #f5f5f7; font-size: 17px; font-weight: 700;
        }
        @media (max-width: 420px) {
          .market-row, .portfolio-item { grid-template-columns: 40px 1fr 60px 100px; }
          .badge { display: none; }
        }
      `}</style>
    </>
  );
}
