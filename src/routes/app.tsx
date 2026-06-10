import { Link, createFileRoute } from '@tanstack/react-router';

import { useAuthStore, useProfileStore } from '@/modules';

export const Route = createFileRoute('/app')({
  component: App,
});

function App() {
  const { isAuthorized, isReady } = useAuthStore();
  const { profile } = useProfileStore();

  return (
    <div>
      <Link to="/app">app</Link>
      <Link to="/game">game</Link>
      <p>isAuthorized {String(isAuthorized())}</p>
      <p>isReady {String(isReady)}</p>
      <p>nickname {profile?.nickname}</p>
      <p>roomId {profile?.roomId}</p>
    </div>
  );
}
