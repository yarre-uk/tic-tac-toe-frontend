import { useEffect, useRef } from 'react';

import type { WorkerMessage } from '../types';
import BackgroundWorker from '../workers/background.worker?worker';

import { useResizeObserver } from '@/hooks/use-resize';
import { isDefined } from '@/lib/utils';

function send(
  worker: Worker,
  msg: WorkerMessage,
  transfer?: Array<Transferable>,
) {
  worker.postMessage(msg, transfer ?? []);
}

export function BackgroundCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none';
    container.appendChild(canvas);

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const style = getComputedStyle(document.documentElement);
    const colors = {
      x: style.getPropertyValue('--x').trim(),
      o: style.getPropertyValue('--o').trim(),
    };

    const worker = new BackgroundWorker();
    workerRef.current = worker;
    const offscreen = canvas.transferControlToOffscreen();
    send(worker, { type: 'init', canvas: offscreen, colors }, [offscreen]);

    let lastClientX: number | null = null;
    let lastClientY: number | null = null;

    function handleMouseMove(e: MouseEvent) {
      if (!isDefined(container)) {
        throw new Error('Container is not define!');
      }

      lastClientX = e.clientX;
      lastClientY = e.clientY;

      const rect = container.getBoundingClientRect();

      send(worker, {
        type: 'mouse',
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    function handleMouseLeave() {
      lastClientX = null;
      lastClientY = null;
      send(worker, { type: 'mouseleave' });
    }

    function handleScroll() {
      if (!container || lastClientX === null || lastClientY === null) {
        return;
      }

      const rect = container.getBoundingClientRect();

      send(worker, {
        type: 'mouse',
        x: lastClientX - rect.left,
        y: lastClientY - rect.top,
      });
    }

    function handleTouch(e: TouchEvent) {
      if (!container) {
        return;
      }

      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();

      send(worker, {
        type: 'mouse',
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }

    function handleTouchEnd() {
      send(worker, { type: 'mouseleave' });
    }

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('touchmove', handleTouch);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      worker.terminate();
      workerRef.current = null;
      canvas.remove();
    };
  }, []);

  useResizeObserver(containerRef, ([entry]) => {
    const { width, height } = entry.contentRect;

    if (workerRef.current) {
      send(workerRef.current, { type: 'resize', width, height });
    }
  });

  return <div ref={containerRef} className="absolute inset-0 -z-10" />;
}
