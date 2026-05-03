const NAV_ITEMS = [
  { id: 'dashboard', label: 'Accueil', icon: '🏠' },
  { id: 'prayers', label: 'Prières', icon: '🕌' },
  { id: 'adhkar', label: 'Adhkars', icon: '📿' },
  { id: 'dhikr', label: 'Dhikr', icon: '🔢' },
  { id: 'names', label: 'Noms', icon: '✨' },
];

export default function BottomNav({ current, onNav }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-midnight/95 backdrop-blur-xl border-t border-white/5 safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`nav-item flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              current === item.id ? 'active' : 'text-muted'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-0.5">{item.label}</span>
            <div className={`nav-dot w-1 h-1 rounded-full bg-gold mt-0.5 ${current === item.id ? 'opacity-100' : 'opacity-0'}`}/>
          </button>
        ))}
      </div>
    </nav>
  );
}

export const EXTRA_NAV = [
  { id: 'qibla', label: 'Qibla', icon: '🧭' },
  { id: 'muhasaba', label: 'Muhâsaba', icon: '📊' },
  { id: 'settings', label: 'Paramètres', icon: '⚙️' },
];
