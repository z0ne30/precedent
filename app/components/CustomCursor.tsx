'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Define the props if needed later (e.g., for different cursor styles)
interface CustomCursorProps {}

export default function CustomCursor({}: CustomCursorProps) {
  const cursorX = useMotionValue(-100); // Position off-screen initially
  const cursorY = useMotionValue(-100);
  // Removed magneticDotX, magneticDotY motion values

  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 500, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  // Removed magneticDot springs

  // Ref for the magnetic dot element
  // Removed magneticDotRef

  // State to track if magnetically attached
  // Removed state/refs related to magnetic snapping (isSnapping, targetCoords, magneticTargets)
  // Removed effect for finding magnetic targets

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      // Update motion values AND CSS custom properties for the mask
      cursorX.set(clientX);
      cursorY.set(clientY);
      document.documentElement.style.setProperty('--cursor-x', `${clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${clientY}px`);

      // Removed all magnetic target finding and snapping logic
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Hide the default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Restore default cursor on component unmount
      document.body.style.cursor = 'auto';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorX, cursorY]); // Simplified dependencies

  // Update main cursor opacity based on snapping state
  // Removed mainCursorOpacity logic based on snapping

  // TODO: Add logic for background reveal effect (CSS variables) - Magnetic logic removed

  return (
    <>
      {/* Main Cursor Element (Example: Ring) */}
      <motion.div
        className="fixed pointer-events-none z-50 rounded-full border-2 border-teal-400"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          width: '30px', // Adjust size as needed
          height: '30px',
          // Center the ring on the cursor position
          x: '-50%',
          y: '-50%',
          // Add transition for potential style changes (like fading on attach)
          transition: 'opacity 0.2s ease-out', // Smooth opacity change
          opacity: 1, // Reset opacity to default
        }}
      />
      {/* Removed Magnetic Dot Element */}
      {/* TODO: Add element for background reveal mask if using that method */}
    </>
  );
}