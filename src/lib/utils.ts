import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== undefined && value !== null;
}

export function shouldBeUnreachable(value: never) {
  return value;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clearObject<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (!isDefined(v)) {
        return false;
      }

      if (v === '') {
        return false;
      }

      if (Array.isArray(v)) {
        return v.length > 0;
      }

      return true;
    }),
  ) as T;
}

export function toRange(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomInRange(min: number, max: number): number {
  // eslint-disable-next-line sonarjs/pseudo-random
  return min + Math.random() * (max - min);
}
