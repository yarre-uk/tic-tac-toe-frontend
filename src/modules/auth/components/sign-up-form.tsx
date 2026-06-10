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
  Text,
} from '@/components';
import { isDefined } from '@/lib/utils';
import { useSignUpMutation } from '@/modules';
import type { SignUpDto } from '@/modules';

const schema = z.object({
  nickname: z.string().min(4, 'Minimum 4 characters'),
  email: z.union([z.email('Invalid email'), z.literal('')]).optional(),
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
  const navigate = useNavigate();
  const { isError, isPending, mutateAsync: signUp } = useSignUpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await signUp(values satisfies SignUpDto);
    await navigate({ to: '/' });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
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
            <Label htmlFor="email">
              Email{' '}
              <Text as="span" size="xs" color="muted">
                (optional)
              </Text>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              aria-invalid={isDefined(errors.email)}
            />

            <FormError size="xs" message={errors.email?.message} />
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
            message={
              isError
                ? 'Registration failed. Nickname may already be taken.'
                : undefined
            }
          />

          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            className="w-full"
          >
            {isPending ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
