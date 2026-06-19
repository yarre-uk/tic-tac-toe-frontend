import type z from 'zod';

import type { EnvSchema } from './env';

type ExtractFlags<T> = {
  [K in keyof T]: K extends `VITE_${infer Name}_FLAG` ? Name : never;
}[keyof T];

export type Flag = ExtractFlags<z.infer<typeof EnvSchema>>;

export function isFeatureEnabled(flag: Flag): boolean {
  return import.meta.env[`VITE_${flag}_FLAG`] === 'true';
}
