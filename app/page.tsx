'use client'; // Make this a client component

import Link from "next/link";
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
// Import Image from next/image for optimized image handling
import Image from 'next/image';
const ScramblingText = dynamic(() => import('./components/ScramblingText'), { ssr: false });

export default function Home() {
  const subtitles = ["drawn to the difficult things", "half a dev", "perpetual learner"];
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
          <a data-cursor-magnetic href="https://www.linkedin.com/in/enyu-rao/" target="_blank" rel="noopener noreferrer" className="nav-link-hover-scale">LinkedIn</a>
          <a data-cursor-magnetic href="https://twitter.com/0xhappier" target="_blank" rel="noopener noreferrer" className="nav-link-hover-scale">Twitter</a>
          <Link data-cursor-magnetic href="/blog" className="nav-link-hover-scale">Blog</Link>
          {/* Responsive Contact Link - Apply new hover class */}
          <Link data-cursor-magnetic href="/contact" className="nav-link-hover-scale hidden md:inline-block">Contact</Link>
        </motion.nav>

      </motion.div> {/* Closing tag for main content motion.div */}

      {/* Contact Link for Mobile (Positioned relative to main content) */}
      <motion.div
        className="md:hidden mt-16 text-center w-full" // Show only on mobile, add margin, center text, full width for centering
        variants={itemVariants} // Apply animation variants
      >
        <Link data-cursor-magnetic href="/contact" className="nav-link-hover-scale">Contact</Link> {/* Apply new hover class */}
      </motion.div>

      {/* Spotify Link (Footer) - Absolutely Positioned */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 w-full flex justify-center"> {/* Absolute positioning */}
        <a
          data-cursor-magnetic
          href="https://open.spotify.com/user/nathan.rao2000?" // Using the originally provided URL
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-75 hover:opacity-100 transition-opacity duration-200" // Added hover effect
          aria-label="Spotify Profile" // Accessibility
        >
          {/* Using Next.js Image component for optimization, pointing to external SVG */}
          {/* Note: External image URLs need to be configured in next.config.js */}
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" // Example external SVG URL
            alt="Spotify Logo"
            width={28} // Set width (corresponds to h-7)
            height={28} // Set height (corresponds to w-7)
            className="filter hover:brightness-110" // Optional: slight brightness change on hover
          />
        </a>
      </div>
    </div> // Closing tag for main container div
  );
}
