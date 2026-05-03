import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SURAHS = [
  {n:1,ar:"الفاتحة",fr:"Al-Fatiha",v:7,pages:1},
  {n:2,ar:"البقرة",fr:"Al-Baqara",v:286,pages:48},
  {n:3,ar:"آل عمران",fr:"Ali 'Imran",v:200,pages:20},
  {n:4,ar:"النساء",fr:"An-Nisa",v:176,pages:23},
  {n:5,ar:"المائدة",fr:"Al-Ma'ida",v:120,pages:16},
  {n:18,ar:"الكهف",fr:"Al-Kahf",v:110,pages:11},
  {n:19,ar:"مريم",fr:"Maryam",v:98,pages:7},
  {n:36,ar:"يس",fr:"Ya-Sin",v:83,pages:9},
  {n:55,ar:"الرحمن",fr:"Ar-Rahman",v:78,pages:4},
  {n:56,ar:"الواقعة",fr:"Al-Waqi'a",v:96,pages:5},
  {n:67,ar:"الملك",fr:"Al-Mulk",v:30,pages:3},
  {n:78,ar:"النبأ",fr:"An-Naba",v:40,pages:2},
  {n:112,ar:"الإخلاص",fr:"Al-Ikhlas",v:4,pages:1},
  {n:113,ar:"الفلق",fr:"Al-Falaq",v:5,pages:1},
  {n:114,ar:"الناس",fr:"An-Nas",v:6,pages:1},
];

const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Al-Afasy' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdurrahman Al-Sudais' },
  { id: 'ar.husary', name: 'Mahmoud Al-Husary' },
];

export default function Quran() {
  const [selected, setSelected] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reciter, setReciter] = useLocalStorage('reciter', 'ar.alafasy');
  const [playing, setPlaying] = useState(false);
  const [bookmarks, setBookmarks] = useLocalStorage('quran_bookmarks', []);
  const [search, setSearch] = useState('');
  const audioRef = useRef(null);

  const loadSurah = (surah) => {
    setSelected(surah);
    setLoading(true);
    setVerses([]);
    fetch(`https://api.alquran.cloud/v1/surah/${surah.n}/editions/quran-simple,fr.hamidullah`)
      .then(r => r.json())
      .then(d => {
        if (d.code === 200) {
          const ar = d.data[0].ayahs;
          const fr = d.data[1].ayahs;
          setVerses(ar.map((v, i) => ({ n: v.numberInSurah, ar: v.text, fr: fr[i]?.text || '' })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const playAudio = (surahN) => {
    const url = `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surahN}.mp3`;
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.src = url;
        audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    }
  };

  const toggleBookmark = (surahN) => {
    setBookmarks(prev => prev.includes(surahN) ? prev.filter(b => b !== surahN) : [...prev, surahN]);
  };

  const filtered = SURAHS.filter(s =>
    s.fr.toLowerCase().includes(search.toLowerCase()) ||
    s.ar.includes(search) ||
    String(s.n).includes(search)
  );

  if (selected) {
    return (
      <div className="fade-in pb-24 px-4 pt-2 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4 sticky top-0 bg-night/95 backdrop-blur py-3 z-10">
          <button onClick={() => { setSelected(null); if(audioRef.current) audioRef.current.pause(); setPlaying(false); }}
            className="text-muted text-xl">←</button>
          <div className="flex-1">
            <p className="arabic text-xl text-gold">{selected.ar}</p>
            <p className="text-xs text-muted">{selected.fr} — {selected.v} versets</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggleBookmark(selected.n)}
              className={`text-xl ${bookmarks.includes(selected.n) ? 'text-gold' : 'text-muted'}`}>
              {bookmarks.includes(selected.n) ? '★' : '☆'}
            </button>
            <button onClick={() => playAudio(selected.n)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${playing ? 'bg-jade/30 border-jade/50' : 'bg-panel border-white/10'}`}>
              <span className="text-sm">{playing ? '⏸' : '▶'}</span>
            </button>
          </div>
        </div>

        {/* Reciter selector */}
        <div className="mb-4">
          <select value={reciter} onChange={e => { setReciter(e.target.value); setPlaying(false); }}
            className="w-full bg-panel border border-white/10 rounded-lg p-2 text-sm text-soft focus:outline-none">
            {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        <audio ref={audioRef} onEnded={() => setPlaying(false)} />

        {loading && <p className="text-center text-muted py-8">Chargement...</p>}

        <div className="space-y-3">
          {verses.map(v => (
            <div key={v.n} className="card p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gold">{v.n}</span>
                </div>
              </div>
              <p className="arabic text-xl text-soft leading-loose text-right mb-3">{v.ar}</p>
              <p className="text-xs text-muted italic leading-relaxed">{v.fr}</p>
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
            {bookmarks.map(n => {
              const s = SURAHS.find(s => s.n === n);
              return s ? (
                <button key={n} onClick={() => loadSurah(s)}
                  className="card px-3 py-1.5 text-xs text-gold border-gold/20 card-hover">
                  {s.fr}
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map(s => (
          <button key={s.n} onClick={() => loadSurah(s)}
            className="w-full card p-4 flex items-center justify-between card-hover">
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

      <div className="card mt-4 p-3 bg-jade/5 border-jade/10 text-center">
        <p className="text-xs text-muted">Texte & traduction via AlQuran.cloud — Audio via Islamic Network</p>
      </div>
    </div>
  );
}
