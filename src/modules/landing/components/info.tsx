import { Link } from '@tanstack/react-router';

import { Button, Text } from '@/components';
import { cn } from '@/lib/utils';

export function LandingInfo({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn('text-muted-foreground space-y-4', className)}>
      <Text
        size="xxs"
        className="space uppercase"
        weight="light"
        tracking="wide"
      >
        — a side project
      </Text>
      <Text weight="light" color="secondary">
        The classic 3×3 game, redrawn for the dark. Play locally, spin up a
        private room to challenge a friend online, and chat while you play.
      </Text>
      <Text weight="light">made by / Yaroslav Syvukha</Text>

      <div className="flex gap-2 md:gap-4">
        <Button render={<Link to="/app" />}>Play Now</Button>
        <Button render={<Link to="/game" />} color="o">
          Create a room
        </Button>
      </div>

      <hr />

      <div className="[&>.bottom]:text-ink grid grid-cols-3 grid-rows-[auto_auto] [&>.bottom]:leading-none [&>.head]:uppercase">
        <Text size="xs" className="head" weight="light">
          rooms
        </Text>
        <Text size="xs" className="head" weight="light">
          chat
        </Text>
        <Text size="xs" className="head" weight="light">
          mode
        </Text>
        <Text size="2xl" weight="bold" className="bottom">
          private
        </Text>
        <Text size="2xl" weight="bold" className="bottom">
          built-in
        </Text>
        <Text size="2xl" weight="bold" className="bottom">
          1v1
        </Text>
      </div>
    </div>
  );
}
