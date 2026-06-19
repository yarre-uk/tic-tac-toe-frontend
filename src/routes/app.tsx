import { useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components';
import { useAuthStore, useProfileStore } from '@/modules';

export const Route = createFileRoute('/app')({
  component: App,
});

function App() {
  const { isAuthorized, isReady } = useAuthStore();
  const { profile } = useProfileStore();
  const queryClient = useQueryClient();

  const handleRefetchProfile = () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  };

  return (
    <div>
      <div className="">
        <Button>
          <Link to="/">landing</Link>
        </Button>
        <Button variant="outlined">
          <Link to="/app">app</Link>
        </Button>
        <Button color="o">
          <Link to="/game">game</Link>
        </Button>
      </div>
      <p>isAuthorized {String(isAuthorized())}</p>
      <p>isReady {String(isReady)}</p>
      <p>nickname {profile?.nickname}</p>
      <p>roomId {profile?.roomId}</p>
      <Button color="natural" onClick={handleRefetchProfile}>
        RefetchProfile
      </Button>
    </div>
  );
}
