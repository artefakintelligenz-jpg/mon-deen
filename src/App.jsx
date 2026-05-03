import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import BottomNav, { EXTRA_NAV } from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import PrayerTimes from './pages/PrayerTimes';
import Adhkar from './pages/Adhkar';
import DhikrCounter from './pages/DhikrCounter';
import NamesOfAllah from './pages/NamesOfAllah';
import Qibla from './pages/Qibla';
import Muhasaba from './pages/Muhasaba';
import Settings from './pages/Settings';

const ALL_PAGES = {
  dashboard: Dashboard,
  prayers: PrayerTimes,
  adhkar: Adhkar,
  dhikr: DhikrCounter,
  names: NamesOfAllah,
  qibla: Qibla,
  muhasaba: Muhasaba,
  settings: Settings,
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [location, setLocation] = useLocalStorage('user_location', null);

  const Page = ALL_PAGES[page] || Dashboard;

  const extraItems = [...EXTRA_NAV, { id: 'settings', label: 'Paramètres', icon: '⚙️' }];

  return (
    <div className="geo-bg min-h-screen">
      {/* Extra nav items accessible via icons in dashboard */}
      {/* Page header for extra pages */}
      {(page === 'qibla' || page === 'muhasaba' || page === 'settings') && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-night/80 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 max-w-md mx-auto">
            <button onClick={() => setPage('dashboard')} className="text-muted text-sm">←</button>
            <p className="text-soft text-sm font-medium capitalize">{page}</p>
          </div>
        </div>
      )}

      <main className={page === 'qibla' || page === 'muhasaba' || page === 'settings' ? 'pt-12' : ''}>
        <Page
          location={location}
          setLocation={setLocation}
          onNav={setPage}
        />
      </main>

      <BottomNav current={page} onNav={setPage} />
    </div>
  );
}
