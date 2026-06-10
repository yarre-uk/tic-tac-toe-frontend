import { Link, createFileRoute } from '@tanstack/react-router';

import { Text } from '@/components';
import { SignInForm } from '@/modules';

export const Route = createFileRoute('/(auth)/sign-in')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <SignInForm />
        <Text className="text-center" color="muted">
          No account?{' '}
          <Link to="/sign-up" className="text-x hover:underline">
            Create one
          </Link>
        </Text>
      </div>
    </div>
  );
}
