import { useState, useEffect } from 'react';
import { useLocalStorage, getTodayKey } from '../hooks/useLocalStorage';

const TARAWIH_RAKAAT = [0,1,2,3,4,5,6,7,8,9];

const DUAS_IFTAR = [
  { ar: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ", fr: "Ô Allah, c'est pour Toi que j'ai jeûné et c'est avec Ta provision que je romps le jeûne", source: "Abû Dawûd" },
  { ar: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ", fr: "La soif est partie, les veines désaltérées, la récompense acquise si Allah le veut", source: "Abû Dawûd" },
];

// Generate voluntary fasting days for the year
function getVoluntaryFastingDays() {
  const year = new Date().getFullYear();
  const days = [];
  
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dow = date.getDay();
      const iso = date.toISOString().split("T")[0];
      
      // Monday (1) and Thursday (4)
      if (dow === 1 || dow === 4) {
        days.push({ date: iso, type: dow === 1 ? "Lundi" : "Jeudi", category: "sunnah" });
      }
      
      // White days: 13, 14, 15 of each month
      if (day === 13 || day === 14 || day === 15) {
        days.push({ date: iso, type: "Jour blanc (" + day + ")", category: "blanc" });
      }
    }
  }
  
  // Sort by date and deduplicate
  return days.sort((a, b) => a.date.localeCompare(b.date))
    .filter((d, i, arr) => i === 0 || d.date !== arr[i-1].date);
}

export default function Ramadan({ location }) {
  const todayKey = getTodayKey();
  const [tarawih, setTarawih] = useLocalStorage("tarawih_" + todayKey, {});
  const [khatm, setKhatm] = useLocalStorage("khatm_progress", 0);
  const [khatmInput, setKhatmInput] = useState(khatm);
  const [fastToday, setFastToday] = useLocalStorage("fast_" + todayKey, false);
  const [iftarTimes, setIftarTimes] = useState(null);
  const [tab, setTab] = useState("accueil");
  const [modeSimham, setModeSimham] = useLocalStorage("mode_simham", false);
  const [fastLog, setFastLog] = useLocalStorage("fast_voluntary_log", {});

  const today = getTodayKey();
  const voluntaryDays = getVoluntaryFastingDays();
  const upcoming = voluntaryDays.filter(d => d.date >= today).slice(0, 20);
  const todayFast = voluntaryDays.find(d => d.date === today);
  const tarawihDone = Object.values(tarawih).filter(Boolean).length;
  const khatmPct = Math.min(100, (khatm / 604) * 100);

  useEffect(() => {
    if (!location) return;
    const d = new Date();
    const dd = String(d.getDate()).padStart(2,"0");
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const yyyy = d.getFullYear();
    fetch("https://api.aladhan.com/v1/timings/" + dd + "-" + mm + "-" + yyyy + "?latitude=" + location.lat + "&longitude=" + location.lng + "&method=3")
      .then(r => r.json()).then(d => {
        if (d.code === 200) setIftarTimes({ suhoor: d.data.timings.Fajr, iftar: d.data.timings.Maghrib });
      }).catch(() => {});
  }, [location]);

  const formatDate = (iso) => {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="display text-2xl text-soft font-semibold">Ramadan & Jeûnes</h1>
          <p className="arabic text-lg text-gold">رَمَضَان وَالصِّيَام</p>
        </div>
        {/* Mode Siham toggle */}
        <button onClick={() => setModeSimham(!modeSimham)}
          className={"px-3 py-1.5 rounded-xl text-xs font-medium border transition-all " + (modeSimham ? "bg-jade/20 border-jade/40 text-jade-light" : "bg-panel border-white/10 text-muted")}>
          🌿 Mode Siham
        </button>
      </div>

      {modeSimham && (
        <div className="card mb-4 p-4 border-jade/30 bg-jade/5">
          <p className="text-sm text-jade-light font-medium mb-1">🌿 Mode Siham actif</p>
          <p className="text-xs text-muted">Rappels doux, intentions renforcées, focus sur la spiritualité du jeûne plutôt que sur la nourriture.</p>
          <p className="arabic text-base text-gold text-center mt-2">وَأَن تَصُومُوا خَيْرٌ لَّكُمْ</p>
          <p className="text-xs text-muted text-center italic">"Et que vous jeûniez est meilleur pour vous" — Al-Baqara 2:184</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {[["accueil","🌙 Jeûne"],["jeunes","📅 Jeûnes annuels"],["tarawih","🕌 Tarawih"],["khatm","📖 Khatm"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={"flex-shrink-0 py-1.5 px-3 rounded-xl text-sm transition-all " + (tab===id ? "bg-gold text-night font-semibold" : "bg-panel text-muted border border-white/5")}>
            {label}
          </button>
        ))}
      </div>

      {tab === "accueil" && (
        <div className="space-y-4">
          {iftarTimes ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 text-center border-blue-400/20 bg-blue-400/5">
                <p className="text-2xl mb-1">🌙</p>
                <p className="text-muted text-xs uppercase">Suhoor</p>
                <p className="text-2xl font-bold text-soft">{iftarTimes.suhoor}</p>
              </div>
              <div className="card p-4 text-center border-orange-400/20 bg-orange-400/5">
                <p className="text-2xl mb-1">🌅</p>
                <p className="text-muted text-xs uppercase">Iftar</p>
                <p className="text-2xl font-bold text-gold">{iftarTimes.iftar}</p>
              </div>
            </div>
          ) : (
            <div className="card p-3 text-center text-muted text-xs">Active ta localisation dans Prières pour les horaires</div>
          )}

          {todayFast && (
            <div className="card p-4 border-gold/30 bg-gold/5">
              <p className="text-sm text-gold font-medium">⭐ Aujourd'hui : {todayFast.type}</p>
              <p className="text-xs text-muted mt-1">Jeûne sunnah recommandé</p>
            </div>
          )}

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-soft font-medium text-sm">Jeûne aujourd'hui</p>
                <p className="text-xs text-muted">{fastToday ? "MâshâAllah — continue !" : "Pas encore confirmé"}</p>
              </div>
              <button onClick={() => setFastToday(!fastToday)}
                className={"w-14 h-7 rounded-full transition-all " + (fastToday ? "bg-jade" : "bg-white/10")}>
                <div className={"w-6 h-6 rounded-full bg-white shadow transition-all mx-0.5 " + (fastToday ? "translate-x-7" : "translate-x-0")}/>
              </button>
            </div>
          </div>

          <div className="card p-4">
            <p className="text-sm font-medium text-soft mb-3">Dou'as de l'Iftar</p>
            {DUAS_IFTAR.map((d, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <p className="text-xs text-soft italic mb-1">{d.fr}</p>
                <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{d.source}</span>
                <p className="arabic text-base text-gold text-right mt-2">{d.ar}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "jeunes" && (
        <div className="space-y-3">
          <div className="card p-3 bg-jade/5 border-jade/10">
            <p className="text-xs text-jade-light font-medium mb-1">Jeûnes volontaires recommandés</p>
            <div className="flex gap-3 text-xs text-muted">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gold"/>Lundi & Jeudi</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-jade"/>Jours blancs (13-14-15)</span>
            </div>
          </div>

          <div className="space-y-2">
            {upcoming.map((d, i) => {
              const isFasted = fastLog[d.date];
              const isToday = d.date === today;
              return (
                <button key={i} onClick={() => setFastLog(prev => ({...prev, [d.date]: !prev[d.date]}))}
                  className={"w-full card p-3 flex items-center justify-between transition-all " + (isToday ? "border-gold/40 bg-gold/5" : "") + (isFasted ? " border-jade/30" : "")}>
                  <div className="flex items-center gap-3">
                    <div className={"w-2 h-2 rounded-full flex-shrink-0 " + (d.category === "blanc" ? "bg-jade" : "bg-gold")}/>
                    <div className="text-left">
                      <p className={"text-sm " + (isToday ? "text-gold font-medium" : "text-soft")}>
                        {formatDate(d.date)}{isToday ? " — Aujourd'hui" : ""}
                      </p>
                      <p className="text-xs text-muted">{d.type}</p>
                    </div>
                  </div>
                  <div className={"w-6 h-6 rounded-full border flex items-center justify-center " + (isFasted ? "bg-jade/30 border-jade/50 text-jade-light" : "border-muted")}>
                    {isFasted && <span className="text-xs">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "tarawih" && (
        <div className="space-y-3">
          <div className="card p-4 text-center">
            <p className="text-4xl font-bold text-gold">{tarawihDone * 2}</p>
            <p className="text-muted text-sm">rak'ât / 20</p>
            <div className="h-2 bg-night rounded-full mt-3 overflow-hidden">
              <div className="progress-bar h-full" style={{width: (tarawihDone/10*100) + "%"}}/>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {TARAWIH_RAKAAT.map((_, i) => (
              <button key={i} onClick={() => setTarawih(prev => ({...prev, [i]: !prev[i]}))}
                className={"aspect-square rounded-xl flex flex-col items-center justify-center transition-all " + (tarawih[i] ? "bg-jade/30 border border-jade/50" : "bg-panel border border-white/5")}>
                <p className="text-xs text-muted">{i+1}</p>
                <p className="text-xs text-soft">2r.</p>
                {tarawih[i] && <p className="text-jade-light text-xs">✓</p>}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "khatm" && (
        <div className="space-y-4">
          <div className="card p-5 text-center">
            <p className="text-5xl font-bold text-gold">{khatm}</p>
            <p className="text-muted text-sm">/ 604 pages</p>
            <div className="h-3 bg-night rounded-full mt-4 overflow-hidden">
              <div className="progress-bar h-full" style={{width: khatmPct + "%"}}/>
            </div>
            <p className="text-xs text-muted mt-2">{khatmPct.toFixed(1)}% — {604 - khatm} pages restantes</p>
          </div>
          <div className="card p-4">
            <div className="flex gap-2">
              <input type="number" min="0" max="604" value={khatmInput}
                onChange={e => setKhatmInput(Number(e.target.value))}
                className="flex-1 bg-night border border-white/10 rounded-lg p-2 text-soft text-center focus:outline-none focus:border-gold/30"/>
              <button onClick={() => setKhatm(khatmInput)}
                className="bg-gold/20 border border-gold/40 text-gold px-4 py-2 rounded-lg text-sm">Sauver</button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[20, 10, 5, 2].map(n => (
                <button key={n} onClick={() => { const v = Math.min(604, khatm+n); setKhatm(v); setKhatmInput(v); }}
                  className="bg-panel border border-white/5 text-muted text-xs py-2 rounded-lg hover:border-gold/20">+{n}p.</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
