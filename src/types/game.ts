export type Orientation = 'h' | 'v';
export type GamePhase = 'welcome' | 'placement' | 'battle' | 'victory' | 'defeat';

export interface ShipDef {
  id: string;
  name: string;
  size: number;
  color: string;
  abbr: string;
}

export interface PlacedShip {
  def: ShipDef;
  row: number;
  col: number;
  orientation: Orientation;
}

export type CellValue =
  | { kind: 'empty' }
  | { kind: 'ship'; shipId: string; segIndex: number; segCount: number; orientation: Orientation }
  | { kind: 'hit' }
  | { kind: 'miss' };

export type Grid = CellValue[][];
