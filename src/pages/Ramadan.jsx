import { useState, useEffect } from 'react';
import { useLocalStorage, getTodayKey } from '../hooks/useLocalStorage';

const TARAWIH_RAKAAT = [2,2,2,2,2,2,2,2,2,2]; // 10 salams = 20 rakaat

const DUAS_IFTAR = [
  { ar: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ", fr: "Ô Allah, c'est pour Toi que j'ai jeûné et c'est avec Ta provision que je romps le jeûne", source: "Abû Dawûd" },
  { ar: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ", fr: "La soif est partie, les veines sont désaltérées, et la récompense est acquise si Allah le veut", source: "Abû Dawûd" },
];

const SUNNAH_VENDREDI = [
  { id: 'kahf', text: 'Lire Sourate Al-Kahf', done: false },
  { id: 'ghusl', text: 'Faire le Ghusl', done: false },
  { id: 'salawat', text: 'Abondance de Salawat', done: false },
  { id: 'duaa_vendredi', text: "Dou'a durant la dernière heure", done: false },
  { id: 'parfum', text: "Porter du parfum", done: false },
];

export default function Ramadan({ location }) {
  const todayKey = getTodayKey();
  const [tarawih, setTarawih] = useLocalStorage(`tarawih_${todayKey}`, {});
  const [khatm, setKhatm] = useLocalStorage('khatm_progress', 0);
  const [khatmInput, setKhatmInput] = useState(khatm);
  const [fastToday, setFastToday] = useLocalStorage(`fast_${todayKey}`, false);
  const [iftarTimes, setIftarTimes] = useState(null);
  const [tab, setTab] = useState('accueil');
  const [vendredi, setVendredi] = useLocalStorage(`vendredi_${todayKey}`, {});

  const isRamadan = true; // can be toggled in settings
  const tarawihDone = Object.values(tarawih).filter(Boolean).length;
  const khatmPct = Math.min(100, (khatm / 604) * 100); // 604 pages total

  // Fetch prayer times for Suhoor/Iftar
  useEffect(() => {
    if (!location) return;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2,'0');
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const yyyy = today.getFullYear();
    fetch(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${location.lat}&longitude=${location.lng}&method=3`)
      .then(r => r.json())
      .then(d => {
        if (d.code === 200) {
          setIftarTimes({ suhoor: d.data.timings.Fajr, iftar: d.data.timings.Maghrib });
        }
      }).catch(() => {});
  }, [location]);

  const isJumu = new Date().getDay() === 5; // Friday

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-4">
        <h1 className="display text-2xl text-soft font-semibold">Mode Ramadan</h1>
        <p className="arabic text-lg text-gold">رَمَضَان مُبَارَك</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[['accueil','🌙 Jeûne'],['tarawih','🕌 Tarawih'],['khatm','📖 Khatm'],['vendredi','🌟 Jumu\'ah']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-shrink-0 py-1.5 px-3 rounded-xl text-sm transition-all ${tab===id ? 'bg-gold text-night font-semibold' : 'bg-panel text-muted border border-white/5'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'accueil' && (
        <div className="space-y-4">
          {/* Suhoor / Iftar */}
          {iftarTimes ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 text-center border-blue-400/20 bg-blue-400/5">
                <p className="text-2xl mb-1">🌙</p>
                <p className="text-muted text-xs uppercase">Suhoor</p>
                <p className="text-2xl font-bold text-soft">{iftarTimes.suhoor}</p>
                <p className="text-xs text-muted">avant Fajr</p>
              </div>
              <div className="card p-4 text-center border-orange-400/20 bg-orange-400/5">
                <p className="text-2xl mb-1">🌅</p>
                <p className="text-muted text-xs uppercase">Iftar</p>
                <p className="text-2xl font-bold text-gold">{iftarTimes.iftar}</p>
                <p className="text-xs text-muted">Maghrib</p>
              </div>
            </div>
          ) : (
            <div className="card p-4 text-center text-muted text-sm">
              Active ta localisation dans "Prières" pour les horaires Suhoor/Iftar
            </div>
          )}

          {/* Fast tracker */}
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-soft font-medium">Jeûne aujourd'hui</p>
                <p className="text-xs text-muted">{fastToday ? "MâshâAllah — continue !" : "Pas encore confirmé"}</p>
              </div>
              <button onClick={() => setFastToday(!fastToday)}
                className={`w-14 h-7 rounded-full transition-all ${fastToday ? 'bg-jade' : 'bg-white/10'}`}>
                <div className={`w-6 h-6 rounded-full bg-white shadow transition-all mx-0.5 ${fastToday ? 'translate-x-7' : 'translate-x-0'}`}/>
              </button>
            </div>
          </div>

          {/* Duas Iftar */}
          <div className="card p-4">
            <p className="text-sm font-medium text-soft mb-3">Dou'as de l'Iftar</p>
            {DUAS_IFTAR.map((d, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <p className="arabic text-lg text-gold text-right leading-relaxed">{d.ar}</p>
                <p className="text-xs text-muted italic mt-1">{d.fr}</p>
                <span className="text-xs bg-gold/10 text-gold-dim px-2 py-0.5 rounded-full">{d.source}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'tarawih' && (
        <div className="space-y-3">
          <div className="card p-4 text-center">
            <p className="text-4xl font-bold text-gold">{tarawihDone * 2}</p>
            <p className="text-muted text-sm">rak'ât / 20</p>
            <div className="h-2 bg-night rounded-full mt-3 overflow-hidden">
              <div className="progress-bar h-full" style={{width: `${(tarawihDone/10)*100}%`}}/>
            </div>
          </div>
          <p className="text-sm text-muted text-center">Coche chaque salam (2 rak'ât)</p>
          <div className="grid grid-cols-5 gap-2">
            {TARAWIH_RAKAAT.map((_, i) => (
              <button key={i} onClick={() => setTarawih(prev => ({...prev, [i]: !prev[i]}))}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${tarawih[i] ? 'bg-jade/30 border border-jade/50' : 'bg-panel border border-white/5'}`}>
                <p className="text-xs text-muted">{i+1}</p>
                <p className="text-xs text-soft">2 r.</p>
                {tarawih[i] && <p className="text-jade-light text-xs">✓</p>}
              </button>
            ))}
          </div>
          {tarawihDone === 10 && (
            <div className="card p-4 text-center border-gold/30 bg-gold/5">
              <p className="arabic text-xl text-gold">مَاشَاءَ اللَّهُ</p>
              <p className="text-sm text-soft mt-1">20 rak'ât de Tarawih accomplies !</p>
            </div>
          )}
          <div className="card p-3 bg-gold/5 border-gold/10 mt-2">
            <p className="text-xs text-muted text-center">+ Witr (1 ou 3 rak'ât) après Tarawih</p>
          </div>
        </div>
      )}

      {tab === 'khatm' && (
        <div className="space-y-4">
          <div className="card p-5 text-center">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">Progression du Khatm</p>
            <p className="text-5xl font-bold text-gold">{khatm}</p>
            <p className="text-muted text-sm">/ 604 pages</p>
            <div className="h-3 bg-night rounded-full mt-4 overflow-hidden">
              <div className="progress-bar h-full" style={{width: `${khatmPct}%`}}/>
            </div>
            <p className="text-xs text-muted mt-2">{khatmPct.toFixed(1)}% — {604 - khatm} pages restantes</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-soft mb-3">Mettre à jour ma progression</p>
            <div className="flex gap-2">
              <input type="number" min="0" max="604" value={khatmInput}
                onChange={e => setKhatmInput(Number(e.target.value))}
                className="flex-1 bg-night border border-white/10 rounded-lg p-2 text-soft text-center focus:outline-none focus:border-gold/30"
                placeholder="Page actuelle"
              />
              <button onClick={() => setKhatm(khatmInput)}
                className="bg-gold/20 border border-gold/40 text-gold px-4 py-2 rounded-lg text-sm">
                Sauver
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[20, 10, 5, 2].map(n => (
                <button key={n} onClick={() => { const v = Math.min(604, khatm+n); setKhatm(v); setKhatmInput(v); }}
                  className="bg-panel border border-white/5 text-muted text-xs py-2 rounded-lg hover:border-gold/20">
                  +{n} p.
                </button>
              ))}
            </div>
          </div>
          <div className="card p-4 bg-jade/5 border-jade/10">
            <p className="text-xs text-jade-light">💡 Objectif : 20 pages/jour = Khatm en 30 jours</p>
          </div>
        </div>
      )}

      {tab === 'vendredi' && (
        <div className="space-y-3">
          <div className={`card p-3 text-center ${isJumu ? 'border-gold/30 bg-gold/5' : 'border-white/5'}`}>
            <p className="text-sm text-soft">{isJumu ? "🌟 C'est le Vendredi aujourd'hui !" : "Checklist du prochain Vendredi"}</p>
          </div>
          {SUNNAH_VENDREDI.map(item => (
            <button key={item.id} onClick={() => setVendredi(prev => ({...prev, [item.id]: !prev[item.id]}))}
              className={`w-full card p-4 flex items-center justify-between transition-all ${vendredi[item.id] ? 'border-gold/30 bg-gold/5' : ''}`}>
              <p className="text-sm text-soft">{item.text}</p>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${vendredi[item.id] ? 'bg-gold border-gold text-night' : 'border-muted'}`}>
                {vendredi[item.id] && <span className="text-xs font-bold">✓</span>}
              </div>
            </button>
          ))}
          <div className="card p-4 bg-gold/5 border-gold/10">
            <p className="arabic text-base text-gold text-center mb-1">مَنْ قَرَأَ سُورَةَ الْكَهْفِ فِي يَوْمِ الْجُمُعَةِ</p>
            <p className="text-xs text-muted text-center italic">"Celui qui lit Al-Kahf le Vendredi sera illuminé entre les deux vendredis"</p>
          </div>
        </div>
      )}
    </div>
  );
}
