import { useState } from 'react';
import { GamePhase, Grid as GridType, PlacedShip } from './types/game';
import WelcomeScreen from './components/WelcomeScreen';
import PlacementScreen from './components/PlacementScreen';
import BattleScreen from './components/BattleScreen';
import EndScreen from './components/EndScreen';

interface BattleState {
  playerGrid: GridType;
  playerPlaced: PlacedShip[];
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [battleState, setBattleState] = useState<BattleState | null>(null);

  function handlePlacementReady(grid: GridType, placed: PlacedShip[]) {
    setBattleState({ playerGrid: grid, playerPlaced: placed });
    setPhase('battle');
  }

  function handleReplay() {
    setBattleState(null);
    setPhase('placement');
  }

  if (phase === 'welcome') {
    return <WelcomeScreen onStart={() => setPhase('placement')} />;
  }

  if (phase === 'placement') {
    return <PlacementScreen onReady={handlePlacementReady} />;
  }

  if (phase === 'battle' && battleState) {
    return (
      <BattleScreen
        playerGrid={battleState.playerGrid}
        playerPlaced={battleState.playerPlaced}
        onVictory={() => setPhase('victory')}
        onDefeat={() => setPhase('defeat')}
      />
    );
  }

  if (phase === 'victory') {
    return <EndScreen won={true} onReplay={handleReplay} />;
  }

  if (phase === 'defeat') {
    return <EndScreen won={false} onReplay={handleReplay} />;
  }

  return null;
}
