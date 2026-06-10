import { Link, createFileRoute } from '@tanstack/react-router';

import {
  FeaturesLanding,
  LandingGame,
  LandingHeader,
  LandingInfo,
  LandingTitle,
} from '@/modules';

export const Route = createFileRoute('/')({ component: Landing });

function Landing() {
  return (
    <div className="flex flex-col gap-12">
      <Link to="/app">app</Link>
      <LandingHeader />
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <LandingTitle className="" />
        <LandingInfo className="max-lg:ml-auto lg:w-1/2 2xl:w-1/3" />
      </div>

      <FeaturesLanding className="mt-10 md:mt-20 lg:mt-40" />

      <LandingGame className="my-10 lg:my-20" />
    </div>
  );
}
