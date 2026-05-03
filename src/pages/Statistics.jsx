import { useLocalStorage } from '../hooks/useLocalStorage';

const PRAYERS = ['Fajr','Dhuhr','Asr','Maghrib','Isha'];

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = i === 0 ? "Auj." : d.toLocaleDateString('fr-FR', { weekday: 'short' });
    days.push({ key, label, date: d });
  }
  return days;
}

function StatCard({ icon, value, label, color = 'text-gold' }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-2xl mb-1">{icon}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

export default function Statistics() {
  const days = getLast7Days();

  // Load all prayer logs
  const prayerData = days.map(d => {
    const raw = localStorage.getItem(`prayers_${d.key}`);
    const log = raw ? JSON.parse(raw) : {};
    const done = PRAYERS.filter(p => log[p]).length;
    return { ...d, done, pct: (done / 5) * 100 };
  });

  // Load dhikr data
  const dhikrData = days.map(d => {
    const raw = localStorage.getItem(`dhikr_sessions_${d.key}`);
    const sessions = raw ? JSON.parse(raw) : [];
    return { ...d, total: sessions.reduce((a, s) => a + s.count, 0) };
  });

  // Load adhkar data
  const adhkarData = days.map(d => {
    const raw = localStorage.getItem(`adhkar_${d.key}`);
    const done = raw ? Object.values(JSON.parse(raw)).filter(Boolean).length : 0;
    return { ...d, done };
  });

  // Streak calculation
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const raw = localStorage.getItem(`prayers_${key}`);
    const log = raw ? JSON.parse(raw) : {};
    const done = PRAYERS.filter(p => log[p]).length;
    if (done === 5) streak++;
    else if (i > 0) break;
  }

  const todayData = prayerData[6];
  const weekTotal = prayerData.reduce((a, d) => a + d.done, 0);
  const weekMax = 5 * 7;
  const weekPct = Math.round((weekTotal / weekMax) * 100);
  const totalDhikr = dhikrData.reduce((a, d) => a + d.total, 0);

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="display text-2xl text-soft font-semibold">Statistiques</h1>
        <p className="arabic text-lg text-gold">الإِحْصَائِيَّات</p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon="🔥" value={streak} label="Jours complets (streak)" color="text-orange-400"/>
        <StatCard icon="🕌" value={`${weekPct}%`} label="Prières cette semaine" color="text-jade-light"/>
        <StatCard icon="📿" value={totalDhikr} label="Dhikrs cette semaine" color="text-gold"/>
        <StatCard icon="✅" value={`${todayData.done}/5`} label="Prières aujourd'hui" color="text-soft"/>
      </div>

      {/* Weekly prayer chart */}
      <div className="card p-4 mb-4">
        <p className="text-sm font-medium text-soft mb-4">Prières — 7 derniers jours</p>
        <div className="flex items-end justify-between gap-1 h-24">
          {prayerData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{height: '80px'}}>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${Math.max(4, d.pct)}%`,
                    background: d.done === 5
                      ? 'linear-gradient(to top, #2a6b5a, #3d9b84)'
                      : d.done >= 3
                      ? 'linear-gradient(to top, #8a6e2f, #c9a84c)'
                      : '#1e2736',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                />
              </div>
              <p className="text-xs text-muted">{d.label}</p>
              <p className="text-xs text-soft">{d.done}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-jade"/><p className="text-xs text-muted">5/5</p></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gold-dim"/><p className="text-xs text-muted">3-4/5</p></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-panel"/><p className="text-xs text-muted">0-2/5</p></div>
        </div>
      </div>

      {/* Dhikr chart */}
      <div className="card p-4 mb-4">
        <p className="text-sm font-medium text-soft mb-4">Dhikr — 7 derniers jours</p>
        <div className="space-y-2">
          {dhikrData.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <p className="text-xs text-muted w-8 flex-shrink-0">{d.label}</p>
              <div className="flex-1 h-5 bg-night rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full transition-all"
                  style={{width: `${Math.min(100, (d.total / 200) * 100)}%`}}/>
              </div>
              <p className="text-xs text-gold w-10 text-right">{d.total}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Adhkar completion */}
      <div className="card p-4 mb-4">
        <p className="text-sm font-medium text-soft mb-4">Adhkars complétés</p>
        <div className="flex justify-around">
          {adhkarData.slice(-7).map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                d.done >= 8 ? 'bg-jade/30 border-jade/50 text-jade-light'
                : d.done >= 4 ? 'bg-gold/20 border-gold/30 text-gold'
                : 'bg-panel border-white/5 text-muted'
              }`}>{d.done}</div>
              <p className="text-xs text-muted">{d.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation */}
      <div className="card p-4 text-center bg-gold/5 border-gold/10">
        <p className="arabic text-lg text-gold mb-1">أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا</p>
        <p className="text-xs text-muted italic">"Les actes les plus aimés d'Allah sont ceux accomplis avec constance" — Al-Bukhârî</p>
      </div>
    </div>
  );
}
