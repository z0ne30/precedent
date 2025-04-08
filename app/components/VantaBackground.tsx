'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three'; // Required by Vanta
import { useBreakpointValue } from '@/lib/hooks/useBreakpointValue'; // Import the new hook

// Dynamically import Vanta effect to avoid SSR issues
const importVantaEffect = () => import('vanta/dist/vanta.net.min');

interface VantaBackgroundProps {
  className?: string;
}

const VantaBackground: React.FC<VantaBackgroundProps> = ({ className = '' }) => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  // Define breakpoint-specific values for Vanta parameters
  // Adjusted for slightly denser mobile and smoother scaling
  // Defaults (xl and up) match the original hardcoded values
  const points = useBreakpointValue({ sm: 6.00, md: 7.50, lg: 9.00, xl: 10.00 }) ?? 10.00;
  const maxDistance = useBreakpointValue({ sm: 14.00, md: 16.00, lg: 18.00, xl: 20.00 }) ?? 20.00;
  const spacing = useBreakpointValue({ sm: 22.00, md: 19.00, lg: 17.00, xl: 15.00 }) ?? 15.00;
  const scaleMobile = 1.00; // Keep scaleMobile at 1, density adjustments preferred

  useEffect(() => {
    let effect: any = null;

    const loadVanta = async () => {
      // Ensure THREE is available globally for Vanta
      if (typeof window !== 'undefined') {
        (window as any).THREE = THREE;
      }
      const VANTA = await importVantaEffect();

      if (vantaRef.current && !effect) {
        // Destroy previous instance if it exists (needed when params change)
        if (vantaEffect) {
          vantaEffect.destroy();
        }

        effect = VANTA.default({
          el: vantaRef.current,
          // THREE is automatically picked up from window by Vanta script
          color: 0x14b8a6, // Teal-500
          backgroundColor: 0xffffff, // White
          points: points,
          maxDistance: maxDistance,
          spacing: spacing,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: scaleMobile,
        });
        setVantaEffect(effect);
      }
    };

    loadVanta();

    // Cleanup function
    return () => {
      if (effect) {
        effect.destroy();
        setVantaEffect(null);
      }
    };
    // Re-run effect if breakpoint-dependent values change
  }, [points, maxDistance, spacing, scaleMobile]);

  return (
    <div
      ref={vantaRef}
      className={`vanta-container ${className}`}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      {/* Vanta.js will attach its canvas here */}
    </div>
  );
};

export default VantaBackground;