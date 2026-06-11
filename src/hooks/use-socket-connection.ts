import { useEffect } from 'react';

import { api } from '@/lib/axios';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { isDefined } from '@/lib/utils';
import { useAuthStore } from '@/modules';
import type { ApiResult } from '@/types';

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
  'use no memo';

  useEffect(() => {
    // Wraps connectSocket and adds the auth-expiry exception listener so every
    // new socket instance handles token refresh the same way.
    function connect(token: string) {
      const socket = connectSocket(token);

      socket.on('exception', async (wsError: { message: string }) => {
        if (wsError.message !== 'Token is invalid or expired') return;

        try {
          const res =
            await api.post<ApiResult<{ accessToken: string }>>('/auth/refresh');

          const accessToken = res.data.data.accessToken;

          useAuthStore.getState().setAccessToken(accessToken);
          disconnectSocket();
          connect(accessToken);
        } catch {
          useAuthStore.getState().setAccessToken(null);
        }
      });
    }

    // Scenario 1: already authorized when this component first mounts.
    const { accessToken, isReady } = useAuthStore.getState();
    if (accessToken && isReady) {
      connect(accessToken);
    }

    const unsubscribe = useAuthStore.subscribe((state, prev) => {
      const tokenRemoved = !state.accessToken && prev.accessToken;

      const isAuthorized = state.isAuthorized();
      const wasAuthorized = isDefined(prev.accessToken) && prev.isReady;
      const justBecameAuthorized = isAuthorized && !wasAuthorized;

      if (justBecameAuthorized) {
        connect(state.accessToken!);
      } else if (tokenRemoved) {
        disconnectSocket();
      }
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
