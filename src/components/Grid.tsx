import { useState } from 'react';
import { COL_LABELS, ROW_LABELS, GRID_SIZE, canPlace } from '../logic/gameLogic';
import { Grid as GridType, ShipDef, Orientation } from '../types/game';
import { SHIP_ICONS } from './ShipIcons';
import { SHIP_DEFS } from '../logic/gameLogic';

interface GridProps {
  grid: GridType;
  showShips: boolean;
  interactive: boolean;
  onCellClick?: (row: number, col: number) => void;
  previewShip?: ShipDef | null;
  previewOrientation?: Orientation;
  label: string;
  labelColor: string;
}

export default function Grid({
  grid,
  showShips,
  interactive,
  onCellClick,
  previewShip,
  previewOrientation = 'h',
  label,
  labelColor,
}: GridProps) {
  const [hoverCell, setHoverCell] = useState<[number, number] | null>(null);

  const previewCells = new Set<string>();
  let previewValid = false;
  if (previewShip && hoverCell) {
    const [hr, hc] = hoverCell;
    previewValid = canPlace(grid, previewShip, hr, hc, previewOrientation);
    for (let i = 0; i < previewShip.size; i++) {
      const r = previewOrientation === 'h' ? hr : hr + i;
      const c = previewOrientation === 'h' ? hc + i : hc;
      if (r < GRID_SIZE && c < GRID_SIZE) previewCells.add(`${r},${c}`);
    }
  }

  function getShipDef(shipId: string) {
    return SHIP_DEFS.find(d => d.id === shipId)!;
  }

  function renderCell(row: number, col: number) {
    const cell = grid[row][col];
    const key = `${row},${col}`;
    const isPreview = previewCells.has(key);

    let bg = 'bg-[#0a1f35] border-[#0d2a46]';
    let content: React.ReactNode = null;
    let extra = '';

    if (cell.kind === 'hit') {
      bg = 'bg-red-900/80 border-red-700';
      content = (
        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="none">
          <line x1="4" y1="4" x2="20" y2="20" stroke="#ff4444" strokeWidth="3" strokeLinecap="round"/>
          <line x1="20" y1="4" x2="4" y2="20" stroke="#ff4444" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      );
    } else if (cell.kind === 'miss') {
      bg = 'bg-[#0e2a45] border-[#1a4a6b]';
      content = (
        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="none">
          <circle cx="12" cy="12" r="5" stroke="#38bdf8" strokeWidth="2.5" fill="none" opacity="0.7"/>
        </svg>
      );
    } else if (cell.kind === 'ship' && showShips) {
      const def = getShipDef(cell.shipId);
      const isFirst = cell.segIndex === 0;
      const isLast = cell.segIndex === cell.segCount - 1;
      const isCenter = cell.segIndex === Math.floor(cell.segCount / 2);
      const isH = cell.orientation === 'h';

      const capL = isH ? (isFirst ? 'rounded-l-md' : '') : (isFirst ? 'rounded-t-md' : '');
      const capR = isH ? (isLast  ? 'rounded-r-md' : '') : (isLast  ? 'rounded-b-md' : '');
      extra = `${capL} ${capR}`;

      const Icon = SHIP_ICONS[cell.shipId];
      content = isCenter && Icon ? (
        <div className="absolute inset-0 flex items-center justify-center p-0.5 pointer-events-none">
          <Icon color={def.color} className="w-full h-full opacity-90" />
        </div>
      ) : null;

      bg = '';
      return (
        <div
          key={key}
          className={`
            relative border cursor-default
            ${isH ? 'border-y' : 'border-x'}
            ${extra}
            transition-all duration-150
          `}
          style={{ backgroundColor: def.color + '33', borderColor: def.color + '88' }}
        >
          {content}
        </div>
      );
    } else if (cell.kind === 'ship' && !showShips) {
      bg = 'bg-[#0a1f35] border-[#0d2a46]';
    }

    if (isPreview) {
      bg = previewValid ? 'bg-cyan-500/25 border-cyan-400' : 'bg-red-500/25 border-red-400';
    }

    const clickable = interactive && cell.kind !== 'hit' && cell.kind !== 'miss' && !isPreview;
    const hoverStyle = interactive && !previewShip && cell.kind !== 'hit' && cell.kind !== 'miss'
      ? 'hover:bg-cyan-500/15 hover:border-cyan-400 cursor-crosshair'
      : '';

    return (
      <div
        key={key}
        className={`
          relative border flex items-center justify-center
          transition-all duration-150
          ${bg} ${hoverStyle}
          ${clickable && !previewShip ? 'cursor-crosshair' : ''}
          ${previewShip ? 'cursor-pointer' : ''}
        `}
        onClick={() => onCellClick?.(row, col)}
        onMouseEnter={() => setHoverCell([row, col])}
        onMouseLeave={() => setHoverCell(null)}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-sm md:text-base font-bold tracking-widest uppercase mb-1" style={{ color: labelColor }}>
        {label}
      </h2>

      <div className="flex">
        <div className="w-6 md:w-7 flex flex-col justify-around items-center mr-1">
          {ROW_LABELS.map(r => (
            <span key={r} className="text-[10px] md:text-xs text-slate-500 font-mono leading-none">
              {r}
            </span>
          ))}
        </div>

        <div>
          <div className="flex mb-0.5">
            {COL_LABELS.map(c => (
              <span
                key={c}
                className="text-[10px] md:text-xs text-slate-500 font-mono text-center leading-none"
                style={{ width: 'clamp(28px, 4.5vw, 48px)' }}
              >
                {c}
              </span>
            ))}
          </div>

          <div
            className="grid border-2 border-slate-700/50 rounded overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, clamp(28px, 4.5vw, 48px))`,
              gridTemplateRows:    `repeat(${GRID_SIZE}, clamp(28px, 4.5vw, 48px))`,
            }}
          >
            {Array.from({ length: GRID_SIZE }, (_, r) =>
              Array.from({ length: GRID_SIZE }, (_, c) => renderCell(r, c))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
