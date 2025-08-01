'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three'; // Required by Vanta

// Dynamically import Vanta effect to avoid SSR issues
const importVantaEffect = () => import('vanta/dist/vanta.net.min');

interface VantaBackgroundProps {
  className?: string;
}

const VantaBackground: React.FC<VantaBackgroundProps> = ({ className = '' }) => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  // Responsive values for Vanta parameters
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive parameters: desktop more sparse, mobile slightly denser
  const points = isMobile ? 10.00 : 6.00; // More points on mobile for visibility
  const maxDistance = isMobile ? 25.00 : 35.00; // Shorter connections on mobile, longer on desktop
  const spacing = isMobile ? 20.00 : 30.00; // Closer spacing on mobile, wider on desktop
  const scaleMobile = 1.00;

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
          color: 0x94f3e4, // Much lighter teal (teal-200) for less interference
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
          opacity: 0.3, // Reduced opacity for less visual interference
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
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: -1 // Ensure it stays behind all content
      }}
    >
      {/* Vanta.js will attach its canvas here */}
    </div>
  );
};

export default VantaBackground;
