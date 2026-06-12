import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import { Button } from '@/components';
import { isDefined } from '@/lib/utils';
import {
  RoomLobby,
  useCurrentUser,
  useProfileStore,
  useRoom,
  useRoomStore,
  useSocketStore,
} from '@/modules';

export const Route = createFileRoute('/game')({
  component: RouteComponent,
});

function RouteComponent() {
  const { room, create, rejoin, update, leave } = useRoom();
  const currentUser = useCurrentUser();
  const profileRoomId = useProfileStore((s) => s.profile?.roomId ?? null);
  const socketVersion = useSocketStore((s) => s.version);

  useEffect(() => {
    if (isDefined(profileRoomId) && !isDefined(room)) {
      rejoin(profileRoomId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileRoomId, room]);

  // Re-joins the socket room after a token refresh creates a new socket
  // instance. room is read via getState() to avoid this becoming a dep —
  // we only want it to fire on socketVersion changes.
  useEffect(() => {
    const storeRoom = useRoomStore.getState().room;
    if (!isDefined(storeRoom)) {
      return;
    }

    rejoin(storeRoom.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketVersion]);

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
        onUpdate={update}
      />
    </>
  );
}
