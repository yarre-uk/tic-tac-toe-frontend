import type { RefObject } from 'react';
import { useLayoutEffect } from 'react';

import { useStableCallback } from './use-stable-callback';

export function useResizeObserver<T extends Element>(
  ref: RefObject<T | null>,
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions,
) {
  const stableCallback = useStableCallback(callback);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(stableCallback);

    try {
      resizeObserver.observe(element, options);
    } catch (error) {
      console.error('ResizeObserver error:', error);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, stableCallback, options]);
}
