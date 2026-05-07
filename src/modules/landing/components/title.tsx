import { Text } from '@/components';
import { cn } from '@/lib/utils';

export function LandingTitle({ className }: Readonly<{ className?: string }>) {
  return (
    <div>
      <Text
        size="title"
        weight="bold"
        className={cn(
          'w-min leading-[0.8] tracking-tighter uppercase select-none [&>.dot]:ml-8 md:[&>.dot]:ml-12',
          className,
        )}
      >
        <span className="text-o">tic</span>
        <span className="dot text-muted-foreground">·</span>
        <br />
        <span className="text-x">tac</span>
        <span className="dot text-muted-foreground">·</span>
        <br />
        <span className="text-white">toe</span>
      </Text>
    </div>
  );
}
