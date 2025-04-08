'use client'; // Make it a client component for state and interactions

import Link from 'next/link';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icon Components (copied from ScrollAwareHeader) ---
const MenuIcon = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded z-50 text-teal-600 dark:text-teal-400" // Changed color, updated focus ring
    aria-label="Open menu"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

const CloseIcon = ({ onClick }: { onClick: () => void }) => (
   <button
    onClick={onClick}
    className="p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded z-50 text-teal-600 dark:text-teal-400" // Changed color, updated focus ring
    aria-label="Close menu"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);
// --- End Icon Components ---

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Animation variants for mobile overlay
  const overlayVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const mobileNavLinkClasses = "text-xl text-gray-700 dark:text-gray-300 transition-all duration-200 ease-out hover:scale-105 hover:text-teal-600 dark:hover:text-teal-400"; // Changed size to text-xl, kept hover effect

  return (
    <>
      {/* --- Hamburger Menu Button (Always Visible) --- */}
      {/* Render MenuIcon only when the menu is closed */}
      {!isMenuOpen && (
        <div className="fixed top-4 right-4 z-40"> {/* Ensure z-index is high enough */}
          <MenuIcon onClick={toggleMenu} />
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
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
            <div className="absolute top-4 right-4">
               <CloseIcon onClick={toggleMenu} />
            </div>
            <nav className="flex flex-col items-center space-y-6">
              <Link href="/" className={mobileNavLinkClasses} onClick={toggleMenu}>Home</Link>
              <Link href="/blog" className={mobileNavLinkClasses} onClick={toggleMenu}>Blog</Link>
              <Link href="/contact" className={mobileNavLinkClasses} onClick={toggleMenu}>Contact</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;