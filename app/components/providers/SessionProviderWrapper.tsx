'use client'; // This component needs to be a client component

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface SessionProviderWrapperProps {
  children: React.ReactNode;
  // We don't pass the session here; SessionProvider fetches it
}

export default function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
  // The SessionProvider component fetches the session state
  return <SessionProvider>{children}</SessionProvider>;
}