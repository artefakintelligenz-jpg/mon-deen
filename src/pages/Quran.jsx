import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SURAHS = [
  {n:1,ar:"الفاتحة",fr:"Al-Fatiha",v:7},{n:2,ar:"البقرة",fr:"Al-Baqara",v:286},
  {n:3,ar:"آل عمران",fr:"Ali Imran",v:200},{n:4,ar:"النساء",fr:"An-Nisa",v:176},
  {n:5,ar:"المائدة",fr:"Al-Maida",v:120},{n:18,ar:"الكهف",fr:"Al-Kahf",v:110},
  {n:19,ar:"مريم",fr:"Maryam",v:98},{n:36,ar:"يس",fr:"Ya-Sin",v:83},
  {n:55,ar:"الرحمن",fr:"Ar-Rahman",v:78},{n:56,ar:"الواقعة",fr:"Al-Waqia",v:96},
  {n:67,ar:"الملك",fr:"Al-Mulk",v:30},{n:78,ar:"النبأ",fr:"An-Naba",v:40},
  {n:112,ar:"الإخلاص",fr:"Al-Ikhlas",v:4},{n:113,ar:"الفلق",fr:"Al-Falaq",v:5},
  {n:114,ar:"الناس",fr:"An-Nas",v:6},
];

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Al-Afasy" },
  { id: "ar.abdurrahmaansudais", name: "Al-Sudais" },
  { id: "ar.husary", name: "Al-Husary" },
];

// Tajweed color rules (simplified - highlight key phonemes)
function applyTajweed(text) {
  if (!text) return text;
  return text
    .replace(/(اللَّه|اللَّهِ|اللَّهُ)/g, '<span style="color:#e8c97e">$1</span>')
    .replace(/(بِسْمِ)/g, '<span style="color:#3d9b84">$1</span>')
    .replace(/([نمو]ّ)/g, '<span style="color:#c084fc">$1</span>')
    .replace(/(ق|ط|ص|ض|ظ|غ)/g, '<span style="color:#f97316">$1</span>');
}

export default function Quran() {
  const [selected, setSelected] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reciter, setReciter] = useLocalStorage("reciter", "ar.alafasy");
  const [playing, setPlaying] = useState(false);
  const [bookmarks, setBookmarks] = useLocalStorage("quran_bookmarks", []);
  const [search, setSearch] = useState("");
  const [showPhonetic, setShowPhonetic] = useLocalStorage("show_phonetic", true);
  const [showTajweed, setShowTajweed] = useLocalStorage("show_tajweed", false);
  const [showTrad, setShowTrad] = useLocalStorage("show_trad", true);
  const audioRef = useRef(null);

  const loadSurah = (surah) => {
    setSelected(surah);
    setLoading(true);
    setVerses([]);
    fetch("https://api.alquran.cloud/v1/surah/" + surah.n + "/editions/quran-simple,en.transliteration,fr.hamidullah")
      .then(r => r.json())
      .then(d => {
        if (d.code === 200) {
          const ar = d.data[0].ayahs;
          const ph = d.data[1].ayahs;
          const fr = d.data[2].ayahs;
          setVerses(ar.map((v, i) => ({
            n: v.numberInSurah,
            ar: v.text,
            ph: ph[i] ? ph[i].text : "",
            fr: fr[i] ? fr[i].text : ""
          })));
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  const playAudio = () => {
    if (!selected || !audioRef.current) return;
    const url = "https://cdn.islamic.network/quran/audio-surah/128/" + reciter + "/" + selected.n + ".mp3";
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.src = url; audioRef.current.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  const toggleBookmark = (n) => setBookmarks(prev => prev.includes(n) ? prev.filter(b => b !== n) : [...prev, n]);
  const filtered = SURAHS.filter(s => s.fr.toLowerCase().includes(search.toLowerCase()) || s.ar.includes(search) || String(s.n).includes(search));

  if (selected) {
    return (
      <div className="fade-in pb-24 px-4 pt-2 max-w-md mx-auto">
        <div className="sticky top-0 bg-night/95 backdrop-blur py-3 z-10 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => { setSelected(null); audioRef.current && audioRef.current.pause(); setPlaying(false); }} className="text-muted text-xl">←</button>
            <div className="flex-1">
              <p className="arabic text-xl text-gold">{selected.ar}</p>
              <p className="text-xs text-muted">{selected.fr} — {selected.v} versets</p>
            </div>
            <button onClick={() => toggleBookmark(selected.n)} className={"text-xl " + (bookmarks.includes(selected.n) ? "text-gold" : "text-muted")}>{bookmarks.includes(selected.n) ? "★" : "☆"}</button>
            <button onClick={playAudio} className={"w-9 h-9 rounded-full flex items-center justify-center border transition-all " + (playing ? "bg-jade/30 border-jade/50" : "bg-panel border-white/10")}>
              <span className="text-sm">{playing ? "⏸" : "▶"}</span>
            </button>
          </div>

          {/* Options affichage */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShowPhonetic(!showPhonetic)}
              className={"text-xs px-2 py-1 rounded-lg border transition-all " + (showPhonetic ? "bg-jade/20 border-jade/40 text-jade-light" : "bg-panel border-white/10 text-muted")}>
              🔤 Phonétique
            </button>
            <button onClick={() => setShowTajweed(!showTajweed)}
              className={"text-xs px-2 py-1 rounded-lg border transition-all " + (showTajweed ? "bg-gold/20 border-gold/40 text-gold" : "bg-panel border-white/10 text-muted")}>
              🎨 Tajweed
            </button>
            <button onClick={() => setShowTrad(!showTrad)}
              className={"text-xs px-2 py-1 rounded-lg border transition-all " + (showTrad ? "bg-blue-500/20 border-blue-500/40 text-blue-300" : "bg-panel border-white/10 text-muted")}>
              🇫🇷 Traduction
            </button>
          </div>

          <select value={reciter} onChange={e => { setReciter(e.target.value); setPlaying(false); }}
            className="w-full mt-2 bg-panel border border-white/10 rounded-lg p-1.5 text-xs text-soft focus:outline-none">
            {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        <audio ref={audioRef} onEnded={() => setPlaying(false)} />
        {loading && <p className="text-center text-muted py-8">Chargement...</p>}

        <div className="space-y-3">
          {verses.map(v => (
            <div key={v.n} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                  <span className="text-xs text-gold">{v.n}</span>
                </div>
              </div>
              {showTajweed ? (
                <p className="arabic text-xl leading-loose text-right mb-2"
                  dangerouslySetInnerHTML={{ __html: applyTajweed(v.ar) }}/>
              ) : (
                <p className="arabic text-xl text-soft leading-loose text-right mb-2">{v.ar}</p>
              )}
              {showPhonetic && v.ph && (
                <p className="text-xs text-gold-dim italic leading-relaxed mb-2 border-l-2 border-gold/20 pl-2">{v.ph}</p>
              )}
              {showTrad && v.fr && (
                <p className="text-xs text-muted leading-relaxed">{v.fr}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-4">
        <h1 className="display text-2xl text-soft font-semibold">Coran</h1>
        <p className="arabic text-lg text-gold">الْقُرْآنُ الْكَرِيم</p>
      </div>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Rechercher une sourate..."
        className="w-full bg-panel border border-white/10 rounded-xl p-3 text-sm text-soft placeholder-muted focus:outline-none focus:border-gold/30 mb-4"/>
      {bookmarks.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted uppercase tracking-widest mb-2">★ Favoris</p>
          <div className="flex gap-2 flex-wrap">
            {bookmarks.map(n => { const s = SURAHS.find(s => s.n === n); return s ? (
              <button key={n} onClick={() => loadSurah(s)} className="card px-3 py-1.5 text-xs text-gold border-gold/20 card-hover">{s.fr}</button>
            ) : null; })}
          </div>
        </div>
      )}
      <div className="space-y-2">
        {filtered.map(s => (
          <button key={s.n} onClick={() => loadSurah(s)} className="w-full card p-4 flex items-center justify-between card-hover">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-xs text-gold">{s.n}</span>
              </div>
              <div className="text-left">
                <p className="text-soft text-sm font-medium">{s.fr}</p>
                <p className="text-muted text-xs">{s.v} versets</p>
              </div>
            </div>
            <p className="arabic text-lg text-gold">{s.ar}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
