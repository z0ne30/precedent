'use client'; // Make this a client component

import Link from "next/link";
import { useState, useEffect } from 'react'; // Add useState, useEffect
// Removed duplicate Link import
import { motion } from 'framer-motion'; // Remove AnimatePresence import
import BackgroundSVG from './components/background'; // Import the background SVG component using relative path
// import ScramblingText from './components/ScramblingText'; // TEMP: Comment out

export default function Home() {
  // State for cycling text
  const subtitles = ["Full-Stack Developer", "UI/UX Enthusiast", "Lifelong Learner"];
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(subtitles[0]); // State for displayed text
  const interval = 3000; // ms

  // Effect to cycle through subtitles
  useEffect(() => {
    const timer = setInterval(() => {
      setSubtitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
    }, interval);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitles.length, interval]); // Dependencies for cycling

  // Effect for scrambling animation
  useEffect(() => {
    const targetText = subtitles[subtitleIndex];
    let currentText = displayedText;
    // let animationFrameId: number; // Removed unused variable
    let scrambleIntervalId: NodeJS.Timeout | null = null;
    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
    const scrambleSpeed = 80; // ms between character updates
    const revealSpeed = 1; // How many correct chars to reveal per interval

    const updateText = () => {
      let nextText = '';
      let correctCharsCount = 0;
      for (let i = 0; i < targetText.length; i++) {
        if (i < currentText.length && currentText[i] === targetText[i]) {
           correctCharsCount++;
        }
        // Decide if char should be correct or scrambled
        const shouldBeCorrect = correctCharsCount >= i - revealSpeed; // Reveal progressively

        if (shouldBeCorrect && i < targetText.length) {
          nextText += targetText[i];
        } else {
          nextText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }
       // Trim or pad if lengths differ significantly during transition (optional)
       if (nextText.length > targetText.length) {
           nextText = nextText.slice(0, targetText.length);
       }

      setDisplayedText(nextText);
      currentText = nextText; // Update currentText for next iteration

      if (nextText === targetText) {
        if (scrambleIntervalId) clearInterval(scrambleIntervalId);
      }
    };

    // Clear previous interval if index changes quickly
    if (scrambleIntervalId) clearInterval(scrambleIntervalId);
    scrambleIntervalId = setInterval(updateText, scrambleSpeed);

    // Cleanup function
    return () => {
      if (scrambleIntervalId) clearInterval(scrambleIntervalId);
      // if (animationFrameId) cancelAnimationFrame(animationFrameId); // Removed line using unassigned variable
    };
    // Run when target text changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitleIndex, subtitles]);

  // Define colors
  const backgroundColor = "bg-gray-900";
  const primaryTextColor = "text-white";
  const accentColor = "text-teal-400";

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger delay between children
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Removed slideTextVariants and slideTextTransition

  return (
    // Main container
    <div className={`relative flex min-h-screen flex-col items-center justify-center ${backgroundColor} ${primaryTextColor} p-8 overflow-hidden`}>

      {/* Container for SVG layers */}
      <div className="absolute inset-0 z-0">
        {/* Base subtle background */}
        <BackgroundSVG />
        {/* Brighter reveal layer - initially masked */}
        <BackgroundSVG
          className="cursor-reveal-layer" // Class for CSS targeting
          // Optionally pass props to make this version brighter/different if needed
        />
      </div> {/* Closing tag for SVG container */}

      {/* Main Content Area - Animated */}
      <motion.div
        className="z-10 w-full max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Heading */}
        <motion.h1
          className={`font-orbitron text-4xl md:text-6xl font-bold mb-8 ${accentColor}`}
          variants={itemVariants}
        >
          Enyu Rao
        </motion.h1>

        {/* Animated Subtitle */}
        {/* Wrapper div for fixed height and overflow hidden */}
        <motion.div
          variants={itemVariants} // Still use itemVariants for initial entrance
          className="h-8 md:h-10 mb-16" // Keep wrapper for height consistency, remove overflow
        >
          {/* Render the displayedText state */}
          <span className="text-lg md:text-xl text-gray-300">
            {displayedText}
          </span>
        </motion.div>

        {/* Navigation Links */}
        <motion.nav
          className="mb-16 flex justify-center space-x-4 md:space-x-6" // Increased margin
          variants={itemVariants}
        >
          {/* Added back missing links and removed magnetic attributes */}
          <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>GitHub</a>
          <a href="https://your-project.com" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Project Site</a>
          <a href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Twitter</a>
          <Link href="/blog" className={`hover:text-teal-300 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Blog</Link>
          <Link href="/contact" className={`hover:text-teal-300 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Contact</Link>
        </motion.nav>

      </motion.div> {/* Closing tag for main content motion.div */}

      {/* Optional: Footer or other elements can go here */}

    </div> // Closing tag for main container div
  );
}
