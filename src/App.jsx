import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './pages/Dashboard';
import PrayerTimes from './pages/PrayerTimes';
import Adhkar from './pages/Adhkar';
import DhikrCounter from './pages/DhikrCounter';
import NamesOfAllah from './pages/NamesOfAllah';
import Qibla from './pages/Qibla';
import Muhasaba from './pages/Muhasaba';
import Settings from './pages/Settings';
import Ramadan from './pages/Ramadan';
import Quran from './pages/Quran';
import Statistics from './pages/Statistics';
import CerclePrivee from './pages/CerclePrivee';
import Zakat from './pages/Zakat';

const PAGES = {
  dashboard: Dashboard, prayers: PrayerTimes, adhkar: Adhkar,
  dhikr: DhikrCounter, names: NamesOfAllah, qibla: Qibla,
  muhasaba: Muhasaba, settings: Settings, ramadan: Ramadan,
  quran: Quran, statistics: Statistics, cercle: CerclePrivee, zakat: Zakat,
};

const BOTTOM_NAV = [
  { id: 'dashboard', label: 'Accueil', icon: '🏠' },
  { id: 'prayers',   label: 'Prières', icon: '🕌' },
  { id: 'adhkar',    label: 'Adhkars', icon: '📿' },
  { id: 'quran',     label: 'Coran',   icon: '📖' },
  { id: 'more',      label: 'Plus',    icon: '☰'  },
];

const MORE_MENU = [
  { id: 'dhikr',      label: 'Dhikr',        icon: '🔢' },
  { id: 'names',      label: '99 Noms',      icon: '✨' },
  { id: 'ramadan',    label: 'Ramadan',      icon: '🌙' },
  { id: 'statistics', label: 'Statistiques', icon: '📊' },
  { id: 'cercle',     label: 'Cercle',       icon: '🤝' },
  { id: 'zakat',      label: 'Zakât',        icon: '💰' },
  { id: 'qibla',      label: 'Qibla',        icon: '🧭' },
  { id: 'muhasaba',   label: 'Muhâsaba',     icon: '🪞' },
  { id: 'settings',   label: 'Paramètres',   icon: '⚙️' },
];

const BACK_PAGES = ['qibla','muhasaba','settings','ramadan','statistics','cercle','zakat'];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [showMore, setShowMore] = useState(false);
  const [location, setLocation] = useLocalStorage('user_location', null);

  const navigate = (id) => { setShowMore(false); setPage(id); };
  const Page = PAGES[page] || Dashboard;
  const currentMore = MORE_MENU.find(m => m.id === page);

  return (
    <div className="geo-bg min-h-screen">
      {BACK_PAGES.includes(page) && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-night/90 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 max-w-md mx-auto">
            <button onClick={() => setPage('dashboard')} className="text-muted text-xl">←</button>
            <p className="text-soft text-sm font-medium">{currentMore?.icon} {currentMore?.label}</p>
          </div>
        </div>
      )}

      <main className={BACK_PAGES.includes(page) ? 'pt-12' : ''}>
        <Page location={location} setLocation={setLocation} onNav={navigate} />
      </main>

      {showMore && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMore(false)}/>
          <div className="relative bg-midnight border-t border-white/10 rounded-t-3xl p-4 pb-8 max-w-md mx-auto w-full">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"/>
            <div className="grid grid-cols-3 gap-3">
              {MORE_MENU.map(item => (
                <button key={item.id} onClick={() => navigate(item.id)} className="card p-3 text-center card-hover">
                  <p className="text-2xl mb-1">{item.icon}</p>
                  <p className="text-xs text-soft">{item.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-midnight/95 backdrop-blur-xl border-t border-white/5 z-40">
        <div className="flex justify-around items-center py-2 max-w-md mx-auto">
          {BOTTOM_NAV.map(item => {
            const isActive = item.id === 'more' ? showMore : page === item.id;
            return (
              <button key={item.id}
                onClick={() => item.id === 'more' ? setShowMore(!showMore) : navigate(item.id)}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${isActive ? 'text-gold' : 'text-muted'}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-0.5">{item.label}</span>
                <div className={`w-1 h-1 rounded-full bg-gold mt-0.5 ${isActive ? 'opacity-100' : 'opacity-0'}`}/>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
