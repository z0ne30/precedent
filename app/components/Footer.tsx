import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // For Spotify icon

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 mt-16 border-t border-gray-200">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
        {/* Copyright */}
        <div>
          &copy; {currentYear} Enyu Rao. All rights reserved.
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a
            href="https://www.linkedin.com/in/enyu-rao/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-600 transition-colors"
            aria-label="LinkedIn Profile"
          >
            LinkedIn
          </a>
          <a
            href="https://twitter.com/0xhappier"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-600 transition-colors"
            aria-label="Twitter Profile"
          >
            Twitter
          </a>
          <a
            href="https://open.spotify.com/user/nathan.rao2000?"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-75 hover:opacity-100 transition-opacity duration-200 flex items-center hover:text-teal-600"
            aria-label="Spotify Profile"
          >
            {/* Using Next.js Image component for optimization */}
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
              alt="Spotify Logo"
              width={20} // Slightly smaller for footer
              height={20}
              className="filter hover:brightness-110 mr-1" // Add margin if needed
            />
             Spotify
          </a>
          {/* Add other links like GitHub if desired */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;