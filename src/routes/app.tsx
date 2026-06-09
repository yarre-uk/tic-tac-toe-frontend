import { Link, createFileRoute } from '@tanstack/react-router';

import { authStore } from '@/modules';

export const Route = createFileRoute('/app')({
  component: App,
});

function App() {
  const { isAuthorized, isReady } = authStore();

  return (
    <div>
      <Link to="/app">app</Link>
      <Link to="/game">game</Link>
      <p>isAuthorized {String(isAuthorized())}</p>
      <p>isReady {String(isReady)}</p>
    </div>
  );
}
