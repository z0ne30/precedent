import { Suspense } from "react";
import cx from "classnames";
// Removed Footer and Navbar imports
// Assuming fonts are applied in the root layout's body tag
// import { sfPro, inter } from "../fonts"; // Likely not needed here

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Removed fixed background div that was covering content */}
      {/* Suspense might be needed if Navbar had async parts, keeping it for now */}
      <Suspense fallback="...">
        {/* Navbar removed */}
      </Suspense>
      {/* Render children directly, allowing page to control its own layout */}
      {children}
      {/* Footer removed */}
    </>
  );
}