import * as z from 'zod';

export const EnvSchema = z.object({
  VITE_API_URL: z.url(),
  // Base URL of the backend server (without path). Used to build the WebSocket
  // connection URL. Separate from VITE_API_URL because the WS gateway sits at
  // the server root (/ws), not under /api/v1.
  VITE_WS_URL: z.url(),
});

export const Envs = EnvSchema.parse(import.meta.env);
