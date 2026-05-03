import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 595;
const ZAKAT_RATE = 0.025;

export default function Zakat() {
  const [goldPrice, setGoldPrice] = useLocalStorage('gold_price', 55); // €/g approx
  const [silverPrice, setSilverPrice] = useLocalStorage('silver_price', 0.65);

  const [assets, setAssets] = useLocalStorage('zakat_assets', {
    cash: 0, savings: 0, gold: 0, silver: 0,
    stocks: 0, business: 0, debtsOwed: 0,
  });
  const [debts, setDebts] = useLocalStorage('zakat_debts', 0);
  const [tab, setTab] = useState('calcul');

  const nisabGold = NISAB_GOLD_GRAMS * goldPrice;
  const nisabSilver = NISAB_SILVER_GRAMS * silverPrice;
  const nisab = Math.min(nisabGold, nisabSilver); // use lower (silver) for more obligatory

  const totalAssets =
    Number(assets.cash) + Number(assets.savings) +
    (Number(assets.gold) * goldPrice) +
    (Number(assets.silver) * silverPrice) +
    Number(assets.stocks) + Number(assets.business) + Number(assets.debtsOwed);

  const netWealth = Math.max(0, totalAssets - Number(debts));
  const zakatDue = netWealth >= nisab ? netWealth * ZAKAT_RATE : 0;
  const mustPayZakat = netWealth >= nisab;

  const update = (field, val) => setAssets(prev => ({...prev, [field]: Number(val) || 0}));

  const FIELDS = [
    { key: 'cash', label: 'Argent liquide & comptes courants', icon: '💵' },
    { key: 'savings', label: 'Épargne & livrets', icon: '🏦' },
    { key: 'gold', label: "Or possédé (grammes)", icon: '⚜️', unit: 'g', price: goldPrice },
    { key: 'silver', label: "Argent métal (grammes)", icon: '🥈', unit: 'g', price: silverPrice },
    { key: 'stocks', label: 'Actions & investissements', icon: '📈' },
    { key: 'business', label: 'Marchandises & stocks commerciaux', icon: '🏪' },
    { key: 'debtsOwed', label: "Dettes que l'on te doit", icon: '📋' },
  ];

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-4">
        <h1 className="display text-2xl text-soft font-semibold">Calculateur Zakât</h1>
        <p className="arabic text-lg text-gold">حَاسِبَةُ الزَّكَاة</p>
      </div>

      <div className="flex gap-2 mb-4">
        {[['calcul','💰 Calcul'],['info','📚 Guide']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-xl text-sm transition-all ${tab===id ? 'bg-gold text-night font-semibold' : 'bg-panel text-muted border border-white/5'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'calcul' && (
        <div className="space-y-3">
          {/* Nisab info */}
          <div className="card p-4 bg-jade/5 border-jade/10">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">Nisab actuel (argent)</p>
            <p className="text-2xl font-bold text-jade-light">{nisab.toFixed(0)} euro</p>
            <p className="text-xs text-muted">Basé sur {NISAB_SILVER_GRAMS}g d'argent à {silverPrice}€/g</p>
            <div className="flex gap-2 mt-2">
              <input type="number" value={goldPrice} onChange={e => setGoldPrice(Number(e.target.value))}
                className="flex-1 bg-night border border-white/10 rounded-lg p-1.5 text-xs text-soft text-center focus:outline-none"
                placeholder="Prix or €/g"/>
              <input type="number" value={silverPrice} onChange={e => setSilverPrice(Number(e.target.value))}
                className="flex-1 bg-night border border-white/10 rounded-lg p-1.5 text-xs text-soft text-center focus:outline-none"
                placeholder="Prix argent €/g"/>
            </div>
            <p className="text-xs text-muted mt-1 text-center">Mets à jour les prix actuels</p>
          </div>

          {/* Asset fields */}
          <p className="text-sm text-soft font-medium">Tes avoirs</p>
          {FIELDS.map(f => (
            <div key={f.key} className="card p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-soft flex items-center gap-1"><span>{f.icon}</span>{f.label}</p>
                {f.unit && assets[f.key] > 0 && (
                  <p className="text-xs text-gold">~{(assets[f.key] * f.price).toFixed(0)}euro</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={assets[f.key] || ''}
                  onChange={e => update(f.key, e.target.value)}
                  className="flex-1 bg-night border border-white/10 rounded-lg p-2 text-sm text-soft focus:outline-none focus:border-gold/20"
                  placeholder="0"/>
                <span className="text-xs text-muted w-6">{f.unit || '€'}</span>
              </div>
            </div>
          ))}

          {/* Debts */}
          <div className="card p-3 border-red-500/10">
            <p className="text-xs text-soft mb-1">🔻 Dettes à déduire</p>
            <div className="flex items-center gap-2">
              <input type="number" min="0" value={debts || ''}
                onChange={e => setDebts(Number(e.target.value) || 0)}
                className="flex-1 bg-night border border-white/10 rounded-lg p-2 text-sm text-soft focus:outline-none focus:border-red-500/20"
                placeholder="0"/>
              <span className="text-xs text-muted">€</span>
            </div>
          </div>

          {/* Result */}
          <div className={`card p-5 text-center border-2 ${mustPayZakat ? 'border-gold/40 bg-gold/5' : 'border-jade/30 bg-jade/5'}`}>
            <p className="text-xs text-muted uppercase tracking-widest mb-2">Patrimoine zakatable net</p>
            <p className="text-3xl font-bold text-soft mb-1">{netWealth.toFixed(2)} euro</p>
            <div className="h-px bg-white/5 my-3"/>
            {mustPayZakat ? (
              <>
                <p className="text-xs text-muted mb-1">Zakât due (2,5%)</p>
                <p className="text-4xl font-bold text-gold">{zakatDue.toFixed(2)} euro</p>
                <p className="text-xs text-jade-light mt-2">Tu atteins le Nisab — la Zakât est obligatoire</p>
              </>
            ) : (
              <>
                <p className="text-4xl font-bold text-jade-light">0 euro</p>
                <p className="text-xs text-muted mt-2">Tu n'atteins pas le Nisab ({nisab.toFixed(0)}€)</p>
                <p className="text-xs text-muted">La Zakât n'est pas encore obligatoire</p>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'info' && (
        <div className="space-y-3">
          <div className="card p-4">
            <p className="arabic text-lg text-gold mb-2">وَآتُوا الزَّكَاةَ</p>
            <p className="text-xs text-muted italic">"Acquittez la Zakât" — Al-Baqara 2:43</p>
          </div>
          {[
            { title: 'Le Nisab', content: 'Seuil minimum de richesse pour que la Zakât soit obligatoire. Équivaut à 85g d\'or ou 595g d\'argent. On utilise généralement l\'argent (plus bas) pour être plus sûr.' },
            { title: 'Le Hawl', content: "La Zakât est obligatoire si tu possèdes le Nisab pendant une année lunaire complète (354 jours). Note la date à laquelle tu as atteint le Nisab." },
            { title: 'Le Taux', content: '2,5% du patrimoine net zakatable — soit 1/40ème.' },
            { title: 'Les bénéficiaires', content: 'Pauvres, nécessiteux, personnes endettées, voyageurs en détresse, et dans la voie d\'Allah. Priorité aux membres de la famille dans le besoin.' },
            { title: 'Ce qui est exclu', content: 'Résidence principale, véhicule personnel, meubles et vêtements d\'usage personnel, bijoux portés régulièrement selon certains avis.' },
          ].map((item, i) => (
            <div key={i} className="card p-4">
              <p className="text-soft font-medium text-sm mb-1">{item.title}</p>
              <p className="text-xs text-muted leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
