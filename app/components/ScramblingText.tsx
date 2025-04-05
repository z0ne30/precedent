'use client';

import React, { useState, useEffect } from 'react';
import { useScramble } from 'use-scramble'; // Import the hook

interface ScramblingTextProps {
  texts: string[];
  interval?: number; // Time in ms between text changes
  className?: string; // Allow passing Tailwind classes
}

const ScramblingText: React.FC<ScramblingTextProps> = ({
  texts,
  interval = 3000, // Default to 3 seconds (adjust as needed)
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Effect to cycle through texts
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);

  // Use the useScramble hook with configuration based on docs
  const { ref, replay } = useScramble({
    text: texts[currentIndex],
    // --- Configuration Options (Adjust as desired) ---
    speed: 0.5,       // Animation speed (0-1, lower is faster)
    tick: 1,          // Frames per character step
    step: 1,          // Characters added per tick
    scramble: 12,     // How many times each char scrambles
    seed: 2,          // Seed for random scrambling pattern
    chance: 0.8,      // Chance a character will scramble per frame (0-1)
    range: [65, 122], // Character code range (A-Z, a-z) - adjust if needed
    overdrive: false, // Don't replace with underscores first
    overflow: false,  // Prevent text overflow during animation
    playOnMount: true, // Start animation immediately
    ignore: [' '],    // Keep spaces static during scramble
    // onAnimationStart: () => console.log('Scramble Start'),
    // onAnimationEnd: () => console.log('Scramble End'),
  });

  // Extract the current text to satisfy exhaustive-deps
  const currentText = texts[currentIndex];

  // Replay the animation when the target text changes
  useEffect(() => {
    // Ensure replay is called after the state update has likely rendered
    const timeoutId = setTimeout(() => {
        replay();
    }, 50); // Small delay might help ensure text prop is updated
    return () => clearTimeout(timeoutId);
  }, [currentText, replay]); // Use the extracted variable

  return (
    <span ref={ref} className={className}>
      {/* Hook controls the content */}
    </span>
  );
};

export default ScramblingText;