import { useState, useEffect } from 'react';
import useMediaQuery from './use-media-query';

// Define breakpoint keys (must match Tailwind config)
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Type for the values at each breakpoint
type BreakpointValues<T> = {
  [key in Breakpoint]?: T;
};

// Hook to get the value for the current breakpoint
export function useBreakpointValue<T>(values: BreakpointValues<T>): T | undefined {
  const { isMobile, isTablet, isDesktop } = useMediaQuery(); // Use existing hook

  // Determine the active breakpoint based on media queries
  let breakpoint: Breakpoint | undefined;
  if (isMobile) {
    breakpoint = 'sm'; // Treat mobile as the smallest breakpoint
  } else if (isTablet) {
    breakpoint = 'md'; // Treat tablet as the medium breakpoint
  } else if (isDesktop) {
    breakpoint = 'lg'; // Treat desktop as the large breakpoint
  } else {
    breakpoint = undefined; // Handle cases where no breakpoint matches (shouldn't happen)
  }

  // Return the value for the active breakpoint (or undefined if not found)
  return values[breakpoint as Breakpoint]; // Type assertion as breakpoint can be undefined
}