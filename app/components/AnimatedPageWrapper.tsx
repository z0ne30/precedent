'use client'; // Mark as a Client Component

import { motion } from 'framer-motion';
import React from 'react';

// Define animation variants (copied from PageLayout)
const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface AnimatedPageWrapperProps {
  children: React.ReactNode;
  className?: string; // Allow passing className for layout consistency
}

const AnimatedPageWrapper: React.FC<AnimatedPageWrapperProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className} // Apply passed className
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPageWrapper;