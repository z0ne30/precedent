'use client'; // Mark as Client Component

import { useRef } from 'react';
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import CustomCursor from "./CustomCursor";
import VantaBackground from './VantaBackground';
import ScrollAwareHeader from './ScrollAwareHeader';
import ScrollAwareFooter from './ScrollAwareFooter';
import ParallaxBackgroundWrapper from './ParallaxBackgroundWrapper';

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
        {/* Parallax Background Wrapper */}
        <ParallaxBackgroundWrapper factor={-0.1}>
          <VantaBackground />
        </ParallaxBackgroundWrapper>

        {/* Scrim Layer for Content Readability */}
        <div className="absolute inset-0 z-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm pointer-events-none" />

        {/* Custom Cursor */}
        <CustomCursor />

        {/* Scroll Aware Header (conditionally renders based on scroll/breakpoint) */}
        <ScrollAwareHeader />

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