import { Link, createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components';
import { authStore } from '@/modules';
import { useSignOutMutation } from '@/modules/auth/hooks';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  'use no memo';

  const { accessToken, isAuthorized, isReady } = authStore();
  const { mutate: signOut, isPending } = useSignOutMutation();

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold">Welcome to Tic Tac Toe</h1>
      <p>Simple and yet interesting game</p>
      <p>token: {accessToken?.slice(0, 10)}...</p>
      <p>isReady: {String(isReady)}</p>
      <p>isAuthorized: {String(isAuthorized())}</p>
      <p>
        <Button variant="default">
          <Link to="/sign-in">Sign In</Link>
        </Button>
        <Button variant="secondary">
          <Link to="/sign-up">Sign Up</Link>
        </Button>
      </p>
      {isAuthorized() && (
        <Button
          variant="destructive"
          onClick={() => signOut()}
          disabled={isPending}
        >
          {isPending ? 'Signing out…' : 'Sign out'}
        </Button>
      )}
    </div>
  );
}
