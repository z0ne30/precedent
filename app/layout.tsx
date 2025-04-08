// Server Component Root Layout
import "./globals.css";
import cx from "classnames";
import { inter, orbitron } from "./fonts";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
// Import the new ClientLayout wrapper which handles client-side hooks and components
import ClientLayout from './components/ClientLayout';
export const metadata = {
  title: "my digital garden",
  description: "this is a continuous vibe test on capabilities of code gen AI",
  metadataBase: new URL("https://vibetest.vercel.app/"),
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
      <body className={cx(inter.variable, orbitron.variable, "relative bg-white dark:bg-gray-900 h-full")}>
        {/* Render the ClientLayout which contains all client-side hooks and structure */}
        <ClientLayout>{children}</ClientLayout>
        <VercelAnalytics />
      </body>
    </html>
  );
}
