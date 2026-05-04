import { Link, createFileRoute } from '@tanstack/react-router';

import { SignInForm } from '@/modules/auth';

export const Route = createFileRoute('/(auth)/sign-in')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-(--line) bg-(--surface) p-8">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Sign in</h1>
          <p className="text-sm text-(--sea-ink-soft)">Welcome back</p>
        </div>

        <SignInForm />

        <p className="text-center text-sm text-(--sea-ink-soft)">
          No account?{' '}
          <Link to="/sign-up" className="text-(--lagoon) hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
