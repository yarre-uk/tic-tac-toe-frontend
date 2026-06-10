import { useEffect } from 'react';

import { connectSocket, disconnectSocket } from '@/lib/socket';
import { isDefined } from '@/lib/utils';
import { authStore } from '@/modules/auth/store';

/**
 * Manages the WebSocket connection lifecycle for the authenticated part of the app.
 *
 * Call this hook exactly once, in the root authenticated layout component.
 * It handles two scenarios:
 *   1. Store becomes authorized (isReady + token) — connect. Covers both page refresh
 *      and fresh login without needing separate conditions for each.
 *   2. Token is cleared (logout) — disconnect.
 *
 * Why gate on isReady?
 *   On mount, Zustand rehydrates accessToken from localStorage immediately, but the
 *   token is unvalidated at that point. useAuthRefresh runs in parallel and either
 *   confirms the token (setting a fresh one) or clears it. isReady becomes true only
 *   after that completes. Connecting with a potentially expired token would mean every
 *   socket message gets rejected by WsAuthGuard until the next emit.
 *
 * Why not just useEffect + useAuthStore()?
 *   We subscribe to the Zustand store directly (authStore.subscribe) instead of
 *   using the React hook (useAuthStore) because we don't want this hook to cause
 *   a re-render every time the auth state changes. We only care about the
 *   side-effect (connect/disconnect), not about reading the value into the component tree.
 */
export function useSocketConnection(): void {
  useEffect(() => {
    // Scenario 1: already authorized when this component first mounts.
    // This only happens if the user refreshed the page AND useAuthRefresh has
    // already resolved by the time this effect runs — uncommon but possible.
    const { accessToken, isReady } = authStore.getState();
    if (accessToken && isReady) {
      connectSocket(accessToken);
    }

    // authStore.subscribe(listener) calls `listener(newState, previousState)`
    // every time the store changes. This is the Zustand equivalent of watching
    // a value — but outside the React render cycle, which is exactly what we want
    // for managing a side-effectful resource like a socket.
    const unsubscribe = authStore.subscribe((state, prev) => {
      const tokenRemoved = !state.accessToken && prev.accessToken;

      // Connect when the store transitions into "authorized" — has a validated token.
      // Covers both the page-refresh case (isReady flips true) and the fresh-login
      // case (token appears while isReady is already true) without needing separate
      // conditions for each.
      const isAuthorized = state.isAuthorized();
      const wasAuthorized = isDefined(prev.accessToken) && prev.isReady;
      const justBecameAuthorized = isAuthorized && !wasAuthorized;

      if (justBecameAuthorized) {
        connectSocket(state.accessToken!);
      } else if (tokenRemoved) {
        // User logged out — cleanly close the socket so the server removes
        // them from any rooms before the 60s auto-leave timer fires.
        disconnectSocket();
      }

      // Note: token refresh (new token, prev token both non-null) is not handled here.
      // The existing socket stays connected; the WsAuthGuard re-validates the token
      // on each message, so a refreshed token will be picked up on the next event.
      // If you need to reconnect with the new token (e.g. the old one gets blacklisted
      // mid-session), handle it in the connect_error listener inside socket.ts.
    });

    return () => {
      // React calls this cleanup when the component unmounts.
      // Unsubscribing prevents the listener from running after teardown,
      // and disconnecting closes the socket so we don't leak connections.
      unsubscribe();
      disconnectSocket();
    };
  }, []);
  // Empty dependency array: this effect runs once on mount and cleans up on unmount.
  // The socket lifecycle is driven by the store subscription, not by React re-renders.
}
