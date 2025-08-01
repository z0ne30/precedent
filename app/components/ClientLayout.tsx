'use client'; // Mark as Client Component

import { useRef } from 'react';
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import VantaBackground from './VantaBackground';
// import ScrollAwareHeader from './ScrollAwareHeader'; // Removed
import Header from './Header'; // Import the updated Header
import ScrollAwareFooter from './ScrollAwareFooter';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null); // Ref for the footer sentinel

  return (
    // SessionProvider needs to be inside the Client Component boundary
    <SessionProviderWrapper>
      {/* Main container with flex column layout and min screen height */}
      {/* This div might not be strictly necessary if body handles flex, but provides clear structure */}
      <div className="flex flex-col min-h-screen">
        {/* Vanta Background */}
        <VantaBackground />

        {/* Removed Scrim Layer */}

        {/* Render the updated Header */}
        <Header />

        {/* Main Content Area */}
        {/* Needs relative and z-index to appear above background */}
        <main className="relative z-10 bg-transparent flex-grow">
          {children}
        </main>

        {/* Sentinel Element for Footer Intersection */}
        <div ref={sentinelRef} style={{ height: '1px' }} />

        {/* Scroll Aware Footer (conditionally renders based on intersection) */}
        <ScrollAwareFooter sentinelRef={sentinelRef} />
      </div>
    </SessionProviderWrapper>
  );
}
