import { Link, createFileRoute } from '@tanstack/react-router';

import { authStore } from '@/modules';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  const { accessToken, isAuthorized, isReady } = authStore();

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold">Welcome to Tic Tac Toe</h1>
      <p>Simple and yet interesting game</p>
      <p>token: {accessToken?.slice(0, 10)}...</p>
      <p>isReady: {String(isReady)}</p>
      <p>isAuthorized: {String(isAuthorized())}</p>
      <p>
        <Link to="/sign-in">Sign In</Link>
        <Link to="/sign-up">Sign Up</Link>
      </p>
    </div>
  );
}
