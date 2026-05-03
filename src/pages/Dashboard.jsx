import { useState, useEffect } from 'react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useLocalStorage, getTodayKey } from '../hooks/useLocalStorage';
import { SUNNAH_RAWATIB } from '../data/adhkar';
import { NAMES_OF_ALLAH } from '../data/names';

const PRAYERS_MAIN = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function Dashboard({ location, onNav }) {
  const { times, nextPrayer, countdown, loading } = usePrayerTimes(location?.lat, location?.lng);
  const todayKey = getTodayKey();
  const [prayerLog, setPrayerLog] = useLocalStorage(`prayers_${todayKey}`, {});
  const [sunnahLog, setSunnahLog] = useLocalStorage(`sunnah_${todayKey}`, {});
  const [gratitude, setGratitude] = useLocalStorage(`gratitude_${todayKey}`, '');
  const [gratitudeInput, setGratitudeInput] = useState(gratitude);
  const [showGratitude, setShowGratitude] = useState(false);
  const [ikhlas, setIkhlas] = useLocalStorage('ikhlas_mode', false);

  // Name of the day
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todayName = NAMES_OF_ALLAH[dayOfYear % 99];

  const prayersDone = PRAYERS_MAIN.filter(p => prayerLog[p]).length;
  const sunnahDone = SUNNAH_RAWATIB.filter(s => sunnahLog[s.id]).length;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6) return { text: "السلام عليكم", sub: "Que la nuit te rapproche de Lui" };
    if (h < 12) return { text: "صَبَاحُ الْخَيْرِ", sub: "Commence ta journée par le souvenir d'Allah" };
    if (h < 15) return { text: "اللَّهُ أَكْبَرُ", sub: "Tu es en chemin — continue" };
    if (h < 18) return { text: "بَارَكَ اللَّهُ فِيكَ", sub: "L'après-midi est propice au dhikr" };
    if (h < 21) return { text: "حَمْدًا لِلَّهِ", sub: "Louange à Allah pour cette journée" };
    return { text: "أَسْتَغْفِرُ اللَّهَ", sub: "Scelle ta journée avec l'istighfar" };
  };

  const greeting = getGreeting();

  const togglePrayer = (p) => {
    setPrayerLog(prev => ({ ...prev, [p]: !prev[p] }));
  };

  const toggleSunnah = (id) => {
    setSunnahLog(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const progress = ((prayersDone * 15 + sunnahDone * 5) / (5 * 15 + SUNNAH_RAWATIB.length * 5)) * 100;

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      {/* Header greeting */}
      <div className="mb-6 text-center">
        <p className="arabic text-3xl text-gold mb-1">{greeting.text}</p>
        <p className="text-muted text-sm font-light">{greeting.sub}</p>
        <p className="text-xs text-gold-dim mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* Next prayer card */}
      {nextPrayer && (
        <div className="card mb-4 p-5 relative overflow-hidden cursor-pointer" onClick={() => onNav('prayers')}>
          <div className="absolute inset-0 bg-gradient-to-br from-jade/20 to-transparent pointer-events-none rounded-2xl"/>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-xs uppercase tracking-widest mb-1">Prochaine prière</p>
              <p className="display text-3xl text-soft font-semibold">{nextPrayer.fr}</p>
              <p className="arabic text-xl text-gold mt-1">{nextPrayer.ar}</p>
            </div>
            <div className="text-right">
              <div className="pulse-ring w-16 h-16 rounded-full bg-jade/20 flex items-center justify-center border border-jade/40">
                <div>
                  <p className="text-lg font-bold text-jade-light">{nextPrayer.time}</p>
                </div>
              </div>
              <p className="text-muted text-xs mt-2">dans {countdown}</p>
            </div>
          </div>
        </div>
      )}

      {loading && !nextPrayer && (
        <div className="card mb-4 p-5 text-center text-muted">
          Chargement des horaires...
        </div>
      )}

      {/* Daily progress bar */}
      {!ikhlas && (
        <div className="card mb-4 p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-soft font-medium">Progression du jour</p>
            <p className="text-xs text-gold">{Math.round(progress)}%</p>
          </div>
          <div className="h-2 bg-night rounded-full overflow-hidden">
            <div className="progress-bar h-full" style={{ width: `${progress}%` }}/>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted">
            <span>🕌 {prayersDone}/5 prières</span>
            <span>✨ {sunnahDone}/{SUNNAH_RAWATIB.length} sunnah</span>
          </div>
        </div>
      )}

      {/* Prayers checklist */}
      <div className="card mb-4 p-4">
        <p className="text-sm font-medium text-soft mb-3 flex items-center gap-2">
          <span>🕌</span> Prières du jour
        </p>
        <div className="grid grid-cols-5 gap-2">
          {times && times.filter(t => PRAYERS_MAIN.includes(t.key)).map(p => (
            <button
              key={p.key}
              onClick={() => togglePrayer(p.key)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                prayerLog[p.key] 
                  ? 'bg-jade/30 border border-jade/50' 
                  : 'bg-night/60 border border-white/5 opacity-60'
              }`}
            >
              <span className="text-lg">{p.icon}</span>
              <span className="text-xs text-soft mt-1">{p.fr}</span>
              <span className="text-xs text-muted">{p.time}</span>
              {prayerLog[p.key] && <span className="text-jade-light text-xs mt-1">✓</span>}
            </button>
          ))}
          {!times && PRAYERS_MAIN.map(p => (
            <button
              key={p}
              onClick={() => togglePrayer(p)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                prayerLog[p] ? 'bg-jade/30 border border-jade/50' : 'bg-night/60 border border-white/5 opacity-60'
              }`}
            >
              <span className="text-xs text-soft">{p}</span>
              {prayerLog[p] && <span className="text-jade-light text-xs mt-1">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Sunnah rawatib */}
      <div className="card mb-4 p-4">
        <p className="text-sm font-medium text-soft mb-3 flex items-center gap-2">
          <span>✨</span> Sunnah Rawatib
        </p>
        <div className="space-y-2">
          {SUNNAH_RAWATIB.map(s => (
            <button
              key={s.id}
              onClick={() => toggleSunnah(s.id)}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all text-left ${
                sunnahLog[s.id] ? 'bg-gold/10 border border-gold/20' : 'bg-night/40 border border-white/5'
              }`}
            >
              <div>
                <p className="text-sm text-soft">{s.name}</p>
                <p className="text-xs text-muted">{s.count} rak'ât</p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                sunnahLog[s.id] ? 'bg-gold border-gold text-night' : 'border-muted'
              }`}>
                {sunnahLog[s.id] && <span className="text-xs font-bold">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Name of Allah today */}
      <div className="card mb-4 p-5 cursor-pointer card-hover" onClick={() => onNav('names')}>
        <p className="text-xs text-muted uppercase tracking-widest mb-2">Nom d'Allah du jour</p>
        <p className="arabic text-4xl text-gold text-center mb-2">{todayName.ar}</p>
        <p className="display text-xl text-soft text-center font-semibold">{todayName.fr}</p>
        <p className="text-sm text-muted text-center mt-1">{todayName.meaning}</p>
        <p className="text-xs text-gold-dim text-center mt-2 italic">"{todayName.example}"</p>
      </div>

      {/* Gratitude journal */}
      <div className="card mb-4 p-4">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setShowGratitude(!showGratitude)}
        >
          <p className="text-sm font-medium text-soft flex items-center gap-2">
            <span>🤲</span> Gratitude du jour
          </p>
          <span className="text-muted text-xs">{gratitude ? '✓ noté' : 'noter'}</span>
        </button>
        {showGratitude && (
          <div className="mt-3">
            <textarea
              value={gratitudeInput}
              onChange={e => setGratitudeInput(e.target.value)}
              onBlur={() => setGratitude(gratitudeInput)}
              placeholder="Une chose pour laquelle je remercie Allah aujourd'hui..."
              className="w-full bg-night/60 border border-white/10 rounded-lg p-3 text-sm text-soft placeholder-muted resize-none focus:outline-none focus:border-gold/30"
              rows={3}
            />
            <p className="text-xs text-muted mt-1">Privé — jamais partagé</p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onNav('adhkar')} className="card p-4 text-center card-hover">
          <p className="text-2xl mb-1">📿</p>
          <p className="text-sm text-soft">Adhkars</p>
          <p className="text-xs text-muted">Matin & Soir</p>
        </button>
        <button onClick={() => onNav('dhikr')} className="card p-4 text-center card-hover">
          <p className="text-2xl mb-1">🔢</p>
          <p className="text-sm text-soft">Dhikr</p>
          <p className="text-xs text-muted">Compteur</p>
        </button>
        <button onClick={() => onNav('qibla')} className="card p-4 text-center card-hover">
          <p className="text-2xl mb-1">🧭</p>
          <p className="text-sm text-soft">Qibla</p>
          <p className="text-xs text-muted">Direction</p>
        </button>
        <button onClick={() => onNav('muhasaba')} className="card p-4 text-center card-hover">
          <p className="text-2xl mb-1">📊</p>
          <p className="text-sm text-soft">Muhâsaba</p>
          <p className="text-xs text-muted">Bilan</p>
        </button>
      </div>
    </div>
  );
}
