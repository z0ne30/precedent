'use client'; // Make this a client component

import Link from "next/link";
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
// Import Image from next/image for optimized image handling
import Image from 'next/image';
const ScramblingText = dynamic(() => import('./components/ScramblingText'), { ssr: false });

export default function Home() {
  const subtitles = ["drawn to the difficult things", "half a dev", "creative"];
  const primaryTextColor = "text-gray-900";
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
    // Main container - Reverted to justify-center, remains relative for footer positioning
    <div className={`relative flex min-h-screen flex-col items-center justify-center ${primaryTextColor} p-8 overflow-hidden`}>

      {/* Main Content Area */}
      <motion.div
        className="z-10 w-full max-w-5xl text-center" // Removed wrapper div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className={`font-orbitron text-5xl md:text-9xl font-bold mb-16 ${accentColor}`}
          variants={itemVariants}
        >
          Enyu Rao
        </motion.h1>
        <motion.div variants={itemVariants}>
          <ScramblingText
            texts={subtitles}
            interval={4000} // Change text every 3 seconds
            className="inline-block text-xl md:text-2xl mb-16 text-gray-600" // Adjust subtitle for light bg
          />
        </motion.div>

        {/* Navigation Links */}
        <motion.nav
          className="flex justify-center items-center space-x-4 md:space-x-6" // Added items-center
          variants={itemVariants}
        >
          {/* Standard Links - Apply new hover class */}
          <a data-cursor-magnetic href="https://launchyard.xyz" target="_blank" rel="noopener noreferrer" className="nav-link-hover-scale">Launch Yard</a>
          <a data-cursor-magnetic href="https://twitter.com/0xhappier" target="_blank" rel="noopener noreferrer" className="nav-link-hover-scale">Twitter</a>
          <Link data-cursor-magnetic href="/blog" className="nav-link-hover-scale">Blog</Link>
          {/* Responsive Contact Link - Apply new hover class */}
        </motion.nav>

      </motion.div> {/* Closing tag for main content motion.div */}
    </div> // Closing tag for main container div
  );
}
