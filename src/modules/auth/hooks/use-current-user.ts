import { authStore } from '../store';
import type { UserPayload } from '../types';

/**
 * Decodes the stored JWT access token and returns the payload.
 *
 * A JWT has three dot-separated parts: header.payload.signature
 * The payload is base64url-encoded JSON — we can read it without
 * a library since we're not verifying the signature here (the server does that).
 *
 * Returns null when there is no token (logged out) or the token is malformed.
 */
export function useCurrentUser(): UserPayload | null {
  // Selecting only accessToken avoids re-rendering this consumer when
  // unrelated fields (isReady, etc.) change.
  const accessToken = authStore((s) => s.accessToken);

  if (!accessToken) return null;

  try {
    // JWTs are three base64url segments separated by dots.
    // Index 1 is the payload.
    const [, payload] = accessToken.split('.');

    // atob decodes base64 → string. base64url uses - and _ instead of + and /,
    // so we swap them back before decoding.
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

    return JSON.parse(json) as UserPayload;
  } catch {
    return null;
  }
}
