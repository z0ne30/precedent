'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { useScrollDirection } from '@/lib/hooks/useScrollDirection'; // No longer needed
// import useMediaQuery from '@/lib/hooks/use-media-query'; // No longer needed for header logic

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
  // Remove scroll direction and media query hooks
  // const { scrollDirection, scrolledPastThreshold } = useScrollDirection(100);
  // const { isMobile } = useMediaQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Header visibility logic removed

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Remove desktop header variants

  // Animation variants for mobile overlay
  const overlayVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const navLinkClasses = "nav-link-hover-scale text-sm text-gray-700 dark:text-gray-300"; // Reusable link style

  return (
    <>
      {/* --- Always render fixed Menu Icon (Top Right) --- */}
      {/* Only render if menu is NOT open to prevent overlap with close button */}
      {!isMenuOpen && (
         <div className="fixed top-4 right-4 z-40 text-gray-800 dark:text-gray-200">
           <MenuIcon onClick={toggleMenu} />
         </div>
      )}
      {/* Removed desktop scroll-aware header logic */}

      {/* --- Mobile: Full-Screen Overlay Menu --- */}
      <AnimatePresence>
        {/* --- Full-Screen Overlay Menu (Mobile & Desktop) --- */}
        {/* Condition is now only based on isMenuOpen */}
        {isMenuOpen && (
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