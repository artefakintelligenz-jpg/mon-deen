import { useState } from 'react';
import { ADHKAR_MATIN, ADHKAR_SOIR, ADHKAR_SOMMEIL } from '../data/adhkar';
import { useLocalStorage, getTodayKey } from '../hooks/useLocalStorage';

const TABS = [
  { id: 'matin', label: 'Matin', ar: 'الصَّبَاح', icon: '🌅', data: ADHKAR_MATIN },
  { id: 'soir', label: 'Soir', ar: 'الْمَسَاء', icon: '🌇', data: ADHKAR_SOIR },
  { id: 'sommeil', label: 'Sommeil', ar: 'النَّوْم', icon: '🌙', data: ADHKAR_SOMMEIL },
];

export default function Adhkar() {
  const [tab, setTab] = useState('matin');
  const [expanded, setExpanded] = useState(null);
  const todayKey = getTodayKey();
  const [done, setDone] = useLocalStorage(`adhkar_${todayKey}`, {});
  const [counters, setCounters] = useLocalStorage(`adhkar_counters_${todayKey}`, {});

  const currentTab = TABS.find(t => t.id === tab);
  const items = currentTab.data;
  const completedCount = items.filter(i => done[i.id]).length;

  const increment = (item) => {
    const current = counters[item.id] || 0;
    const next = current + 1;
    setCounters(prev => ({ ...prev, [item.id]: next }));
    if (next >= item.count) {
      setDone(prev => ({ ...prev, [item.id]: true }));
    }
  };

  const reset = (id) => {
    setCounters(prev => ({ ...prev, [id]: 0 }));
    setDone(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="display text-2xl text-soft font-semibold">Adhkars</h1>
        <p className="arabic text-lg text-gold">الأَذْكَار</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm transition-all ${
              tab === t.id
                ? 'bg-gold text-night font-semibold'
                : 'bg-panel text-muted border border-white/5'
            }`}
          >
            <span className="mr-1">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted">{completedCount}/{items.length} complétés</p>
        <div className="flex gap-1">
          {items.map(i => (
            <div
              key={i.id}
              className={`w-2 h-2 rounded-full ${done[i.id] ? 'bg-gold' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      {/* Adhkar list */}
      <div className="space-y-3">
        {items.map((item) => {
          const count = counters[item.id] || 0;
          const isDone = done[item.id];
          const isOpen = expanded === item.id;

          return (
            <div
              key={item.id}
              className={`card transition-all ${isDone ? 'border-jade/30 bg-jade/5' : ''}`}
            >
              {/* Header */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="arabic text-xl text-gold leading-relaxed text-right">{item.ar}</p>
                  </div>
                  {isDone && (
                    <div className="w-7 h-7 rounded-full bg-jade/30 border border-jade/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-jade-light text-xs">✓</span>
                    </div>
                  )}
                </div>

                {/* Toggle translation */}
                <button
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  className="text-xs text-gold-dim underline mt-2"
                >
                  {isOpen ? 'Masquer' : 'Traduction & source'}
                </button>

                {isOpen && (
                  <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                    <p className="text-sm text-soft italic leading-relaxed">{item.fr}</p>
                    {item.phonetic && (
                      <p className="text-xs text-muted font-mono">{item.phonetic}</p>
                    )}
                    <div className="flex items-start gap-2 mt-2">
                      <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{item.source}</span>
                    </div>
                    {item.merit && (
                      <p className="text-xs text-jade-light bg-jade/10 p-2 rounded-lg">
                        ✦ {item.merit}
                      </p>
                    )}
                  </div>
                )}

                {/* Counter */}
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-muted">
                    {item.count > 1 ? `${count} / ${item.count}×` : '1×'}
                  </div>
                  <div className="flex gap-2">
                    {count > 0 && !isDone && (
                      <button
                        onClick={() => reset(item.id)}
                        className="text-xs text-muted px-2 py-1"
                      >
                        ↺
                      </button>
                    )}
                    {!isDone ? (
                      <button
                        onClick={() => increment(item)}
                        className="bg-gold/20 border border-gold/30 text-gold text-sm px-4 py-1.5 rounded-lg hover:bg-gold/30 transition-all active:scale-95"
                      >
                        {item.count === 1 ? 'Fait ✓' : `+1`}
                      </button>
                    ) : (
                      <button
                        onClick={() => reset(item.id)}
                        className="bg-jade/20 border border-jade/30 text-jade-light text-xs px-3 py-1.5 rounded-lg"
                      >
                        Refaire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {completedCount === items.length && items.length > 0 && (
        <div className="card mt-4 p-4 text-center border-gold/30 bg-gold/5">
          <p className="text-2xl mb-2">🤲</p>
          <p className="display text-lg text-gold font-semibold">MâshâAllah !</p>
          <p className="text-sm text-muted mt-1">Tous les adhkars du {currentTab.label} accomplis</p>
        </div>
      )}
    </div>
  );
}
