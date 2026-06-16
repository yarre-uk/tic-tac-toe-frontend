import { useEffect, useRef } from 'react';

import BackgroundWorker from '../workers/background.worker?worker';

export function BackgroundCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Create the canvas imperatively so each effect invocation gets a fresh
    // element. Assigning to canvasRef and calling transferControlToOffscreen()
    // permanently marks the DOM node as a placeholder — in React StrictMode
    // the effect runs twice, and the second run would hit a DOMException if
    // we tried to set width/transfer again on the same node.
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none';
    container.appendChild(canvas);

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Read CSS custom properties on the main thread — the worker has no DOM
    // access so this is the only place they can be resolved.
    const style = getComputedStyle(document.documentElement);
    const colors = {
      x: style.getPropertyValue('--x').trim(),
      o: style.getPropertyValue('--o').trim(),
    };

    const worker = new BackgroundWorker();
    const offscreen = canvas.transferControlToOffscreen();
    worker.postMessage({ type: 'init', canvas: offscreen, colors }, [
      offscreen,
    ]);

    // ResizeObserver tracks the container's actual rendered size — covers both
    // window resizes and page content growing taller than the viewport.
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      worker.postMessage({ type: 'resize', width, height });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      worker.terminate();
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 -z-10" />;
}
