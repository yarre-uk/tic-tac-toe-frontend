import { create } from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { Envs } from './env';
import { isDefined } from './utils';

import { useAuthStore } from '@/modules';
import type { ApiResult } from '@/types';

const BASE_URL = Envs.VITE_API_URL;

export const api = create({ baseURL: BASE_URL, withCredentials: true });
export const apiAuth = create({ baseURL: BASE_URL, withCredentials: true });

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type QueueItem = {
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
};

let isRefreshing = false;
let refreshQueue: Array<QueueItem> = [];

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (isDefined(error) || !isDefined(token)) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  refreshQueue = [];
}

apiAuth.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState();

  if (isDefined(accessToken)) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

type ErrorRes = {
  success: boolean;
  error: {
    message: string;
    code: number;
  };
  timestamp: string;
  path: string;
};

apiAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;

    const is401 = error.response?.status === 401;
    const isTokenExpired =
      (error.response?.data as ErrorRes).error.message ===
      'Token is invalid or expired';
    const shouldRefetch = is401 && isTokenExpired;

    if (!shouldRefetch || !isDefined(config) || isDefined(config._retry)) {
      return Promise.reject(error);
    }

    config._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        config.headers.set('Authorization', `Bearer ${token}`);
        return apiAuth(config);
      });
    }

    isRefreshing = true;

    try {
      const res =
        await api.post<ApiResult<{ accessToken: string }>>('/auth/refresh');

      const accessToken = res.data.data.accessToken;

      useAuthStore.getState().setAccessToken(accessToken);
      processQueue(null, accessToken);

      return apiAuth(config);
    } catch (refreshError) {
      processQueue(refreshError, null);

      useAuthStore.getState().setAccessToken(null);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
