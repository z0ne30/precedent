// Reverted to Server Component
import "./globals.css";
import cx from "classnames";
import { sfPro, inter, orbitron } from "./fonts"; // Import orbitron
// Removed Footer, Suspense, Navbar imports
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
// import { ClerkProvider } from "@clerk/nextjs"; // Remove ClerkProvider import
import SessionProviderWrapper from "./components/providers/SessionProviderWrapper"; // Import NextAuth provider wrapper
import CustomCursor from "./components/CustomCursor"; // Import the custom cursor
// Removed usePathname import

export const metadata = {
  // Updated project title based on spec
  title: "Personal Website & Blog",
  // Updated project description based on spec
  description: "A personal website featuring a landing page and integrated blog.",
  // TODO: Update with your actual deployment URL if applicable
  // metadataBase: new URL("https://yourdomain.com"),
};

// Restore async if needed, but likely not required for this minimal layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Removed pathname logic
  return (
    <SessionProviderWrapper>
      <html lang="en">
        {/* Minimal body, only applying fonts and rendering children + analytics */}
        <body className={cx(sfPro.variable, inter.variable, orbitron.variable)}> {/* Add orbitron variable */}
          <CustomCursor /> {/* Add the custom cursor component */}
          {children}
          <VercelAnalytics />
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
