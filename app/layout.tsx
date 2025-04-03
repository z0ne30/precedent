// Reverted to Server Component
import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
// Removed Footer, Suspense, Navbar imports
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
// Removed usePathname import

export const metadata = {
  // TODO: Update with your actual project title
  title: "My Custom Project",
  // TODO: Update with your actual project description
  description: "A description of my custom project.",
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
    <ClerkProvider>
      <html lang="en">
        {/* Minimal body, only applying fonts and rendering children + analytics */}
        <body className={cx(sfPro.variable, inter.variable)}>
          {children}
          <VercelAnalytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
