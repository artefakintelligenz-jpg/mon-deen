import { useState } from 'react';
import { useLocalStorage, getTodayKey } from '../hooks/useLocalStorage';

const QUESTIONS = [
  { id: 'q1', text: "Ai-je prié mes 5 prières à l'heure ?", category: "salat", icons: ['❌', '⚠️', '✅'] },
  { id: 'q2', text: "Ma niyyah était-elle sincère (pour Allah seul) ?", category: "ikhlas", icons: ['Non', 'Parfois', 'Oui'] },
  { id: 'q3', text: "Ai-je blessé quelqu'un par mes paroles ou actions ?", category: "akhlaq", icons: ['Oui', 'Un peu', 'Non'], inverted: true },
  { id: 'q4', text: "Ai-je fait mon dhikr du matin et du soir ?", category: "dhikr", icons: ['❌', '⚠️', '✅'] },
  { id: 'q5', text: "Ai-je contrôlé ma langue (mensonge, médisance) ?", category: "akhlaq", icons: ['Non', 'Difficilement', 'Oui'] },
  { id: 'q6', text: "Ai-je lu le Coran aujourd'hui ?", category: "quran", icons: ['Non', 'Un verset', 'Oui'] },
  { id: 'q7', text: "Ai-je remercié Allah pour Ses bienfaits ?", category: "shukr", icons: ['Non', 'Un peu', 'Oui'] },
  { id: 'q8', text: "Ai-je accompli un acte bénévole ou de bonté ?", category: "sadaqa", icons: ['Non', 'Peut-être', 'Oui'] },
];

const SCORES = {
  0: { label: "À améliorer", color: "text-red-400", bg: "bg-red-400/10" },
  1: { label: "Moyen", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  2: { label: "Bien", color: "text-jade-light", bg: "bg-jade/10" },
};

export default function Muhasaba() {
  const todayKey = getTodayKey();
  const [answers, setAnswers] = useLocalStorage(`muhasaba_${todayKey}`, {});
  const [showResult, setShowResult] = useState(false);
  const [tawbahNote, setTawbahNote] = useLocalStorage(`tawbah_${todayKey}`, '');
  const [tawbahInput, setTawbahInput] = useState(tawbahNote);
  const [showTawbah, setShowTawbah] = useState(false);

  const answered = Object.keys(answers).length;
  const avgScore = answered > 0 
    ? Object.values(answers).reduce((a, b) => a + b, 0) / answered 
    : 0;

  const getGlobalFeedback = () => {
    if (avgScore >= 1.7) return { text: "MâshâAllah ! Continue ainsi.", ar: "مَاشَاءَ اللَّهُ", color: "text-jade-light" };
    if (avgScore >= 1.2) return { text: "Bonne journée — quelques axes à renforcer.", ar: "بِإِذْنِ اللَّهِ", color: "text-yellow-400" };
    return { text: "Demain est un nouveau jour. Fais Tawbah et recommence.", ar: "تَوْبَةٌ وَجِدَّةٌ", color: "text-red-400" };
  };

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="display text-2xl text-soft font-semibold">Muhâsaba</h1>
        <p className="arabic text-lg text-gold">مُحَاسَبَةُ النَّفْس</p>
        <p className="text-xs text-muted mt-1">Bilan de conscience du soir</p>
      </div>

      <div className="card p-3 mb-4 bg-gold/5 border-gold/10">
        <p className="arabic text-base text-gold text-center mb-1">حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا</p>
        <p className="text-xs text-muted text-center italic">"Évaluez vous-mêmes avant d'être évalués" — Omar ibn al-Khattab</p>
      </div>

      {/* Questions */}
      <div className="space-y-3 mb-6">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="card p-4">
            <p className="text-sm text-soft mb-3">{q.text}</p>
            <div className="flex gap-2">
              {q.icons.map((icon, val) => (
                <button
                  key={val}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                  className={`flex-1 py-2 px-1 rounded-lg text-xs transition-all ${
                    answers[q.id] === val
                      ? val === 2 ? 'bg-jade/30 border border-jade/50 text-jade-light'
                        : val === 1 ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300'
                        : 'bg-red-500/20 border border-red-500/30 text-red-300'
                      : 'bg-night/40 border border-white/5 text-muted hover:border-white/20'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tawbah journal */}
      <div className="card mb-4 p-4">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setShowTawbah(!showTawbah)}
        >
          <p className="text-sm font-medium text-soft flex items-center gap-2">
            <span>🤍</span> Journal de Tawbah
          </p>
          <p className="text-xs text-muted">Privé — jamais affiché</p>
        </button>
        {showTawbah && (
          <div className="mt-3">
            <textarea
              value={tawbahInput}
              onChange={e => setTawbahInput(e.target.value)}
              onBlur={() => setTawbahNote(tawbahInput)}
              placeholder="Ce dont je me repens aujourd'hui, et ma résolution pour demain..."
              className="w-full bg-night/60 border border-white/10 rounded-lg p-3 text-sm text-soft placeholder-muted resize-none focus:outline-none focus:border-gold/20"
              rows={4}
            />
            <div className="mt-2 text-center">
              <p className="arabic text-lg text-gold">إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ</p>
              <p className="text-xs text-muted">"Allah aime ceux qui reviennent vers Lui"</p>
            </div>
          </div>
        )}
      </div>

      {/* Result */}
      {answered >= 4 && (
        <div className="card p-5 text-center border-gold/10 bg-gradient-to-br from-gold/5 to-transparent">
          {(() => {
            const fb = getGlobalFeedback();
            return (
              <>
                <p className={`arabic text-2xl mb-2 ${fb.color}`}>{fb.ar}</p>
                <p className="text-sm text-soft">{fb.text}</p>
                <div className="flex justify-center gap-4 mt-3">
                  {Object.entries(
                    Object.entries(answers).reduce((acc, [id, val]) => {
                      const q = QUESTIONS.find(q => q.id === id);
                      const cat = q?.category || 'autre';
                      acc[cat] = (acc[cat] || 0) + val;
                      return acc;
                    }, {})
                  ).map(([cat, score]) => (
                    <div key={cat} className="text-center">
                      <p className="text-xs text-muted capitalize">{cat}</p>
                      <p className={`text-sm font-semibold ${score > 1 ? 'text-jade-light' : 'text-yellow-400'}`}>
                        {score > 1 ? '✓' : '↗'}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
