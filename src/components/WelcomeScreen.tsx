import { useEffect, useState } from 'react';
import { Anchor } from 'lucide-react';
import { CarrierIcon, SubmarineIcon } from './ShipIcons';

interface Props { onStart: () => void }

export default function WelcomeScreen({ onStart }: Props) {
  const [ready, setReady] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => setPulse(p => !p), 600);
    return () => clearInterval(interval);
  }, [ready]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050e1a] flex flex-col items-center justify-center select-none">
      <div className="absolute inset-0 pointer-events-none">
        <div className="wave wave1" />
        <div className="wave wave2" />
        <div className="wave wave3" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <div className="flex items-center gap-4 mb-2">
          <Anchor className="w-10 h-10 text-cyan-400 animate-spin-slow" />
          <h1 className="text-5xl md:text-7xl font-black tracking-widest text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]">
            BATAILLE<br className="md:hidden" /> <span className="text-cyan-400">NAVALE</span>
          </h1>
          <Anchor className="w-10 h-10 text-cyan-400 animate-spin-slow-reverse" />
        </div>

        <p className="text-slate-400 text-lg md:text-xl italic tracking-wide">
          Préparez-vous au combat naval
        </p>

        <div className="flex items-center gap-10 my-4 opacity-60">
          <div className="w-32">
            <CarrierIcon color="#38bdf8" />
          </div>
          <div className="w-16 opacity-40">
            <SubmarineIcon color="#818cf8" />
          </div>
        </div>

        {!ready ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {[0,1,2].map(i => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-cyan-400"
                  style={{ animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
            <span className="text-slate-500 text-sm tracking-widest uppercase">Chargement des navires...</span>
          </div>
        ) : (
          <button
            onClick={onStart}
            className={`
              relative mt-4 px-10 py-4 text-xl font-bold tracking-widest uppercase rounded-sm
              bg-cyan-400 text-[#050e1a] border-2 border-cyan-300
              transition-all duration-300 cursor-pointer overflow-hidden
              hover:bg-cyan-300 hover:scale-105 active:scale-95
              ${pulse ? 'shadow-[0_0_30px_rgba(34,211,238,0.7)]' : 'shadow-[0_0_12px_rgba(34,211,238,0.3)]'}
            `}
          >
            <span className="relative z-10">⚔ COMMENCER LA BATAILLE</span>
          </button>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8 opacity-20 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-cyan-400"
            style={{ animation: `float ${2 + i * 0.3}s ease-in-out ${i * 0.5}s infinite alternate` }}
          />
        ))}
      </div>

      <style>{`
        .wave {
          position: absolute;
          bottom: 0;
          left: -50%;
          width: 200%;
          height: 180px;
          border-radius: 43%;
          opacity: 0.15;
          animation: waveAnim linear infinite;
        }
        .wave1 { background: #0ea5e9; animation-duration: 8s; }
        .wave2 { background: #0284c7; animation-duration: 11s; animation-delay: -3s; opacity: 0.1; }
        .wave3 { background: #075985; animation-duration: 14s; animation-delay: -6s; opacity: 0.08; }
        @keyframes waveAnim {
          0% { transform: translateX(0) rotate(0deg); }
          100% { transform: translateX(25%) rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-12px); }
        }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 8s linear infinite reverse; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
