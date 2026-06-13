import { useEffect } from 'react';

import { useSocketStore } from '../socket-store';
import { useAuthStore } from '../store';

import { api } from '@/lib/axios';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { isDefined } from '@/lib/utils';
import type { ApiResult } from '@/types';

/**
 * Manages the WebSocket connection lifecycle. Call once in the root shell component.
 *
 * Connection scenarios handled:
 *   1. Already authorized on mount (page reload after login) — connect immediately.
 *   2. Becomes authorized while mounted (fresh login) — connect when isReady flips.
 *   3. Token cleared (logout) — disconnect.
 *   4. WS token expires mid-session — refresh via HTTP, reconnect with new token.
 *
 * Why gate on isReady?
 *   useAuthRefresh validates the token on mount before setting isReady. Connecting
 *   before that completes risks every message being rejected by WsAuthGuard if the
 *   token turns out to be expired.
 *
 * Why useAuthStore.subscribe instead of useAuthStore()?
 *   subscribe() runs a plain listener outside the React render cycle — no re-renders.
 *   useAuthStore() would re-render the root shell on every auth state change, which
 *   is unnecessary since we only need the side-effect of connect/disconnect.
 *
 * Token expiry handling (connect → exception listener):
 *   WsAuthGuard rejects each message individually with an "exception" event when the
 *   token is expired. On that event we refresh via HTTP, disconnect the old socket,
 *   and call connect() again with the new token. socketStore.bump() is called on
 *   every new socket so dependent hooks (useRoom etc.) can re-attach their listeners.
 */
export function useSocketConnection(): void {
  'use no memo';

  useEffect(() => {
    let isRefreshing = false;

    function connect(token: string) {
      const socket = connectSocket(token);
      useSocketStore.getState().bump();

      socket.on('exception', async (wsError: { message: string }) => {
        if (wsError.message !== 'Token is invalid or expired') {
          return;
        }

        if (isRefreshing) {
          return;
        }

        isRefreshing = true;

        try {
          const res =
            await api.post<ApiResult<{ accessToken: string }>>('/auth/refresh');

          const accessToken = res.data.data.accessToken;

          useAuthStore.getState().setAccessToken(accessToken);
          disconnectSocket();
          connect(accessToken);
        } catch {
          useAuthStore.getState().setAccessToken(null);
        } finally {
          isRefreshing = false;
        }
      });
    }

    const { accessToken, isReady } = useAuthStore.getState();
    if (isDefined(accessToken) && isReady) {
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
      unsubscribe();
      disconnectSocket();
    };
  }, []);
}
