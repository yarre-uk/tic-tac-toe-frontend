import { createFileRoute } from '@tanstack/react-router';

import { LandingHeader, LandingTitle } from '@/modules';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <div>
      <LandingHeader />
      <LandingTitle />
    </div>
  );
}
