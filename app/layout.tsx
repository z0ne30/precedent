// Server Component Root Layout
import "./globals.css";
import cx from "classnames";
import { ebGaramond } from "./fonts";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
// Import the new ClientLayout wrapper which handles client-side hooks and components
import ClientLayout from './components/ClientLayout';
import StructuredData from './components/StructuredData';
export const metadata = {
  title: "Enyu Rao - Personal Website & Portfolio",
  description: "Enyu Rao's personal website. Born under Wushan's peaks, crossed continents, carved paths across the Continental Divide. Magician at Orbit, chaser of uphill problems, el padrón of Launch Yard.",
  metadataBase: new URL("https://vibetest.vercel.app/"),
  keywords: [
    "Enyu Rao",
    "Enyu",
    "Rao",
    "personal website",
    "portfolio",
    "developer",
    "Launch Yard",
    "Orbit",
    "Continental Divide",
    "Wushan",
    "software engineer",
    "entrepreneur"
  ],
  authors: [{ name: "Enyu Rao" }],
  creator: "Enyu Rao",
  publisher: "Enyu Rao",
  openGraph: {
    title: "Enyu Rao - Personal Website & Portfolio",
    description: "Enyu Rao's personal website. Born under Wushan's peaks, crossed continents, carved paths across the Continental Divide. Magician at Orbit, chaser of uphill problems, el padrón of Launch Yard.",
    url: "https://vibetest.vercel.app/",
    siteName: "Enyu Rao",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enyu Rao - Personal Website & Portfolio",
    description: "Enyu Rao's personal website. Born under Wushan's peaks, crossed continents, carved paths across the Continental Divide.",
    creator: "@enyurao",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // You'll need to add this from Google Search Console
  },
};

// Metadata export remains here in the Server Component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Removed useRef and client-side structure
  return (
    // SessionProviderWrapper moved inside ClientLayout
    <html lang="en" className="h-full">
      {/* Added default text colors for light/dark modes */}
      <body className={cx(ebGaramond.variable, "relative bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 h-full")}>
        <StructuredData />
        {/* Render the ClientLayout which contains all client-side hooks and structure */}
        <ClientLayout>{children}</ClientLayout>
        <VercelAnalytics />
      </body>
    </html>
  );
}
