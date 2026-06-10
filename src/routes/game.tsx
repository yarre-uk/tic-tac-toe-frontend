import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import { Button } from '@/components';
import { isDefined } from '@/lib/utils';
import { useCurrentUser } from '@/modules';
import { useProfileStore } from '@/modules/profile/store';
import { RoomLobby, useRoom } from '@/modules/rooms';

export const Route = createFileRoute('/game')({
  component: RouteComponent,
});

function RouteComponent() {
  const { room, create, rejoin, leave } = useRoom();
  const currentUser = useCurrentUser();
  const profileRoomId = useProfileStore((s) => s.profile?.roomId ?? null);

  useEffect(() => {
    if (isDefined(profileRoomId) && !isDefined(room)) {
      rejoin(profileRoomId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileRoomId, room]);

  if (!room) {
    return (
      <>
        <Button onClick={() => create({ name: 'my room' })}>Create room</Button>
      </>
    );
  }

  return (
    <>
      <RoomLobby
        room={room}
        currentUserId={currentUser?.sub ?? ''}
        onLeave={leave}
      />
    </>
  );
}
