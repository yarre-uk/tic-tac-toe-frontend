import * as z from 'zod';

export const EnvSchema = z.object({
  VITE_LINK_URL: z.url(),

  VITE_API_URL: z.url(),
  VITE_WS_URL: z.url(),

  VITE_IS_APP_ENABLED_FLAG: z.coerce.boolean(),
  VITE_IS_GAME_ENABLED_FLAG: z.coerce.boolean(),
  VITE_IS_AUTH_ENABLED_FLAG: z.coerce.boolean(),
  VITE_IS_DEV_TOOLS_ENABLED_FLAG: z.coerce.boolean(),
});

export const Envs = EnvSchema.parse(import.meta.env);
