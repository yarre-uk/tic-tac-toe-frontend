import { Card, Text } from '@/components';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  index: number;
  title: string;
  description: string;
}

const features: Array<Omit<FeatureCardProps, 'index'>> = [
  {
    title: 'Private rooms',
    description:
      'Spin up a room with a 6-character code and share it. Only people with the code can join — no accounts needed.',
  },
  {
    title: 'Play online',
    description:
      'Real-time moves over a websocket. The other player sees your X land the instant you click.',
  },
  {
    title: 'Chat in-game',
    description:
      'A small chat panel sits beside the board. Trash-talk, congratulate, or just say gg — without leaving the page.',
  },
  {
    title: 'Pass-and-play',
    description:
      'Skip the room. Two players, one keyboard, take turns. Good for showing the game off in person.',
  },
  {
    title: 'Match history',
    description:
      'Every round you play in a room is logged with the final board, the winner, and the time it took.',
  },
  {
    title: 'Light / dark',
    description:
      'Defaults to dark with the floating X/O background, but ships a clean light theme too. Persists per device.',
  },
];

function FeatureCard({
  index,
  title,
  description,
}: Readonly<FeatureCardProps>) {
  const isX = index % 2 === 0;

  return (
    <Card className="vol-base vol-natural flex min-w-60 flex-col gap-5 p-4 lg:p-6">
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            'flex size-11 items-center justify-center rounded-xl border',
            isX ? 'bg-x-soft border-x' : 'border-o bg-o-soft',
          )}
        >
          <Text
            as="span"
            size="3xl"
            weight="bold"
            color={isX ? 'x' : 'o'}
            className={cn('leading-none')}
          >
            {isX ? 'X' : 'O'}
          </Text>
        </div>

        <Text
          as="span"
          size="xs"
          color="muted"
          tracking="wide"
          className="leading-none tabular-nums"
        >
          {String(index + 1).padStart(2, '0')}
        </Text>
      </div>

      <Text weight="semibold" size="lg">
        {title}
      </Text>

      <Text color="secondary" weight="light">
        {description}
      </Text>
    </Card>
  );
}

export function FeaturesLanding({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div className={cn('space-y-4 md:space-y-8', className)}>
      <div className="relative flex flex-row">
        <Text color="muted" className="uppercase" size="xxs" tracking="wide">
          <span className="text-ink font-bold">01 /</span>
          &nbsp; features
        </Text>

        <div className="border-ink-3 relative top-1/2 mx-4 flex-1 translate-y-1/2 border-t" />

        <Text color="muted" className="uppercase" size="xxs" tracking="wide">
          06 items
        </Text>
      </div>

      <div
        className={
          'grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3'
        }
      >
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} {...feature} index={i} />
        ))}
      </div>
    </div>
  );
}
