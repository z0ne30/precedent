'use client';

import React, { RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useIntersectionObserver from '@/lib/use-intersection-observer'; // Updated path
import Link from 'next/link';
import Image from 'next/image';

interface ScrollAwareFooterProps {
  sentinelRef: RefObject<Element>; // Ref to the element marking the end of content
}

const ScrollAwareFooter: React.FC<ScrollAwareFooterProps> = ({ sentinelRef }) => {
  const entry = useIntersectionObserver(sentinelRef, { threshold: 0.1 }); // Trigger when 10% visible
  const isVisible = entry?.isIntersecting;

  const footerVariants = {
    hidden: { y: '50%', opacity: 0 },
    visible: { y: '0%', opacity: 1 },
  };

  const currentYear = new Date().getFullYear();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.footer
          key="scroll-footer"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={footerVariants}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          // Use fixed positioning at the bottom
          className="fixed bottom-0 left-0 right-0 z-20"
        >
          {/* Add a subtle background/padding */}
          <div className="w-full py-3 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              {/* Copyright */}
              <div>
                &copy; {currentYear} Enyu Rao.
              </div>

              {/* Social Links */}
              <div className="flex space-x-3 mt-2 sm:mt-0 items-center">
                <a
                  href="https://www.linkedin.com/in/enyu-rao/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  LinkedIn
                </a>
                <a
                  href="https://twitter.com/0xhappier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  aria-label="Twitter Profile"
                >
                  Twitter
                </a>
                <a
                  href="https://open.spotify.com/user/nathan.rao2000?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-75 hover:opacity-100 transition-opacity duration-200 flex items-center hover:text-teal-600 dark:hover:text-teal-400"
                  aria-label="Spotify Profile"
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
                    alt="Spotify Logo"
                    width={16}
                    height={16}
                    className="filter hover:brightness-110 mr-1"
                  />
                </a>
              </div>
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  );
};

export default ScrollAwareFooter;
