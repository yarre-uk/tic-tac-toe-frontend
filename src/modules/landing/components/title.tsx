import { Text } from '@/components';

export function LandingTitle() {
  return (
    <div>
      <Text
        size="title"
        weight="bold"
        className="w-min leading-[0.7] uppercase select-none [&>.dot]:ml-8 md:[&>.dot]:ml-12"
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
