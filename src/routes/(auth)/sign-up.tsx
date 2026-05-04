import { Link, createFileRoute } from '@tanstack/react-router';

import { SignUpForm } from '#/modules/auth';

export const Route = createFileRoute('/(auth)/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-(--line) bg-(--surface) p-8">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Create account</h1>
          <p className="text-sm text-(--sea-ink-soft)">Join the game</p>
        </div>

        <SignUpForm />

        <p className="text-center text-sm text-(--sea-ink-soft)">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-(--lagoon) hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
