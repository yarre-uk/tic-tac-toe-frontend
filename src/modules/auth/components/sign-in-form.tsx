import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormError,
  Input,
  Label,
} from '@/components';
import { isDefined } from '@/lib';
import { useSignInMutation } from '@/modules';
import type { SignInDto } from '@/modules';

const schema = z.object({
  nickname: z.string().min(4, 'Minimum 4 characters'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isError, isPending, mutateAsync: signIn } = useSignInMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await signIn(values satisfies SignInDto);
    await navigate({ to: '/' });
  };

  console.log({ isError });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              {...register('nickname')}
              placeholder="Your nickname"
              aria-invalid={isDefined(errors.nickname)}
            />

            <FormError size="xs" message={errors.nickname?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className="pr-10"
                aria-invalid={isDefined(errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-ink-3 hover:text-ink absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <FormError size="xs" message={errors.password?.message} />
          </div>

          <FormError
            message={isError ? 'Invalid nickname or password' : undefined}
          />

          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            className="w-full"
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
