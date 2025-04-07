'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Define the props if needed later (e.g., for different cursor styles)
interface CustomCursorProps {}

export default function CustomCursor({}: CustomCursorProps) {
  // State to track if the Cal.com modal is open (based on body class)
  const [isModalOpen, setIsModalOpen] = useState(
    typeof window !== 'undefined' && document.body.classList.contains('cal-modal-open')
  );

  const cursorX = useMotionValue(-100); // Position off-screen initially
  const cursorY = useMotionValue(-100);
  const magneticDotX = useMotionValue(-100); // For the smaller dot
  const magneticDotY = useMotionValue(-100);

  // Spring physics for smooth movement
  const springConfig = { damping: 15, stiffness: 200, mass: 0.5 }; // Adjusted for more lag
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const magneticDotXSpring = useSpring(magneticDotX, springConfig); // Spring for dot
  const magneticDotYSpring = useSpring(magneticDotY, springConfig);

  // Ref for the magnetic dot element
  const magneticDotRef = useRef<HTMLDivElement>(null); // Ref for the magnetic dot

  // State to track if magnetically attached
  const [isSnapping, setIsSnapping] = useState(false); // Track if attached
  const magneticTargets = useRef<HTMLElement[]>([]); // Store target elements
  const targetCoords = useRef<{ x: number; y: number } | null>(null); // Store target center

  // Effect to find magnetic targets on mount and update
  useEffect(() => {
    magneticTargets.current = Array.from(
      document.querySelectorAll<HTMLElement>('[data-cursor-magnetic]')
    );
    // Could add a MutationObserver here to dynamically update targets if needed
  }, []); // Run once on mount

  // Effect to handle mouse movement and snapping
  useEffect(() => {
    // If modal is open, don't run mouse move logic for this cursor
    if (isModalOpen) return;

    const handleMouseMove = (event: MouseEvent) => {
      // Define magnetic radius
      const magneticRadius = 50; // Pixels around the target center
      const { clientX, clientY } = event;
      // Update motion values AND CSS custom properties for the mask
      cursorX.set(clientX);
      cursorY.set(clientY);
      // Only set CSS vars if not snapping (or handle reveal differently)
      if (!isSnapping) {
        document.documentElement.style.setProperty('--cursor-x', `${clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${clientY}px`);
      }

      let snapped = false;
      targetCoords.current = null; // Reset target coords

      // Check proximity to magnetic targets
      for (const target of magneticTargets.current) {
        const rect = target.getBoundingClientRect();
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(clientX - targetCenterX, 2) + Math.pow(clientY - targetCenterY, 2)
        );

        if (distance < magneticRadius) {
          // Snap only the dot to target center
          magneticDotX.set(targetCenterX);
          magneticDotY.set(targetCenterY);
          targetCoords.current = { x: targetCenterX, y: targetCenterY }; // Store target coords
          snapped = true;
          break; // Snap to the first target found
        }
      }

      // If not snapped, update dot position normally
      if (!snapped) {
        magneticDotX.set(clientX);
        magneticDotY.set(clientY);
      }

      // Update snapping state
      setIsSnapping(snapped);

    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorX, cursorY, magneticDotX, magneticDotY, isModalOpen]); // Re-run if modal state changes

  // Effect to manage body cursor style and observe body class changes
  useEffect(() => {
    // Function to update modal state based on body class
    const checkModalClass = () => {
      const modalIsOpen = document.body.classList.contains('cal-modal-open');
      setIsModalOpen(modalIsOpen);
      // Set body cursor style based on modal state
      document.body.style.cursor = modalIsOpen ? 'auto' : 'none';
    };

    // Initial check
    checkModalClass();

    // Observe changes to body class attribute
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkModalClass();
        }
      }
    });

    observer.observe(document.body, { attributes: true });

    // Cleanup function
    return () => {
      observer.disconnect();
      // Ensure default cursor is restored on unmount
      document.body.style.cursor = 'auto';
    };
  }, []); // Run only once on mount

  // Update main cursor opacity based on snapping state
  // Fade out main cursor when snapping
  const mainCursorOpacity = isSnapping ? 0 : 1;

  // Conditionally render the cursor elements only if the modal is NOT open
  if (isModalOpen) {
    return null; // Render nothing if modal is open
  }

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
          opacity: mainCursorOpacity, // Apply dynamic opacity
        }}
      />
      {/* Magnetic Dot Element */}
      <motion.div
        ref={magneticDotRef}
        className="fixed pointer-events-none z-50 rounded-full bg-teal-500" // Simple dot style
        style={{
          translateX: magneticDotXSpring,
          translateY: magneticDotYSpring,
          width: '8px', // Smaller dot size
          height: '8px',
          x: '-50%', // Center dot
          y: '-50%',
        }}
      />
      {/* TODO: Add element for background reveal mask if using that method */}
    </>
  );
}
