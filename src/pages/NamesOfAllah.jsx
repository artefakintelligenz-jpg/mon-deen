import { useState } from 'react';
import { NAMES_OF_ALLAH } from '../data/names';

export default function NamesOfAllah() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState(false);

  // Name of the day
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todayNameIdx = dayOfYear % 99;

  const filtered = NAMES_OF_ALLAH.filter(n =>
    n.fr.toLowerCase().includes(search.toLowerCase()) ||
    n.meaning.toLowerCase().includes(search.toLowerCase()) ||
    n.ar.includes(search)
  );

  if (quizMode) {
    const name = NAMES_OF_ALLAH[quizIdx % NAMES_OF_ALLAH.length];
    return (
      <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setQuizMode(false)} className="text-muted">← Retour</button>
          <h1 className="display text-xl text-soft">Quiz — 99 Noms</h1>
        </div>
        <div className="card p-6 text-center">
          <p className="text-xs text-muted uppercase tracking-widest mb-4">Nom {quizIdx + 1} / 99</p>
          <p className="arabic text-5xl text-gold mb-4">{name.ar}</p>
          {!quizRevealed ? (
            <button
              onClick={() => setQuizRevealed(true)}
              className="bg-jade/20 border border-jade/40 text-jade-light px-6 py-3 rounded-xl text-sm"
            >
              Révéler la signification
            </button>
          ) : (
            <div className="space-y-3">
              <p className="display text-2xl text-soft font-semibold">{name.fr}</p>
              <p className="text-soft">{name.meaning}</p>
              <p className="text-sm text-muted italic bg-gold/5 p-3 rounded-lg">"{name.example}"</p>
              <button
                onClick={() => { setQuizIdx(i => i + 1); setQuizRevealed(false); }}
                className="bg-gold/20 border border-gold/40 text-gold px-6 py-3 rounded-xl text-sm"
              >
                Nom suivant →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selected !== null) {
    const name = NAMES_OF_ALLAH[selected];
    return (
      <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
        <button onClick={() => setSelected(null)} className="text-muted mb-6 block">← Retour</button>
        <div className="card p-6 text-center">
          <p className="text-xs text-muted mb-2">Nom n°{selected + 1}</p>
          <p className="arabic text-6xl text-gold mb-4 leading-loose">{name.ar}</p>
          <p className="display text-3xl text-soft font-semibold mb-2">{name.fr}</p>
          <p className="text-soft text-lg mb-4">{name.meaning}</p>
          <div className="bg-gold/5 border border-gold/10 rounded-xl p-4 mb-4">
            <p className="text-sm text-muted italic leading-relaxed">"{name.example}"</p>
          </div>
          {selected + 1 === todayNameIdx + 1 && (
            <div className="bg-jade/10 border border-jade/20 rounded-xl p-3">
              <p className="text-xs text-jade-light">⭐ Nom du jour — {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-4">
          {selected > 0 && (
            <button onClick={() => setSelected(s => s - 1)} className="text-muted text-sm">← Précédent</button>
          )}
          {selected < 98 && (
            <button onClick={() => setSelected(s => s + 1)} className="text-muted text-sm ml-auto">Suivant →</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="display text-2xl text-soft font-semibold">99 Noms d'Allah</h1>
        <p className="arabic text-lg text-gold">أَسْمَاءُ اللهِ الْحُسْنَى</p>
      </div>

      {/* Name of the day */}
      <button
        onClick={() => setSelected(todayNameIdx)}
        className="w-full card p-5 mb-4 text-center border-gold/20 bg-gradient-to-br from-gold/5 to-transparent card-hover"
      >
        <p className="text-xs text-muted uppercase tracking-widest mb-2">Nom du jour</p>
        <p className="arabic text-4xl text-gold mb-2">{NAMES_OF_ALLAH[todayNameIdx].ar}</p>
        <p className="display text-xl text-soft font-semibold">{NAMES_OF_ALLAH[todayNameIdx].fr}</p>
        <p className="text-sm text-muted mt-1">{NAMES_OF_ALLAH[todayNameIdx].meaning}</p>
      </button>

      {/* Quiz button */}
      <button
        onClick={() => setQuizMode(true)}
        className="w-full card p-3 mb-4 text-center border-jade/20 card-hover"
      >
        <p className="text-sm text-soft">🎯 Défi mémorisation — Quiz des noms</p>
      </button>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un nom..."
          className="w-full bg-panel border border-white/10 rounded-xl p-3 text-sm text-soft placeholder-muted focus:outline-none focus:border-gold/30"
        />
      </div>

      {/* Names grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((name, i) => {
          const realIdx = NAMES_OF_ALLAH.indexOf(name);
          const isToday = realIdx === todayNameIdx;
          return (
            <button
              key={realIdx}
              onClick={() => setSelected(realIdx)}
              className={`card p-3 text-center card-hover ${isToday ? 'border-gold/30 bg-gold/5' : ''}`}
            >
              <p className="arabic text-xl text-gold mb-1">{name.ar}</p>
              <p className="text-xs text-soft font-medium">{name.fr}</p>
              <p className="text-xs text-muted leading-tight">{name.meaning}</p>
              {isToday && <span className="text-xs text-gold mt-1 block">⭐ Aujourd'hui</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
