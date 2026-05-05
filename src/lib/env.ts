import * as z from 'zod';

export const EnvSchema = z.object({
  VITE_API_URL: z.url(),
});

export const Envs = EnvSchema.parse(import.meta.env);
