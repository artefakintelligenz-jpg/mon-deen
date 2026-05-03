import { useState, useRef } from 'react';
import { DHIKR_OPTIONS } from '../data/adhkar';
import { useLocalStorage, getTodayKey } from '../hooks/useLocalStorage';

export default function DhikrCounter() {
  const [selected, setSelected] = useState(DHIKR_OPTIONS[0]);
  const [count, setCount] = useState(0);
  const [vibrate, setVibrate] = useLocalStorage("dhikr_vibrate", true);
  const [sessions, setSessions] = useLocalStorage("dhikr_sessions_" + getTodayKey(), []);
  const [bouncing, setBouncing] = useState(false);

  const tap = () => {
    const next = count + 1;
    setCount(next);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 100);
    if (vibrate && navigator.vibrate) {
      navigator.vibrate(next % selected.target === 0 ? [50, 30, 50] : 8);
    }
    if (next % selected.target === 0) {
      setSessions(prev => [...prev, { dhikr: selected.fr, count: selected.target, time: new Date().toLocaleTimeString() }]);
    }
  };

  const reset = () => {
    if (count > 0) setSessions(prev => [...prev, { dhikr: selected.fr, count, time: new Date().toLocaleTimeString(), partial: true }]);
    setCount(0);
  };

  const cycles = Math.floor(count / selected.target);
  const remainder = count % selected.target;
  const progress = (remainder / selected.target) * 100;
  const totalToday = sessions.reduce((s, x) => s + x.count, 0) + count;

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="display text-2xl text-soft font-semibold">Compteur de Dhikr</h1>
        <p className="arabic text-lg text-gold">عَدَّادُ الذِّكْر</p>
      </div>

      {/* Sélecteur */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {DHIKR_OPTIONS.map(opt => (
          <button key={opt.id} onClick={() => { setSelected(opt); setCount(0); }}
            className={"card p-3 text-center transition-all " + (selected.id === opt.id ? "border-gold/50 bg-gold/10" : "card-hover")}>
            <p className="arabic text-base text-gold">{opt.ar}</p>
            <p className="text-xs text-muted mt-1">{opt.fr}</p>
            <p className="text-xs text-gold-dim">{opt.target}×</p>
          </button>
        ))}
      </div>

      {/* Compteur central */}
      <div className="flex flex-col items-center mb-6">
        {/* Cercle progression */}
        <div className="relative w-44 h-44 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e2736" strokeWidth="6"/>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#c9a84c" strokeWidth="6"
              strokeDasharray={"" + (2 * Math.PI * 45)}
              strokeDashoffset={"" + (2 * Math.PI * 45 * (1 - progress / 100))}
              strokeLinecap="round" style={{transition:"stroke-dashoffset 0.15s ease"}}/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={"text-5xl font-bold text-soft transition-transform duration-100 " + (bouncing ? "scale-110" : "scale-100")}>
              {remainder || (count > 0 && count % selected.target === 0 ? selected.target : 0)}
            </p>
            {cycles > 0 && <p className="text-xs text-gold">{cycles}× cycle</p>}
          </div>
        </div>

        <p className="arabic text-3xl text-gold mb-1">{selected.ar}</p>
        <p className="text-sm text-muted mb-6">{selected.fr} · {selected.target}×</p>

        {/* BOUTON SIMPLE - pas de tasbih */}
        <button
          onClick={tap}
          className="w-40 h-16 rounded-2xl bg-gradient-to-br from-jade to-jade/70 border-2 border-jade-light/30 shadow-lg shadow-jade/20 active:scale-95 transition-all select-none text-white font-semibold text-lg"
          style={{ userSelect: "none", WebkitTapHighlightColor: "transparent" }}>
          <span className="block text-2xl">﷽</span>
          <span className="block text-xs opacity-70 mt-0.5">Appuyer</span>
        </button>

        <div className="flex gap-3 mt-5">
          <button onClick={reset}
            className="text-sm text-muted border border-white/10 px-4 py-2 rounded-xl hover:border-white/20">
            ↺ Réinitialiser
          </button>
          <button onClick={() => setVibrate(!vibrate)}
            className={"text-sm px-4 py-2 rounded-xl border transition-all " + (vibrate ? "border-gold/30 text-gold" : "border-white/10 text-muted")}>
            {vibrate ? "📳 Vibration" : "🔕 Silencieux"}
          </button>
        </div>
      </div>

      {/* Stats du jour */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-soft">Aujourd'hui</p>
          <p className="text-sm text-gold">{totalToday} total</p>
        </div>
        {sessions.length > 0 ? (
          <div className="space-y-1.5">
            {sessions.slice(-5).map((s, i) => (
              <div key={i} className="flex justify-between text-xs text-muted">
                <span>{s.dhikr}{s.partial ? " (partiel)" : ""}</span>
                <span className="text-gold">{s.count}× · {s.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted text-center py-2">Commence ton dhikr</p>
        )}
      </div>
    </div>
  );
}
