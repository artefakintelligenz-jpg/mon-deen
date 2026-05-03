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
    <div className="geo-bg min-h-screen" style={{ display: 'flex', justifyContent: 'center' }}>
      {/* Phone frame centered on desktop */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 60px rgba(0,0,0,0.6)',
        background: '#0d1117',
      }}>
        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '72px' }}>
          <Page location={location} setLocation={setLocation} onNav={setPage} />
        </main>

        {/* Bottom nav */}
        <nav style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          maxWidth: '480px',
          height: '64px',
          background: 'rgba(22,27,38,0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: '0 4px',
            gap: '2px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            width: '100%',
          }}>
            {NAV.map(item => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    minWidth: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    padding: '4px 6px',
                    background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                    border: active ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.icon}</span>
                  <span style={{
                    fontSize: '9px',
                    marginTop: '2px',
                    color: active ? '#c9a84c' : '#8892a4',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Jost, sans-serif',
                    fontWeight: active ? 600 : 400,
                  }}>
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
    </div>
  );
}
