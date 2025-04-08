import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Site branding */}
          <div className="flex-shrink-0 mr-4">
            <Link href="/" className="font-orbitron text-xl font-bold text-gray-800 hover:text-teal-600 transition-colors">
              Enyu Rao
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="flex space-x-6">
            <Link href="/" className="nav-link-hover-scale">
              Home
            </Link>
            <Link href="/blog" className="nav-link-hover-scale">
              Blog
            </Link>
            <Link href="/contact" className="nav-link-hover-scale">
              Contact
            </Link>
            {/* Add other links like Projects here later */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;