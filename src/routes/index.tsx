import { createFileRoute } from '@tanstack/react-router';

import { LandingHeader, LandingInfo, LandingTitle } from '@/modules';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <div>
      <LandingHeader />

      <div className="flex flex-col justify-between gap-4 lg:flex-row">
        <LandingTitle className="" />
        <LandingInfo className="w-1/2 2xl:w-1/3" />
      </div>
    </div>
  );
}
