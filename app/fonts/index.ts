import { EB_Garamond } from 'next/font/google';

export const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Include various weights
});

// Keep a secondary font for potential accent use
export const inter = EB_Garamond({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Use EB Garamond for headings as well
export const orbitron = EB_Garamond({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
