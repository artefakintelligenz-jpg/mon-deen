import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Settings() {
  const [ikhlas, setIkhlas] = useLocalStorage('ikhlas_mode', false);
  const [city, setCity] = useLocalStorage('city_name', '');
  const [cityInput, setCityInput] = useLocalStorage('city_name', '');
  const [notifications, setNotifications] = useLocalStorage('notifications', true);
  const [vibration, setVibration] = useLocalStorage('vibration', true);

  const clearData = () => {
    if (confirm("Effacer toutes les données de suivi ? (Les données de configuration seront gardées)")) {
      const keys = Object.keys(localStorage).filter(k =>
        k.startsWith('prayers_') || k.startsWith('sunnah_') || k.startsWith('adhkar_') ||
        k.startsWith('dhikr_') || k.startsWith('muhasaba_') || k.startsWith('gratitude_')
      );
      keys.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  const toggle = (setter, current) => setter(!current);

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="display text-2xl text-soft font-semibold">Paramètres</h1>
        <p className="arabic text-lg text-gold">الإِعْدَادَات</p>
      </div>

      {/* Ikhlas Mode */}
      <div className="card p-5 mb-4 border-gold/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span>🤍</span>
              <p className="text-soft font-medium">Mode Ikhlâs</p>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Cache toutes les statistiques et progressions. Focus uniquement sur l'intention et l'acte pur.
            </p>
            {ikhlas && (
              <p className="arabic text-sm text-gold mt-2">إِنَّمَا الْأَعْمَالُ بِالنِّيَّات</p>
            )}
          </div>
          <button
            onClick={() => toggle(setIkhlas, ikhlas)}
            className={`ml-4 w-12 h-6 rounded-full transition-all flex-shrink-0 mt-1 ${
              ikhlas ? 'bg-gold' : 'bg-white/10'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-all mx-0.5 ${
              ikhlas ? 'translate-x-6' : 'translate-x-0'
            }`}/>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-soft text-sm">Rappels de prière</p>
            <p className="text-xs text-muted">Notification avant chaque salat</p>
          </div>
          <button
            onClick={() => toggle(setNotifications, notifications)}
            className={`w-12 h-6 rounded-full transition-all ${notifications ? 'bg-jade' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-all mx-0.5 ${notifications ? 'translate-x-6' : 'translate-x-0'}`}/>
          </button>
        </div>
      </div>

      <div className="card p-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-soft text-sm">Vibration dhikr</p>
            <p className="text-xs text-muted">Retour haptique sur le compteur</p>
          </div>
          <button
            onClick={() => toggle(setVibration, vibration)}
            className={`w-12 h-6 rounded-full transition-all ${vibration ? 'bg-jade' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-all mx-0.5 ${vibration ? 'translate-x-6' : 'translate-x-0'}`}/>
          </button>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="card p-4 mb-4 bg-jade/5 border-jade/20">
        <p className="text-xs text-jade-light font-medium mb-1">🔒 Vie privée totale</p>
        <p className="text-xs text-muted leading-relaxed">
          Toutes tes données sont stockées uniquement sur ton appareil. Aucun serveur, aucun compte, aucune connexion requise.
          L'app fonctionne 100% hors-ligne.
        </p>
      </div>

      {/* About */}
      <div className="card p-4 mb-4">
        <p className="text-sm font-medium text-soft mb-2">À propos</p>
        <p className="text-xs text-muted leading-relaxed">
          "Mon Deen au Quotidien" est un outil spirituel. L'app n'est qu'un moyen — le vrai cœur, c'est ta connexion à Allah sans elle.
        </p>
        <p className="arabic text-sm text-gold text-center mt-3">بِسْمِ اللَّهِ</p>
        <p className="text-xs text-muted text-center">Version 1.0 — Fait avec sincérité</p>
      </div>

      {/* Clear data */}
      <button
        onClick={clearData}
        className="w-full card p-3 text-center border-red-500/10 hover:border-red-500/20 transition-all"
      >
        <p className="text-sm text-red-400/70">Effacer les données de suivi du jour</p>
      </button>

      <div className="mt-6 text-center">
        <p className="arabic text-lg text-gold">رَبَّنَا تَقَبَّلْ مِنَّا</p>
        <p className="text-xs text-muted mt-1">"Notre Seigneur, accepte de nous"</p>
      </div>
    </div>
  );
}
