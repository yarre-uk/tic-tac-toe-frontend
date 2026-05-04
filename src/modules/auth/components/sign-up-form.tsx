import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '#/lib/axios';
import { cn } from '#/lib/utils';
import { authStore } from '#/modules/auth/store';
import type { TokenResponseDto } from '#/modules/auth/types';

const schema = z.object({
  nickname: z.string().min(4, 'Minimum 4 characters'),
  email: z.union([z.string().email('Invalid email'), z.literal('')]).optional(),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    // eslint-disable-next-line sonarjs/concise-regex
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
});

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAccessToken } = authStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, ...rest }: FormValues) => {
    try {
      const { data } = await api.post<TokenResponseDto>('/auth/sign-up', {
        ...rest,
        ...(email ? { email } : {}),
      });
      setAccessToken(data.accessToken);
      await navigate({ to: '/' });
    } catch {
      setError('root', {
        message: 'Registration failed. Nickname may already be taken.',
      });
    }
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
        <label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-(--sea-ink-soft)">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          placeholder="you@example.com"
          className={cn(
            'rounded-lg border px-3 py-2 text-sm transition outline-none',
            'border-(--line) bg-transparent placeholder:text-(--sea-ink-soft)',
            'focus:border-(--lagoon) focus:ring-1 focus:ring-(--lagoon)',
            errors.email && 'border-red-500',
          )}
        />
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
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

      {errors.root && (
        <p className="text-sm text-red-400">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'rounded-lg px-4 py-2.5 text-sm font-semibold transition',
          'bg-(--lagoon) text-(--sand) hover:bg-(--lagoon-deep)',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
