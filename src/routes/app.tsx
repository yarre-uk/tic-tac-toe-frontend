import { useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute, redirect } from '@tanstack/react-router';

import { Button } from '@/components';
import { isFeatureEnabled } from '@/lib';
import { useAuthStore, useProfileStore } from '@/modules';

export const Route = createFileRoute('/app')({
  component: App,
  beforeLoad: () => {
    if (!isFeatureEnabled('IS_APP_ENABLED')) {
      throw redirect({
        to: '/',
      });
    }
  },
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
        <Button render={<Link to="/" />} nativeButton={false}>
          landing
        </Button>
        <Button
          variant="outlined"
          render={<Link to="/app" />}
          nativeButton={false}
        >
          app
        </Button>
        <Button color="o" render={<Link to="/game" />} nativeButton={false}>
          game
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
