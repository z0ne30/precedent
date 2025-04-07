// Reverted to Server Component
import "./globals.css";
import cx from "classnames";
import { sfPro, inter, orbitron } from "./fonts"; // Import orbitron
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import SessionProviderWrapper from "./components/providers/SessionProviderWrapper"; // Import NextAuth provider wrapper
import CustomCursor from "./components/CustomCursor"; // Import the custom cursor
import VantaBackground from './components/VantaBackground'; // Import the new VantaBackground

export const metadata = {
  title: "Personal Website & Blog",
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
  return (
    <SessionProviderWrapper>
      <html lang="en">
        {/* Revert body background to white */}
        <body className={cx(sfPro.variable, inter.variable, orbitron.variable, "relative bg-white")}>
          <div className="absolute inset-0 -z-10">
             <VantaBackground />
          </div>
          <CustomCursor /> 
          <div className="relative z-10 bg-transparent"> 
             {children}
          </div>
           <VercelAnalytics />
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
