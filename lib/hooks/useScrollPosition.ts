import { useState, useEffect } from 'react';

// Simple throttle function (can be shared if moved to utils)
function throttle(func: () => void, limit: number): () => void {
  let lastRan: number | undefined;
  let timeoutId: NodeJS.Timeout | null = null;

  return function() {
    const runFunc = () => {
      func();
      lastRan = Date.now();
    };

    if (!lastRan) {
      runFunc();
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if ((Date.now() - (lastRan ?? 0)) >= limit) {
          runFunc();
        }
      }, limit - (Date.now() - (lastRan ?? 0)));
    }
  };
}


export function useScrollPosition(throttleLimit: number = 50): number {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    // Ensure this runs only client-side
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    // Throttle the scroll handler
    const throttledScrollHandler = throttle(handleScroll, throttleLimit);

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      // Clear timeout if using throttle's setTimeout mechanism
      // (Need access to timeoutId from throttle scope, or a more robust throttle implementation)
    };
  }, [throttleLimit]);

  return scrollY;
}