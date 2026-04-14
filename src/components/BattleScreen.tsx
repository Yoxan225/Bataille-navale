import { useCallback, useEffect, useRef, useState } from 'react';
import { fireAt, allShipsSunk, aiMove, SHIP_DEFS, placeShipsRandomly } from '../logic/gameLogic';
import { Grid as GridType, PlacedShip } from '../types/game';
import Grid from './Grid';
import { SHIP_ICONS } from './ShipIcons';

interface Props {
  playerGrid: GridType;
  playerPlaced: PlacedShip[];
  onVictory: () => void;
  onDefeat: () => void;
}

interface LogEntry { text: string; type: 'hit' | 'miss' | 'info' }

export default function BattleScreen({ playerGrid: initialPlayerGrid, playerPlaced, onVictory, onDefeat }: Props) {
  const [playerGrid, setPlayerGrid] = useState<GridType>(initialPlayerGrid);
  const [enemyGrid, setEnemyGrid] = useState<GridType>(() => placeShipsRandomly(SHIP_DEFS).grid);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [log, setLog] = useState<LogEntry[]>([{ text: 'La bataille commence ! À vous de tirer.', type: 'info' }]);
  const [lastHit, setLastHit] = useState<[number, number] | null>(null);
  const [firing, setFiring] = useState(false);
  const aiTried = useRef<Set<string>>(new Set());
  const aiHitStack = useRef<[number, number][]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  function addLog(text: string, type: LogEntry['type']) {
    setLog(prev => [...prev.slice(-30), { text, type }]);
  }

  const doAiTurn = useCallback((currentPlayerGrid: GridType) => {
    setFiring(true);
    setTimeout(() => {
      const [r, c] = aiMove(currentPlayerGrid, aiHitStack.current, aiTried.current);
      aiTried.current.add(`${r},${c}`);
      const { grid: nextGrid, result } = fireAt(currentPlayerGrid, r, c);
      setPlayerGrid(nextGrid);

      if (result === 'hit') {
        aiHitStack.current.push([r, c]);
        addLog(`L'ennemi touche votre navire en ${r + 1}${String.fromCharCode(65 + c)} !`, 'hit');
        if (allShipsSunk(nextGrid)) { onDefeat(); return; }
      } else {
        aiHitStack.current = aiHitStack.current.filter(([hr, hc]) => !(hr === r && hc === c));
        addLog(`L'ennemi tire dans l'eau en ${r + 1}${String.fromCharCode(65 + c)}.`, 'miss');
      }
      setIsPlayerTurn(true);
      setFiring(false);
    }, 900);
  }, [onDefeat]);

  function handleEnemyCellClick(row: number, col: number) {
    if (!isPlayerTurn || firing) return;
    const cell = enemyGrid[row][col];
    if (cell.kind === 'hit' || cell.kind === 'miss') return;

    setFiring(true);
    setLastHit([row, col]);
    const { grid: nextGrid, result } = fireAt(enemyGrid, row, col);
    setEnemyGrid(nextGrid);

    if (result === 'hit') {
      addLog(`Touché en ${row + 1}${String.fromCharCode(65 + col)} !`, 'hit');
      if (allShipsSunk(nextGrid)) { onVictory(); return; }
    } else {
      addLog(`À l'eau en ${row + 1}${String.fromCharCode(65 + col)}.`, 'miss');
    }
    setIsPlayerTurn(false);
    doAiTurn(playerGrid);
  }

  function countShipSunk(grid: GridType, shipId: string) {
    for (let r = 0; r < grid.length; r++)
      for (let c = 0; c < grid[r].length; c++)
        if (grid[r][c].kind === 'ship' && (grid[r][c] as { shipId: string }).shipId === shipId) return false;
    return true;
  }

  return (
    <div className="min-h-screen bg-[#050e1a] flex flex-col items-center py-4 px-3">
      <div className="mb-4 text-center">
        <h1 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase">⚓ Bataille Navale</h1>
        <div className={`mt-1 text-sm font-bold tracking-widest transition-colors ${
          firing && !isPlayerTurn ? 'text-rose-400' : isPlayerTurn ? 'text-cyan-400' : 'text-rose-400'
        }`}>
          {firing && !isPlayerTurn ? '— L\'ennemi réfléchit... —'
            : isPlayerTurn ? '— Votre tour : cliquez sur la zone ennemie —'
            : '— En attente —'}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start justify-center w-full max-w-6xl">
        <Grid
          grid={playerGrid}
          showShips
          interactive={false}
          label="Votre flotte"
          labelColor="#22d3ee"
        />

        <div className="flex flex-col gap-4 min-w-[200px] xl:min-w-[220px] w-full xl:w-auto">
          <div className="bg-slate-900/60 border border-slate-700 rounded p-3">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Statut des flottes</h3>
            {SHIP_DEFS.map(def => {
              const Icon = SHIP_ICONS[def.id];
              const enemySunk = countShipSunk(enemyGrid, def.id);
              const playerSunk = countShipSunk(playerGrid, def.id);
              return (
                <div key={def.id} className="flex items-center gap-2 py-1.5 border-b border-slate-800 last:border-0">
                  <div className="w-8 flex-shrink-0">
                    <Icon color={def.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-300 font-medium truncate">{def.name}</div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className={`font-mono ${enemySunk ? 'text-green-400' : 'text-slate-500'}`} title="Ennemi">E</span>
                    <span className={`font-mono ${playerSunk ? 'text-red-400' : 'text-slate-500'}`} title="Vous">V</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-900/60 border border-slate-700 rounded p-3">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Journal de combat</h3>
            <div ref={logRef} className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
              {log.map((entry, i) => (
                <div key={i} className={`text-xs font-mono leading-tight ${
                  entry.type === 'hit' ? 'text-red-400'
                  : entry.type === 'miss' ? 'text-blue-400'
                  : 'text-slate-400'
                }`}>
                  {entry.text}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-sm bg-red-900/80 border border-red-700 flex items-center justify-center text-red-400 text-[10px] font-bold">✕</div>
              <span>Touché</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-sm bg-[#0e2a45] border border-[#1a4a6b] flex items-center justify-center text-cyan-400 text-[10px]">○</div>
              <span>Raté</span>
            </div>
          </div>
        </div>

        <Grid
          grid={enemyGrid}
          showShips={false}
          interactive={isPlayerTurn && !firing}
          onCellClick={handleEnemyCellClick}
          label="Zone ennemie"
          labelColor="#fb7185"
        />
      </div>
    </div>
  );
}
