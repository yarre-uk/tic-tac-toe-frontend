import { createFileRoute } from '@tanstack/react-router';

import { LandingHeader, LandingInfo, LandingTitle } from '@/modules';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <div>
      <LandingHeader />

      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <LandingTitle className="" />
        <LandingInfo className="max-lg:ml-auto lg:w-1/2 2xl:w-1/3" />
      </div>
    </div>
  );
}
