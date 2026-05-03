import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function CerclePrivee() {
  const [members, setMembers] = useLocalStorage('cercle_members', []);
  const [duas, setDuas] = useLocalStorage('cercle_duas', []);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddDua, setShowAddDua] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDua, setNewDua] = useState('');
  const [selectedFor, setSelectedFor] = useState('');
  const [tab, setTab] = useState('duas');

  const addMember = () => {
    if (!newName.trim()) return;
    setMembers(prev => [...prev, { id: Date.now(), name: newName.trim(), since: new Date().toLocaleDateString('fr-FR') }]);
    setNewName('');
    setShowAddMember(false);
  };

  const addDua = () => {
    if (!newDua.trim()) return;
    setDuas(prev => [...prev, {
      id: Date.now(),
      text: newDua.trim(),
      for: selectedFor || 'Moi',
      date: new Date().toLocaleDateString('fr-FR'),
      answered: false
    }]);
    setNewDua('');
    setSelectedFor('');
    setShowAddDua(false);
  };

  const toggleAnswered = (id) => {
    setDuas(prev => prev.map(d => d.id === id ? {...d, answered: !d.answered} : d));
  };

  const removeDua = (id) => setDuas(prev => prev.filter(d => d.id !== id));
  const removeMember = (id) => setMembers(prev => prev.filter(m => m.id !== id));

  const activeDuas = duas.filter(d => !d.answered);
  const answeredDuas = duas.filter(d => d.answered);

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-4">
        <h1 className="display text-2xl text-soft font-semibold">Cercle Privé</h1>
        <p className="arabic text-lg text-gold">الدَّائِرَةُ الخَاصَّة</p>
      </div>

      <div className="card p-3 mb-4 bg-jade/5 border-jade/10">
        <p className="text-xs text-jade-light">🔒 Tout reste sur ton appareil — aucun partage externe</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[['duas','🤲 Dou\'as'],['membres','👥 Membres']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-xl text-sm transition-all ${tab===id ? 'bg-gold text-night font-semibold' : 'bg-panel text-muted border border-white/5'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'duas' && (
        <div className="space-y-3">
          <button onClick={() => setShowAddDua(true)}
            className="w-full card p-3 text-center border-dashed border-gold/20 hover:border-gold/40 transition-all">
            <p className="text-sm text-gold">+ Ajouter une dou'a</p>
          </button>

          {showAddDua && (
            <div className="card p-4 border-gold/20">
              <p className="text-sm text-soft mb-3">Nouvelle dou'a</p>
              <textarea value={newDua} onChange={e => setNewDua(e.target.value)}
                placeholder="Dou'a ou besoin..."
                className="w-full bg-night border border-white/10 rounded-lg p-2 text-sm text-soft placeholder-muted resize-none focus:outline-none focus:border-gold/20 mb-2" rows={3}/>
              <select value={selectedFor} onChange={e => setSelectedFor(e.target.value)}
                className="w-full bg-night border border-white/10 rounded-lg p-2 text-sm text-soft mb-3 focus:outline-none">
                <option value="">Pour qui ? (optionnel)</option>
                <option value="Moi">Moi</option>
                {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={addDua} className="flex-1 bg-gold/20 border border-gold/40 text-gold py-2 rounded-lg text-sm">Sauver</button>
                <button onClick={() => setShowAddDua(false)} className="flex-1 bg-panel border border-white/5 text-muted py-2 rounded-lg text-sm">Annuler</button>
              </div>
            </div>
          )}

          {activeDuas.length === 0 && !showAddDua && (
            <p className="text-center text-muted text-sm py-4">Aucune dou'a en attente</p>
          )}

          {activeDuas.map(d => (
            <div key={d.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-soft leading-relaxed">{d.text}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded-full">{d.for}</span>
                    <span className="text-xs text-muted">{d.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleAnswered(d.id)} title="Marqué comme exaucée"
                    className="text-lg text-jade-light/50 hover:text-jade-light">✓</button>
                  <button onClick={() => removeDua(d.id)} className="text-muted hover:text-red-400 text-sm">✕</button>
                </div>
              </div>
            </div>
          ))}

          {answeredDuas.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-muted uppercase tracking-widest mb-2">Dou'as exaucées 🤲</p>
              {answeredDuas.map(d => (
                <div key={d.id} className="card p-3 mb-2 opacity-60 border-jade/10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-soft line-through">{d.text}</p>
                    <button onClick={() => removeDua(d.id)} className="text-muted text-xs ml-2">✕</button>
                  </div>
                  <p className="text-xs text-jade-light mt-1">الحمد لله — Exaucée</p>
                </div>
              ))}
            </div>
          )}

          <div className="card p-4 bg-gold/5 border-gold/10 text-center mt-4">
            <p className="arabic text-base text-gold mb-1">ادْعُونِي أَسْتَجِبْ لَكُمْ</p>
            <p className="text-xs text-muted italic">"Invoquez-Moi, Je vous répondrai" — Al-Ghafir 40:60</p>
          </div>
        </div>
      )}

      {tab === 'membres' && (
        <div className="space-y-3">
          <button onClick={() => setShowAddMember(true)}
            className="w-full card p-3 text-center border-dashed border-gold/20 hover:border-gold/40 transition-all">
            <p className="text-sm text-gold">+ Ajouter un proche</p>
          </button>

          {showAddMember && (
            <div className="card p-4 border-gold/20">
              <p className="text-sm text-soft mb-2">Prénom</p>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMember()}
                placeholder="Ex: Maman, Papa, Ahmed..."
                className="w-full bg-night border border-white/10 rounded-lg p-2 text-sm text-soft placeholder-muted mb-3 focus:outline-none focus:border-gold/20"/>
              <div className="flex gap-2">
                <button onClick={addMember} className="flex-1 bg-gold/20 border border-gold/40 text-gold py-2 rounded-lg text-sm">Ajouter</button>
                <button onClick={() => setShowAddMember(false)} className="flex-1 bg-panel border border-white/5 text-muted py-2 rounded-lg text-sm">Annuler</button>
              </div>
            </div>
          )}

          {members.length === 0 && !showAddMember && (
            <p className="text-center text-muted text-sm py-4">Ajoute tes proches pour leur dédier des dou'as</p>
          )}

          {members.map(m => {
            const memberDuas = duas.filter(d => d.for === m.name && !d.answered).length;
            return (
              <div key={m.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                    <span className="text-lg">{m.name[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-soft font-medium">{m.name}</p>
                    <p className="text-xs text-muted">{memberDuas} dou'a(s) en cours</p>
                  </div>
                </div>
                <button onClick={() => removeMember(m.id)} className="text-muted hover:text-red-400 text-sm">✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
