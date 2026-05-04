import { create } from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { Envs } from './env';
import { isDefined } from './utils';

import { authStore } from '@/modules/auth/store';

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
  const { accessToken } = authStore.getState();

  if (isDefined(accessToken)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !isDefined(config) ||
      isDefined(config._retry)
    ) {
      return Promise.reject(error);
    }

    config._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        return apiAuth(config);
      });
    }

    isRefreshing = true;

    try {
      const { data } = await api.post<{ accessToken: string }>('/auth/refresh');

      authStore.getState().setAccessToken(data.accessToken);
      processQueue(null, data.accessToken);

      config.headers.Authorization = `Bearer ${data.accessToken}`;

      return apiAuth(config);
    } catch (refreshError) {
      processQueue(refreshError, null);

      authStore.getState().setAccessToken(null);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
