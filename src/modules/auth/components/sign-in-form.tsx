import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { useSignInMutate } from '@/modules/auth/hooks';
import type { SignInDto } from '@/modules/auth/types';

const schema = z.object({
  nickname: z.string().min(4, 'Minimum 4 characters'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const mutation = useSignInMutate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync(values satisfies SignInDto);
    await navigate({ to: '/' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nickname" className="text-sm font-medium">
          Nickname
        </label>
        <input
          id="nickname"
          {...register('nickname')}
          placeholder="Your nickname"
          className={cn(
            'rounded-lg border px-3 py-2 text-sm transition outline-none',
            'border-(--line) bg-transparent placeholder:text-(--sea-ink-soft)',
            'focus:border-(--lagoon) focus:ring-1 focus:ring-(--lagoon)',
            errors.nickname && 'border-red-500',
          )}
        />
        {errors.nickname && (
          <p className="text-xs text-red-400">{errors.nickname.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="••••••••"
            className={cn(
              'w-full rounded-lg border px-3 py-2 pr-10 text-sm transition outline-none',
              'border-(--line) bg-transparent placeholder:text-(--sea-ink-soft)',
              'focus:border-(--lagoon) focus:ring-1 focus:ring-(--lagoon)',
              errors.password && 'border-red-500',
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-(--sea-ink-soft) hover:text-(--sea-ink)"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-400">Invalid nickname or password</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || mutation.isPending}
        className={cn(
          'rounded-lg px-4 py-2.5 text-sm font-semibold transition',
          'bg-(--lagoon) text-(--sand) hover:bg-(--lagoon-deep)',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {mutation.isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
