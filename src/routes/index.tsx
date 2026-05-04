import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold">Welcome to Tic Tac Toe</h1>
      <p>Simple and yet interesting game</p>
    </div>
  );
}
