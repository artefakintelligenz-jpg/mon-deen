import { useState, useEffect } from 'react';

const PRAYER_NAMES = {
  Fajr: { fr: 'Fajr', ar: 'الفجر', icon: '🌙' },
  Sunrise: { fr: 'Shurûq', ar: 'الشروق', icon: '🌅' },
  Dhuhr: { fr: 'Dhuhr', ar: 'الظهر', icon: '☀️' },
  Asr: { fr: 'Asr', ar: 'العصر', icon: '🌤️' },
  Maghrib: { fr: 'Maghrib', ar: 'المغرب', icon: '🌇' },
  Isha: { fr: 'Ishâ', ar: 'العشاء', icon: '🌃' },
};

export function usePrayerTimes(lat, lng, method = 2) {
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!lat || !lng) return;
    setLoading(true);

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    fetch(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=${method}`)
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          const t = data.data.timings;
          const result = Object.entries(PRAYER_NAMES).map(([key, info]) => ({
            key,
            ...info,
            time: t[key],
            minutes: timeToMinutes(t[key])
          }));
          setTimes(result);
        }
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [lat, lng, method]);

  useEffect(() => {
    if (!times) return;
    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const prayers = times.filter(p => p.key !== 'Sunrise');
      const next = prayers.find(p => p.minutes > currentMinutes) || prayers[0];
      setNextPrayer(next);

      let diff = next.minutes - currentMinutes;
      if (diff < 0) diff += 1440;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      setCountdown(h > 0 ? `${h}h ${m}min` : `${m} min`);
    }, 1000);
    return () => clearInterval(interval);
  }, [times]);

  return { times, loading, error, nextPrayer, countdown };
}

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export { PRAYER_NAMES };
