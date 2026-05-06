import { Link, createFileRoute } from '@tanstack/react-router';

import { Text } from '@/components';
import { SignUpForm } from '@/modules/auth';

export const Route = createFileRoute('/(auth)/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <SignUpForm />
        <Text color="muted" className="text-center">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-x hover:underline">
            Sign in
          </Link>
        </Text>
      </div>
    </div>
  );
}
