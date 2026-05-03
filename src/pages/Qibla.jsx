import { useState, useEffect } from 'react';

export default function Qibla({ location }) {
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [compassAngle, setCompassAngle] = useState(0);
  const [permission, setPermission] = useState('unknown');

  // Kaaba coordinates
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  useEffect(() => {
    if (!location) return;
    const { lat, lng } = location;
    const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
    const lat1 = (lat * Math.PI) / 180;
    const lat2 = (KAABA_LAT * Math.PI) / 180;
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    setQiblaAngle((brng + 360) % 360);
  }, [location]);

  useEffect(() => {
    const handleOrientation = (e) => {
      let alpha = e.webkitCompassHeading ?? e.alpha;
      if (alpha !== null && alpha !== undefined) {
        setCompassAngle(alpha);
      }
    };

    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        try {
          const res = await DeviceOrientationEvent.requestPermission();
          setPermission(res);
          if (res === 'granted') {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        } catch {
          setPermission('denied');
        }
      } else {
        setPermission('granted');
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };

    requestPermission();
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const needleAngle = qiblaAngle !== null ? qiblaAngle - compassAngle : null;

  return (
    <div className="fade-in pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="display text-2xl text-soft font-semibold">Direction de la Qibla</h1>
        <p className="arabic text-lg text-gold">اتِّجَاهُ الْقِبْلَة</p>
      </div>

      {!location ? (
        <div className="card p-6 text-center">
          <p className="text-4xl mb-3">📍</p>
          <p className="text-soft text-sm mb-1">Localisation nécessaire</p>
          <p className="text-muted text-xs">Active ta localisation dans l'onglet "Prières"</p>
        </div>
      ) : (
        <>
          {/* Compass */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-64 h-64">
              {/* Compass rose */}
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Outer ring */}
                <circle cx="100" cy="100" r="95" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.3"/>
                <circle cx="100" cy="100" r="85" fill="#161b26" stroke="#1e2736" strokeWidth="1"/>

                {/* Degree marks */}
                {Array.from({ length: 72 }, (_, i) => {
                  const angle = (i * 5 * Math.PI) / 180;
                  const isMajor = i % 9 === 0;
                  const r1 = isMajor ? 75 : 79;
                  const r2 = 84;
                  return (
                    <line
                      key={i}
                      x1={100 + r1 * Math.sin(angle)} y1={100 - r1 * Math.cos(angle)}
                      x2={100 + r2 * Math.sin(angle)} y2={100 - r2 * Math.cos(angle)}
                      stroke="#c9a84c" strokeWidth={isMajor ? 1.5 : 0.5} opacity={isMajor ? 0.6 : 0.2}
                    />
                  );
                })}

                {/* Cardinal labels */}
                <text x="100" y="18" textAnchor="middle" fill="#c9a84c" fontSize="12" fontWeight="bold" opacity="0.8">N</text>
                <text x="100" y="188" textAnchor="middle" fill="#8892a4" fontSize="10">S</text>
                <text x="186" y="104" textAnchor="middle" fill="#8892a4" fontSize="10">E</text>
                <text x="14" y="104" textAnchor="middle" fill="#8892a4" fontSize="10">O</text>

                {/* Inner glow */}
                <circle cx="100" cy="100" r="50" fill="#0d1117" stroke="#1e2736" strokeWidth="1"/>

                {/* Qibla needle */}
                {needleAngle !== null && (
                  <g transform={`rotate(${needleAngle}, 100, 100)`} style={{ transition: 'transform 0.3s ease' }}>
                    {/* Kaaba symbol at tip */}
                    <polygon points="100,20 96,100 100,95 104,100" fill="#c9a84c" opacity="0.9"/>
                    <polygon points="100,180 96,100 100,105 104,100" fill="#444" opacity="0.5"/>
                    <circle cx="100" cy="100" r="5" fill="#c9a84c"/>
                    {/* Kaaba icon at tip */}
                    <rect x="93" y="11" width="14" height="14" rx="2" fill="#c9a84c"/>
                    <line x1="93" y1="15" x2="107" y2="15" stroke="#0d1117" strokeWidth="1"/>
                    <line x1="100" y1="11" x2="100" y2="25" stroke="#0d1117" strokeWidth="1"/>
                  </g>
                )}

                {/* Center dot */}
                <circle cx="100" cy="100" r="3" fill="#c9a84c"/>
              </svg>
            </div>

            {qiblaAngle !== null && (
              <div className="text-center mt-3">
                <p className="text-2xl font-bold text-gold">{Math.round(qiblaAngle)}°</p>
                <p className="text-sm text-muted">Direction de la Mecque</p>
                <p className="text-xs text-muted mt-1">
                  Lat: {location.lat.toFixed(4)}° · Lng: {location.lng.toFixed(4)}°
                </p>
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="card p-4 text-center">
            <p className="arabic text-xl text-gold mb-2">فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ</p>
            <p className="text-xs text-muted italic">"Tourne ton visage vers la Mosquée Sacrée" — Al-Baqara 2:144</p>
          </div>

          {permission === 'denied' && (
            <div className="card mt-3 p-3 border-yellow-500/20 bg-yellow-500/5">
              <p className="text-xs text-yellow-400">⚠️ Autorise l'accès à l'orientation pour la boussole dynamique</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
