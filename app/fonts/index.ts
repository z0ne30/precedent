import localFont from 'next/font/local';
import { Inter, Orbitron } from 'next/font/google'; // Import Orbitron

export const sfPro = localFont({
  src: './SF-Pro-Display-Medium.otf',
  variable: "--font-sf",
});

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
