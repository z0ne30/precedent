'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import useMediaQuery from '@/lib/hooks/use-media-query'; // Assuming this hook exists and works

// Simple Hamburger Icon component
const MenuIcon = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="p-2 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded z-50" // Ensure button is clickable
    aria-label="Open menu"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

// Simple Close Icon component
const CloseIcon = ({ onClick }: { onClick: () => void }) => (
   <button
    onClick={onClick}
    className="p-2 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded z-50" // Ensure button is clickable
    aria-label="Close menu"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);


export default function ScrollAwareHeader() {
  const { scrollDirection, scrolledPastThreshold } = useScrollDirection(100); // Threshold of 100px
  const { isMobile } = useMediaQuery(); // Use the media query hook
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine header visibility for desktop scroll-aware version
  const showDesktopHeader = scrollDirection === 'up' && scrolledPastThreshold;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Animation variants for desktop header
  const headerVariants = {
    hidden: { y: '-100%', opacity: 0 },
    visible: { y: '0%', opacity: 1 },
  };

  // Animation variants for mobile overlay
  const overlayVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const navLinkClasses = "nav-link-hover-scale text-sm text-gray-700 dark:text-gray-300"; // Reusable link style

  return (
    <>
      {isMobile ? (
        // --- Mobile: Fixed Menu Icon ---
        <div className="fixed top-4 right-4 z-40 text-gray-800 dark:text-gray-200">
          <MenuIcon onClick={toggleMenu} />
        </div>
      ) : (
        // --- Desktop: Scroll-Aware Header ---
        <AnimatePresence>
          {showDesktopHeader && (
            <motion.header
              key="desktop-header"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={headerVariants}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 left-0 right-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm"
            >
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  {/* Site branding (optional here, could be just nav) */}
                   <Link href="/" className="font-orbitron text-xl font-bold text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                     Enyu Rao
                   </Link>
                  {/* Desktop navigation */}
                  <nav className="flex space-x-6">
                    <Link href="/" className={navLinkClasses}>Home</Link>
                    <Link href="/blog" className={navLinkClasses}>Blog</Link>
                    {/* <Link href="/projects" className={navLinkClasses}>Projects</Link> */}
                    <Link href="/contact" className={navLinkClasses}>Contact</Link>
                  </nav>
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>
      )}

      {/* --- Mobile: Full-Screen Overlay Menu --- */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="absolute top-4 right-4 text-gray-800 dark:text-gray-200">
               <CloseIcon onClick={toggleMenu} />
            </div>
            <nav className="flex flex-col items-center space-y-6">
              <Link href="/" className={navLinkClasses + " text-lg"} onClick={toggleMenu}>Home</Link>
              <Link href="/blog" className={navLinkClasses + " text-lg"} onClick={toggleMenu}>Blog</Link>
              {/* <Link href="/projects" className={navLinkClasses + " text-lg"} onClick={toggleMenu}>Projects</Link> */}
              <Link href="/contact" className={navLinkClasses + " text-lg"} onClick={toggleMenu}>Contact</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}