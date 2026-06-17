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

    function handleMouseMove(e: MouseEvent) {
      if (!isDefined(container)) {
        throw new Error('Container is not define!');
      }

      const rect = container.getBoundingClientRect();

      send(worker, {
        type: 'mouse',
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
