import React from 'react';
import cx from 'classnames'; // Import classnames for conditional classes
// import { motion } from 'framer-motion'; // Remove motion import
import AnimatedPageWrapper from './AnimatedPageWrapper'; // Import the new client component
interface PageLayoutProps {
  children: React.ReactNode;
  title?: string; // Optional title prop
  className?: string; // Allow passing additional classes
}

// Removed animation variants - they are now in AnimatedPageWrapper

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, className }) => {
  return (
    <div className={cx("min-h-screen py-16 px-4 sm:px-6 lg:px-8", className)}>
      {/* Use the client component wrapper for animation */}
      <AnimatedPageWrapper className="max-w-5xl mx-auto">
        {/* Render title if provided */}
        {title && (
          <h1 className="font-orbitron text-4xl md:text-5xl text-teal-400 text-center mb-10 md:mb-12">
            {title}
          </h1>
        )}
        {/* Render page content */}
        <main>{children}</main>
      </AnimatedPageWrapper> {/* This closing tag should match the opening tag on line 17 */}
    </div>
  );
};

export default PageLayout;