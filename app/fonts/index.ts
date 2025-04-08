// Removed localFont import and sfPro definition
import { Inter, Orbitron } from 'next/font/google'; // Import Orbitron

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

// Configure Orbitron
export const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '700'], // Include weights needed (e.g., 700 for bold heading)
});
