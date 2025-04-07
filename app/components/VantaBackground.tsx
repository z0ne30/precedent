'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three'; // Required by Vanta

// Dynamically import Vanta effect to avoid SSR issues
// Adjust the effect name (e.g., NET, FOG, WAVES) as needed
// Switch back to NET effect
const importVantaEffect = () => import('vanta/dist/vanta.net.min');

interface VantaBackgroundProps {
  className?: string;
  // Add specific Vanta options as props if needed for customization
  // e.g., color?: number; backgroundColor?: number; points?: number; etc.
}

const VantaBackground: React.FC<VantaBackgroundProps> = ({ className = '' }) => {
  const [vantaEffect, setVantaEffect] = useState<any>(null); // Use 'any' for Vanta type for simplicity
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let effect: any = null; // Variable to hold the Vanta instance

    const loadVanta = async () => {
      const VANTA = await importVantaEffect();

      if (vantaRef.current && !effect) {
        effect = VANTA.default({ // Access the default export
          el: vantaRef.current,
          THREE: THREE, // Pass the THREE object
          // --- Vanta NET Effect Options ---
          // Test with dark blue background and white points/lines
          // Revert to Black points on White background test state
          // Revert to light theme colors (Teal points on White background)
          color: 0x14b8a6, // Teal-500
          backgroundColor: 0xffffff, // White
          // Default parameters
          points: 10.00,
          maxDistance: 20.00,
          spacing: 15.00,
          // --- Common Options ---
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
        });
        setVantaEffect(effect); // Store the effect instance if needed later
      }
    };

    loadVanta();

    // Cleanup function
    return () => {
      if (effect) {
        effect.destroy(); // Destroy the Vanta instance on unmount
        setVantaEffect(null);
      }
    };
  }, []); // Run only once on mount

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