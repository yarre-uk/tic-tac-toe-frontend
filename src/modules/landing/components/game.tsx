import { TTTBoard, useLocalGameStrategy } from '@/modules/game';

export function LandingGame() {
  const localGame = useLocalGameStrategy();

  console.log(2);

  return (
    <div>
      <TTTBoard {...localGame} />
    </div>
  );
}
