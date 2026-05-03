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

const NAV = [
  { id: 'dashboard',  label: 'Accueil',  icon: '🏠' },
  { id: 'prayers',    label: 'Prières',  icon: '🕌' },
  { id: 'adhkar',     label: 'Adhkars',  icon: '📿' },
  { id: 'quran',      label: 'Coran',    icon: '📖' },
  { id: 'dhikr',      label: 'Dhikr',    icon: '🔢' },
  { id: 'names',      label: '99 Noms',  icon: '✨' },
  { id: 'ramadan',    label: 'Ramadan',  icon: '🌙' },
  { id: 'statistics', label: 'Stats',    icon: '📊' },
  { id: 'cercle',     label: 'Cercle',   icon: '🤝' },
  { id: 'zakat',      label: 'Zakât',    icon: '💰' },
  { id: 'qibla',      label: 'Qibla',    icon: '🧭' },
  { id: 'muhasaba',   label: 'Bilan',    icon: '🪞' },
  { id: 'settings',   label: 'Réglages', icon: '⚙️' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [location, setLocation] = useLocalStorage('user_location', null);
  const Page = PAGES[page] || Dashboard;

  return (
    <div className="geo-bg min-h-screen flex flex-col">
      {/* Page content */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: '72px' }}>
        <Page location={location} setLocation={setLocation} onNav={setPage} />
      </main>

      {/* Bottom nav — scrollable single row */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-midnight/98 backdrop-blur-xl border-t border-white/5"
        style={{ height: '64px' }}
      >
        <div
          className="flex items-center h-full px-1 gap-0.5 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {NAV.map(item => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className="flex flex-col items-center justify-center flex-shrink-0 rounded-xl transition-all px-2 py-1"
                style={{
                  minWidth: '52px',
                  height: '52px',
                  background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                  border: active ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: '9px',
                    marginTop: '2px',
                    color: active ? '#c9a84c' : '#8892a4',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Jost, sans-serif',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>
                {active && (
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#c9a84c', marginTop: '1px' }}/>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
