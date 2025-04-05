'use client'; // Make this a client component

import Link from "next/link";
// Removed useState, FormEvent imports as form is moved
import { motion } from 'framer-motion'; // Import motion
import BackgroundSVG from './components/background'; // Import the background SVG component using relative path

export default function Home() {
  // Removed form state variables

  // Define colors (can be simplified if not needed for other elements)
  const backgroundColor = "bg-gray-900"; // Example dark grey
  const primaryTextColor = "text-white";
  const accentColor = "text-teal-400"; // Example teal
  // Removed unused button/input/status colors

  // Removed handleSubmit function

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
    hidden: { opacity: 0, y: 20 }, // Start hidden and slightly down
    visible: {
      opacity: 1,
      y: 0, // Animate to visible and original y position
      transition: {
        duration: 0.5, // Animation duration
        ease: "easeOut", // Animation easing
      },
    },
  };

  return (
    <div className={`relative flex min-h-screen flex-col items-center justify-center ${backgroundColor} ${primaryTextColor} p-8 overflow-hidden`}> {/* Added relative and overflow-hidden */}
      <BackgroundSVG /> {/* Render the background SVG */}
      {/* Main Content Area */}
      <motion.div
        className="z-10 w-full max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className={`text-4xl md:text-6xl font-bold mb-4 ${accentColor}`}
          variants={itemVariants}
        >
          My Portfolio
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-8 text-gray-300"
          variants={itemVariants}
        >
          Exploring technology and creativity.
        </motion.p>

        {/* Navigation Links */}
        <motion.nav
          className="mb-12 flex justify-center space-x-4 md:space-x-6"
          variants={itemVariants}
        >
          <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>GitHub</a>
          <a href="https://your-project.com" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Project Site</a>
          <a href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Twitter</a>
          <Link href="/blog" className={`hover:text-teal-300 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Blog</Link>
          {/* Added Contact link */}
          <Link href="/contact" className={`hover:text-teal-300 transition-colors transition-transform duration-200 hover:scale-110 inline-block`}>Contact</Link>
        </motion.nav>

        {/* Removed Contact Form Section */}
        {/* Optionally add a call to action linking to the contact page */}
        <motion.div className="mt-12" variants={itemVariants}>
          <Link href="/contact" className={`inline-block px-6 py-3 rounded-md ${"bg-teal-600"} ${"hover:bg-teal-700"} text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/30`}>
            Get In Touch
          </Link>
        </motion.div>
      </motion.div>

      {/* Optional: Footer or other elements can go here */}
    </div>
  );
}
