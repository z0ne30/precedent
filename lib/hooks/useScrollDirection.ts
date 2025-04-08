import { useState, useEffect, useRef } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface ScrollInfo {
  scrollDirection: ScrollDirection;
  scrolledPastThreshold: boolean;
}

// Simple throttle function
function throttle(func: () => void, limit: number): () => void {
  let lastRan: number | undefined;
  let timeoutId: NodeJS.Timeout | null = null;

  return function() { // Remove ...args
    const runFunc = () => {
      func(); // Call func without arguments
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


export function useScrollDirection(threshold: number = 10, throttleLimit: number = 100): ScrollInfo {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false);
  const lastScrollY = useRef<number>(typeof window !== 'undefined' ? window.pageYOffset : 0);
  const ticking = useRef(false); // Ref for throttle/requestAnimationFrame logic

  useEffect(() => {
    // Ensure this runs only client-side
    if (typeof window === 'undefined') {
      return;
    }

    lastScrollY.current = window.pageYOffset; // Initialize last scroll position

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      // Update threshold state
      setScrolledPastThreshold(scrollY > threshold);

      // Update direction state
      if (Math.abs(scrollY - lastScrollY.current) < 10) { // Ignore small changes
        ticking.current = false;
        return;
      }
      setScrollDirection(scrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = scrollY > 0 ? scrollY : 0; // Update last scroll position
      ticking.current = false;
    };

    // Use requestAnimationFrame for smoother handling, similar to throttling
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDir);
        ticking.current = true;
      }
    };

    // // Alternative: Use simple throttle
    // const onScrollThrottled = throttle(updateScrollDir, throttleLimit);

    window.addEventListener('scroll', onScroll);
    // window.addEventListener('scroll', onScrollThrottled); // Use this if preferring throttle

    // Initial check in case page loads already scrolled
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      // window.removeEventListener('scroll', onScrollThrottled); // Clean up throttled listener
      // if (lastFunc) clearTimeout(lastFunc); // Clear timeout if using throttle
    };
  }, [threshold, throttleLimit]); // Re-run effect if threshold changes

  return { scrollDirection, scrolledPastThreshold };
}