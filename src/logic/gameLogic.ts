import { CellValue, Grid, Orientation, PlacedShip, ShipDef } from '../types/game';

export const SHIP_DEFS: ShipDef[] = [
  { id: 'carrier',    name: 'Porte-avions',        size: 5, color: '#0ea5e9', abbr: 'CV' },
  { id: 'cruiser',    name: 'Croiseur',             size: 4, color: '#10b981', abbr: 'CA' },
  { id: 'destroyer',  name: 'Contre-torpilleur',    size: 3, color: '#f59e0b', abbr: 'DD' },
  { id: 'submarine',  name: 'Sous-marin',           size: 3, color: '#8b5cf6', abbr: 'SS' },
  { id: 'patrol',     name: 'Torpilleur',           size: 2, color: '#ef4444', abbr: 'PT' },
];

export const GRID_SIZE = 10;

export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ kind: 'empty' } as CellValue))
  );
}

export function canPlace(grid: Grid, ship: ShipDef, row: number, col: number, orientation: Orientation): boolean {
  for (let i = 0; i < ship.size; i++) {
    const r = orientation === 'h' ? row : row + i;
    const c = orientation === 'h' ? col + i : col;
    if (r >= GRID_SIZE || c >= GRID_SIZE || r < 0 || c < 0) return false;
    if (grid[r][c].kind === 'ship') return false;
  }
  return true;
}

export function placeShip(grid: Grid, ship: ShipDef, row: number, col: number, orientation: Orientation): Grid {
  const next = grid.map(r => r.map(c => ({ ...c })));
  for (let i = 0; i < ship.size; i++) {
    const r = orientation === 'h' ? row : row + i;
    const c = orientation === 'h' ? col + i : col;
    next[r][c] = { kind: 'ship', shipId: ship.id, segIndex: i, segCount: ship.size, orientation };
  }
  return next;
}

export function fireAt(grid: Grid, row: number, col: number): { grid: Grid; result: 'hit' | 'miss' | 'already' } {
  const cell = grid[row][col];
  if (cell.kind === 'hit' || cell.kind === 'miss') return { grid, result: 'already' };
  const next = grid.map(r => r.map(c => ({ ...c })));
  if (cell.kind === 'ship') {
    next[row][col] = { kind: 'hit' };
    return { grid: next, result: 'hit' };
  }
  next[row][col] = { kind: 'miss' };
  return { grid: next, result: 'miss' };
}

export function isShipSunk(grid: Grid, shipId: string): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = grid[r][c];
      if (cell.kind === 'ship' && cell.shipId === shipId) return false;
    }
  }
  return true;
}

export function allShipsSunk(grid: Grid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].kind === 'ship') return false;
    }
  }
  return true;
}

export function placeShipsRandomly(defs: ShipDef[]): { grid: Grid; placed: PlacedShip[] } {
  let grid = createEmptyGrid();
  const placed: PlacedShip[] = [];
  for (const def of defs) {
    let ok = false;
    while (!ok) {
      const orientation: Orientation = Math.random() < 0.5 ? 'h' : 'v';
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      if (canPlace(grid, def, row, col, orientation)) {
        grid = placeShip(grid, def, row, col, orientation);
        placed.push({ def, row, col, orientation });
        ok = true;
      }
    }
  }
  return { grid, placed };
}

export function aiMove(grid: Grid, hitStack: [number, number][], tried: Set<string>): [number, number] {
  if (hitStack.length > 0) {
    const [hr, hc] = hitStack[hitStack.length - 1];
    const neighbors: [number, number][] = [
      [hr - 1, hc], [hr + 1, hc], [hr, hc - 1], [hr, hc + 1]
    ];
    for (const [r, c] of neighbors) {
      const key = `${r},${c}`;
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && !tried.has(key)) {
        return [r, c];
      }
    }
  }
  let r: number, c: number, key: string;
  do {
    r = Math.floor(Math.random() * GRID_SIZE);
    c = Math.floor(Math.random() * GRID_SIZE);
    key = `${r},${c}`;
  } while (tried.has(key));
  return [r, c];
}

export const COL_LABELS = ['A','B','C','D','E','F','G','H','I','J'];
export const ROW_LABELS = ['1','2','3','4','5','6','7','8','9','10'];
