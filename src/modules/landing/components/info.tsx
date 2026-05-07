import { Text } from '@/components';
import { cn } from '@/lib/utils';

export function LandingInfo({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn('text-muted-foreground space-y-4', className)}>
      <Text
        size="xs"
        className="space tracking-widest uppercase"
        weight="light"
      >
        — a side project
      </Text>
      <Text color="secondary">
        The classic 3×3 game, redrawn for the dark. Play locally, spin up a
        private room to challenge a friend online, and chat while you play.
      </Text>
      <Text weight="light">made by / Yaroslav Syvukha</Text>

      <hr />

      <div className="[&>.bottom]:text-ink grid grid-cols-3 grid-rows-[auto_auto] [&>.bottom]:leading-none [&>.head]:uppercase">
        <Text size="sm" className="head" weight="light">
          rooms
        </Text>
        <Text size="sm" className="head" weight="light">
          chat
        </Text>
        <Text size="sm" className="head" weight="light">
          mode
        </Text>
        <Text size="2xl" className="bottom">
          private
        </Text>
        <Text size="2xl" className="bottom">
          built-in
        </Text>
        <Text size="2xl" className="bottom">
          1v1
        </Text>
      </div>
    </div>
  );
}
