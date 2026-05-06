import { Link, createFileRoute } from '@tanstack/react-router';

import { SignInForm } from '@/modules/auth';

export const Route = createFileRoute('/(auth)/sign-in')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <SignInForm />
        <p className="text-ink-3 text-center text-sm">
          No account?{' '}
          <Link to="/sign-up" className="text-x hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
