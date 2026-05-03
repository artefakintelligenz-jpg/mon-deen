import { useState } from 'react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';

const METHODS = [
  { id: 2, name: "ISNA (Amérique du Nord)" },
  { id: 3, name: "MWL (Europe & Monde)" },
  { id: 4, name: "Umm Al-Qura (Arabie)" },
  { id: 5, name: "Egypt" },
  { id: 12, name: "UOIF (France)" },
];

const ADHAN_AFTER = {
  Fajr: ["Dou'a après l'adhan", "Tahiyyat al-Fajr (2 rak'ât)", "Adhkar du matin"],
  Dhuhr: ["Sunnah avant (4)", "Prière Dhuhr", "Sunnah après (2)"],
  Asr: ["Sunnah qabliyya recommandée (4)", "Prière Asr"],
  Maghrib: ["Prière Maghrib", "Sunnah après (2)", "Adhkar du soir"],
  Isha: ["Sunnah après (2)", "Witr (minimum 1)", "Possibilité Tahajjud"],
};

export default function PrayerTimes({ location, setLocation }) {
  const [method, setMethod] = useState(3);
  const { times, loading, error, nextPrayer, countdown } = usePrayerTimes(location?.lat, location?.lng, method);
  const [locLoading, setLocLoading] = useState(false);
  const [expandedPrayer, setExpandedPrayer] = useState(null);

  const getLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      () => setLocLoading(false)
    );
  };

  const isCurrentPrayer = (prayer) => {
    if (!times || !nextPrayer) return false;
    const idx = times.findIndex(t => t.key === nextPrayer.key);
    const prevIdx = idx - 1;
    return prevIdx >= 0 && times[prevIdx].key === prayer.key;
  };

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="display text-2xl text-soft font-semibold">Horaires de Prière</h1>
        <p className="arabic text-lg text-gold">مَوَاقِيتُ الصَّلَاة</p>
      </div>

      {/* Location button */}
      {!location ? (
        <button
          onClick={getLocation}
          disabled={locLoading}
          className="w-full card p-4 mb-4 text-center border border-gold/20 hover:border-gold/40 transition-all"
        >
          <p className="text-2xl mb-1">📍</p>
          <p className="text-soft text-sm">{locLoading ? 'Localisation...' : 'Activer ma localisation'}</p>
          <p className="text-muted text-xs mt-1">Pour des horaires précis</p>
        </button>
      ) : (
        <div className="flex items-center justify-between mb-4 text-xs text-muted">
          <span>📍 Localisation active</span>
          <button onClick={() => setLocation(null)} className="text-gold-dim underline">Changer</button>
        </div>
      )}

      {/* Method selector */}
      <div className="card mb-4 p-3">
        <p className="text-xs text-muted mb-2">Méthode de calcul</p>
        <select
          value={method}
          onChange={e => setMethod(Number(e.target.value))}
          className="w-full bg-night/80 border border-white/10 rounded-lg p-2 text-sm text-soft focus:outline-none focus:border-gold/30"
        >
          {METHODS.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Next prayer highlight */}
      {nextPrayer && (
        <div className="card mb-4 p-4 border-jade/30 bg-gradient-to-br from-jade/10 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted uppercase tracking-widest">Prochaine</p>
              <p className="display text-2xl text-soft font-semibold">{nextPrayer.fr}</p>
              <p className="arabic text-lg text-gold">{nextPrayer.ar}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-jade-light">{nextPrayer.time}</p>
              <p className="text-xs text-muted">dans {countdown}</p>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-center text-muted py-8">Chargement des horaires...</p>}
      {error && <p className="text-center text-red-400 py-4 text-sm">Erreur : active ta localisation</p>}

      {/* Prayer list */}
      {times && (
        <div className="space-y-2">
          {times.map(prayer => {
            const isCurrent = isCurrentPrayer(prayer);
            const isNext = nextPrayer?.key === prayer.key;
            const isExpanded = expandedPrayer === prayer.key;

            return (
              <div key={prayer.key}>
                <button
                  onClick={() => setExpandedPrayer(isExpanded ? null : prayer.key)}
                  className={`w-full card p-4 flex items-center justify-between transition-all ${
                    isNext ? 'border-jade/40 bg-jade/5' : 
                    isCurrent ? 'border-gold/20 bg-gold/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{prayer.icon}</span>
                    <div className="text-left">
                      <p className="text-soft font-medium">{prayer.fr}</p>
                      <p className="arabic text-gold text-sm">{prayer.ar}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${isNext ? 'text-jade-light' : 'text-soft'}`}>
                      {prayer.time}
                    </p>
                    {isNext && <p className="text-xs text-jade/80">→ prochaine</p>}
                    {isCurrent && <p className="text-xs text-gold/70">en cours</p>}
                  </div>
                </button>

                {isExpanded && ADHAN_AFTER[prayer.key] && (
                  <div className="card mt-1 p-3 bg-midnight/80 border-white/5">
                    <p className="text-xs text-muted mb-2 uppercase tracking-widest">Après cette prière</p>
                    <ul className="space-y-1">
                      {ADHAN_AFTER[prayer.key].map((item, i) => (
                        <li key={i} className="text-sm text-soft flex items-start gap-2">
                          <span className="text-gold mt-0.5">›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Sunnah reminder */}
      <div className="card mt-4 p-4 bg-gradient-to-br from-gold/5 to-transparent">
        <p className="text-xs text-muted uppercase tracking-widest mb-2">Rappel</p>
        <p className="arabic text-lg text-gold text-center mb-1">الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ</p>
        <p className="text-sm text-muted text-center italic">"La prière est meilleure que le sommeil"</p>
      </div>
    </div>
  );
}
