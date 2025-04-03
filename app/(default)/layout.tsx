import { Suspense } from "react";
import cx from "classnames";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
// Assuming fonts are still accessible via relative path or alias from here
// If not, adjust the import path as needed
import { sfPro, inter } from "../fonts"; // Adjust path if necessary

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // We apply the font variables here if they weren't applied in the root body
    // If they *are* applied in the root body, this className might not be needed
    // className={cx(sfPro.variable, inter.variable)}
    <>
      {/* Background gradient from original root layout */}
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
      <Suspense fallback="...">
        {/* Using alias path for components, assuming it resolves correctly from this level */}
        <Navbar />
      </Suspense>
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        {children}
      </main>
      <Footer />
    </>
  );
}