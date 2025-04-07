'use client'; // Make this a client component

import Link from "next/link";
import { useState, useEffect } from 'react'; // Add useState, useEffect
// Removed duplicate Link import
import { motion } from 'framer-motion'; // Remove AnimatePresence import
// import BackgroundSVG from './components/background'; // Removed - Handled by layout
// Import ScramblingText dynamically
import dynamic from 'next/dynamic';
const ScramblingText = dynamic(() => import('./components/ScramblingText'), { ssr: false });

export default function Home() {
  // State for cycling text
  const subtitles = ["drawn to the difficult things", "half a dev", "perpetual learner"];
  // Removed manual scramble state and effects  

  // Define colors
  // const backgroundColor = "bg-gray-900"; // Remove page-specific background
  const primaryTextColor = "text-gray-900"; // Set text for light background
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


  return (
    // Main container
    <div className={`relative flex min-h-screen flex-col items-center justify-center ${primaryTextColor} p-8 overflow-hidden`}>

      <motion.div
        className="z-10 w-full max-w-5xl text-center"
        // Increased max-width
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Heading */}
        <motion.h1
          className={`font-orbitron text-5xl md:text-9xl font-bold mb-16 ${accentColor}`}
          // Increased size and margin
          variants={itemVariants}
        >
          Enyu Rao
        </motion.h1>

        {/* Animated Subtitle */}
        {/* Wrapper div for fixed height and overflow hidden */}
        {/* Animated Subtitle using ScramblingText component */}
        <motion.div variants={itemVariants}> {/* Wrapper for entrance animation */}
          <ScramblingText
            texts={subtitles}
            interval={4000} // Change text every 3 seconds
            className="inline-block text-xl md:text-2xl mb-16 text-gray-600" // Adjust subtitle for light bg
          />
        </motion.div>

        {/* Navigation Links */}
        <motion.nav
          className="flex justify-center space-x-4 md:space-x-6" // Increased margin
          variants={itemVariants}
        >
          {/* Adjust link colors for light bg */}
          <a data-cursor-magnetic href="https://launchyard.xyz" target="_blank" rel="noopener noreferrer" className={`text-gray-700 hover:text-teal-600 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Launch Yard</a>
          <a data-cursor-magnetic href="https://www.linkedin.com/in/enyu-rao/" target="_blank" rel="noopener noreferrer" className={`text-gray-700 hover:text-teal-600 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>LinkedIn</a>
          <a data-cursor-magnetic href="https://twitter.com/0xhappier" target="_blank" rel="noopener noreferrer" className={`text-gray-700 hover:text-teal-600 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Twitter</a>
          <Link data-cursor-magnetic href="/blog" className={`text-gray-700 hover:text-teal-600 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Blog</Link>
          <Link data-cursor-magnetic href="/contact" className={`text-gray-700 hover:text-teal-600 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Contact</Link>
        </motion.nav>

      </motion.div> {/* Closing tag for main content motion.div */}

      {/* Optional: Footer or other elements can go here */}

    </div> // Closing tag for main container div
  );
}
