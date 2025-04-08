'use client';

import React from 'react';
import { useScrollPosition } from '@/lib/hooks/useScrollPosition';
import useMediaQuery from '@/lib/hooks/use-media-query'; // Import useMediaQuery

interface ParallaxBackgroundWrapperProps {
  children: React.ReactNode;
  /**
   * Parallax factor. Negative value moves background up as user scrolls down.
   * e.g., -0.1 means background moves 1px up for every 10px scrolled down.
   */
  factor?: number;
  className?: string;
}

const ParallaxBackgroundWrapper: React.FC<ParallaxBackgroundWrapperProps> = ({
  children,
  factor = -0.1, // Default parallax factor
  className,
}) => {
  const scrollY = useScrollPosition(50); // Throttle scroll updates slightly
  const { isMobile } = useMediaQuery(); // Get mobile status

  // Calculate the transform only if the factor is non-zero AND not on mobile
  const transform = !isMobile && factor !== 0 ? `translateY(${scrollY * factor}px)` : 'none';

  return (
    <div
      className={className}
      style={{
        position: 'absolute', // Ensure it can be positioned behind content
        inset: 0, // Cover the entire parent (likely the body or a main wrapper)
        zIndex: -10, // Position behind content
        overflow: 'hidden', // Prevent scrollbars if content moves slightly out
        transform: transform,
        willChange: 'transform', // Hint browser for optimization
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxBackgroundWrapper;