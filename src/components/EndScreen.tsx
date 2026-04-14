git import { useEffect, useRef } from 'react';
import { Anchor } from 'lucide-react';

interface Props {
  won: boolean;
  onReplay: () => void;
}

interface Particle { x: number; y: number; dx: number; dy: number; r: number; color: string; alpha: number }

const VICTORY_COLORS = ['#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#ffffff'];
const DEFEAT_COLORS  = ['#4b5563', '#6b7280', '#374151', '#1f2937'];

export default function EndScreen({ won, onReplay }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const colors = won ? VICTORY_COLORS : DEFEAT_COLORS;
    particles.current = Array.from({ length: won ? 120 : 60 }, () => ({
      x: Math.random() * W,
      y: won ? H * 0.3 + Math.random() * H * 0.3 : Math.random() * H,
      dx: (Math.random() - 0.5) * (won ? 3 : 0.5),
      dy: won ? -Math.random() * 4 - 1 : Math.random() * 0.5,
      r: Math.random() * (won ? 5 : 3) + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.4,
    }));

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles.current) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (won) p.dy += 0.05;
        p.alpha -= 0.003;
        if (p.alpha <= 0 || p.y > H + 20) {
          p.x = Math.random() * W;
          p.y = won ? H * 0.4 : Math.random() * H;
          p.dy = won ? -Math.random() * 4 - 1 : Math.random() * 0.5;
          p.dx = (Math.random() - 0.5) * (won ? 3 : 0.5);
          p.alpha = Math.random() * 0.6 + 0.4;
        }
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [won]);

  return (
    <div className="relative min-h-screen bg-[#050e1a] flex flex-col items-center justify-center px-6 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-4">
          <Anchor className={`w-12 h-12 ${won ? 'text-cyan-400' : 'text-slate-600'}`} />
          <h1
            className={`text-5xl md:text-7xl font-black tracking-widest uppercase ${
              won
                ? 'text-cyan-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.8)]'
                : 'text-slate-500 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]'
            }`}
          >
            {won ? 'VICTOIRE' : 'DÉFAITE'}
          </h1>
          <Anchor className={`w-12 h-12 ${won ? 'text-cyan-400' : 'text-slate-600'}`} />
        </div>

        <p className={`text-lg md:text-2xl font-semibold ${won ? 'text-green-400' : 'text-slate-400'}`}>
          {won
            ? 'Vous avez coulé toute la flotte ennemie !'
            : 'Votre flotte a été anéantie...'}
        </p>

        <p className={`text-base ${won ? 'text-slate-300' : 'text-slate-600'}`}>
          {won
            ? 'Brillante stratégie, amiral !'
            : 'L\'ennemi a eu raison de vous cette fois.'}
        </p>

        <div className="flex gap-4 mt-4">
          <button
            onClick={onReplay}
            className={`
              px-8 py-3.5 font-bold text-lg tracking-widest uppercase rounded transition-all duration-200
              hover:scale-105 active:scale-95 cursor-pointer
              ${won
                ? 'bg-cyan-400 hover:bg-cyan-300 text-[#050e1a] shadow-[0_0_24px_rgba(34,211,238,0.5)]'
                : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-500'}
            `}
          >
            {won ? '↺ Rejouer' : '⚔ Revanche'}
          </button>
        </div>
      </div>
    </div>
  );
}
