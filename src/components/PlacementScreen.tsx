import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { SHIP_DEFS, createEmptyGrid, canPlace, placeShip } from '../logic/gameLogic';
import { Grid as GridType, Orientation, PlacedShip, ShipDef } from '../types/game';
import Grid from './Grid';
import { SHIP_ICONS } from './ShipIcons';

interface Props {
  onReady: (grid: GridType, placed: PlacedShip[]) => void;
}

export default function PlacementScreen({ onReady }: Props) {
  const [grid, setGrid] = useState<GridType>(createEmptyGrid);
  const [placed, setPlaced] = useState<PlacedShip[]>([]);
  const [remaining, setRemaining] = useState<ShipDef[]>([...SHIP_DEFS]);
  const [selected, setSelected] = useState<ShipDef>(SHIP_DEFS[0]);
  const [orientation, setOrientation] = useState<Orientation>('h');

  const done = remaining.length === 0;

  function handleCell(row: number, col: number) {
    if (!selected || done) return;
    if (!canPlace(grid, selected, row, col, orientation)) return;
    const nextGrid = placeShip(grid, selected, row, col, orientation);
    const nextPlaced = [...placed, { def: selected, row, col, orientation }];
    const nextRemaining = remaining.filter(s => s.id !== selected.id);
    setGrid(nextGrid);
    setPlaced(nextPlaced);
    setRemaining(nextRemaining);
    setSelected(nextRemaining[0] ?? null!);
  }

  function handleReset() {
    setGrid(createEmptyGrid());
    setPlaced([]);
    setRemaining([...SHIP_DEFS]);
    setSelected(SHIP_DEFS[0]);
  }

  return (
    <div className="min-h-screen bg-[#050e1a] flex flex-col items-center py-6 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase">
          ⚓ Positionnez votre flotte
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          {done
            ? 'Flotte en position — prêt au combat !'
            : `Placez : ${selected?.name} (${selected?.size} cases)`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-5xl">
        <div className="flex flex-col items-center gap-4">
          <Grid
            grid={grid}
            showShips
            interactive={!done}
            onCellClick={handleCell}
            previewShip={done ? null : selected}
            previewOrientation={orientation}
            label="Votre flotte"
            labelColor="#22d3ee"
          />

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setOrientation(o => o === 'h' ? 'v' : 'h')}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-600 rounded text-sm font-bold tracking-wide transition-colors cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              {orientation === 'h' ? 'Horizontale' : 'Verticale'}
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-600 rounded text-sm font-bold tracking-wide transition-colors cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[220px]">
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Navires à placer</h3>
          {SHIP_DEFS.map(def => {
            const isPlaced = !remaining.find(r => r.id === def.id);
            const isActive = selected?.id === def.id && !done;
            const Icon = SHIP_ICONS[def.id];
            return (
              <div
                key={def.id}
                onClick={() => !isPlaced && setSelected(def)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded border transition-all duration-200
                  ${isPlaced
                    ? 'opacity-35 border-slate-700 bg-slate-800/30 cursor-default'
                    : isActive
                      ? 'border-cyan-400 bg-cyan-400/10 cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 cursor-pointer'}
                `}
              >
                <div className="w-12 flex-shrink-0">
                  <Icon color={isPlaced ? '#4b5563' : def.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{def.name}</div>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: def.size }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: isPlaced ? '#374151' : def.color + '88' }}
                      />
                    ))}
                  </div>
                </div>
                {isPlaced && (
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            );
          })}

          {done && (
            <button
              onClick={() => onReady(grid, placed)}
              className="mt-4 w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-[#050e1a] font-black text-lg tracking-widest uppercase rounded transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            >
              ⚔ LANCER LA BATAILLE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
