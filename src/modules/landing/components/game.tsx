import { TTTBoard, useLocalGameStrategy } from '@/modules/game';

export function LandingGame({ className }: Readonly<{ className: string }>) {
  const localGame = useLocalGameStrategy();

  return (
    <>
      <TTTBoard {...localGame} className={className} />
    </>
  );
}
