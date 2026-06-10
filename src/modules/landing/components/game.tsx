import { TTTBoard, useLocalGameStrategy } from '@/modules';

export function LandingGame({ className }: Readonly<{ className: string }>) {
  const localGame = useLocalGameStrategy();

  return (
    <>
      <TTTBoard {...localGame} className={className} />
    </>
  );
}
