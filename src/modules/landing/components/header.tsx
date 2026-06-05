import { CircleSmall } from 'lucide-react';

import { Text } from '@/components';

export function LandingHeader() {
  return (
    <header className="my-5 md:my-10 lg:my-14">
      <Text
        className="flex flex-row justify-between uppercase"
        weight="light"
        color="muted"
      >
        <span className="flex">
          <CircleSmall
            className="fill-x stroke-x mr-1 translate-y-1/2"
            size={12}
          />
          tic.tac.toe
        </span>
        <span>local · online · chat</span>
      </Text>
    </header>
  );
}
