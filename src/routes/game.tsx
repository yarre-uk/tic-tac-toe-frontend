import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components';
import { useCurrentUser } from '@/modules/auth';
import { RoomLobby, useRoom } from '@/modules/rooms';

export const Route = createFileRoute('/game')({
  component: RouteComponent,
});

function RouteComponent() {
  const { room, create, leave } = useRoom();
  const currentUser = useCurrentUser();

  if (!room) {
    return (
      <>
        <Button onClick={() => create({ name: 'my room' })}>Create room</Button>
        <Button onClick={() => leave()}>Leave room</Button>
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
