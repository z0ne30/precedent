'use client'; // Keep as client component for Cal pop-up initialization

import Link from 'next/link';
import { useEffect, useState } from 'react'; // Import useState
import { getCalApi } from "@calcom/embed-react"; // Import getCalApi
import ContactForm from '../components/ContactForm';

export default function ContactPage() {
  // State to track modal status (optional, but good practice)
  const [isCalModalOpen, setIsCalModalOpen] = useState(false);

  // Define colors consistent with theme
  const primaryTextColor = "text-gray-900"; // Use dark text for light background
  const accentColor = "text-teal-400";
  const buttonBgColor = "bg-teal-500";
  const buttonHoverBgColor = "hover:bg-teal-600";
  const buttonTextColor = "text-white";

  // Initialize Cal.com embed UI settings and add callbacks
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component
    let cal: any = null; // Variable to hold the cal instance for cleanup

    // Define callback functions
    const handleModalOpen = () => {
      console.log("DEBUG: handleModalOpen triggered!"); // <-- ADDED DEBUG LOG
      if (isMounted) setIsCalModalOpen(true);
      document.body.classList.add('cal-modal-open');
      console.log("DEBUG: Added 'cal-modal-open' class to body."); // <-- ADDED DEBUG LOG
    };

    const handleModalClose = () => {
      console.log("DEBUG: handleModalClose triggered!"); // <-- ADDED DEBUG LOG
      if (isMounted) setIsCalModalOpen(false);
      // Use requestAnimationFrame to delay removal slightly
      requestAnimationFrame(() => {
          document.body.classList.remove('cal-modal-open');
          console.log("DEBUG: Removed 'cal-modal-open' class from body."); // <-- ADDED DEBUG LOG
      });
    };

    (async function () {
      try {
        cal = await getCalApi(); // Assign to outer scope variable
        console.log("DEBUG: Cal API object obtained:", cal); // <-- ADDED DEBUG LOG
        if (!isMounted || !cal) return; // Check before using cal

        // Configure UI (without callbacks)
        cal("ui", {
          theme: "light",
          styles: { branding: { brandColor: "#2DD4BF" } },
          hideEventTypeDetails: false,
        });

        // Attempt to attach event listeners using .on() pattern
        console.log("DEBUG: Attempting to attach listeners using cal.on?. ..."); // <-- ADDED DEBUG LOG
        if (typeof cal.on === 'function') {
            console.log("DEBUG: cal.on method exists."); // <-- ADDED DEBUG LOG
            cal.on('modalOpen', handleModalOpen);
            cal.on('modalClose', handleModalClose);
            console.log("DEBUG: Attached listeners via cal.on."); // <-- ADDED DEBUG LOG
        } else {
            console.warn("DEBUG: cal.on method does not exist on Cal API object."); // <-- ADDED DEBUG LOG
            // Fallback or alternative method might be needed here if events don't fire.
        }

      } catch (error) {
          console.error("Failed to initialize Cal.com API:", error);
      }
    })();

    // Cleanup function
    return () => {
      isMounted = false;
      // Attempt to remove listeners using .off() pattern
      try {
        if (typeof cal?.off === 'function') {
            console.log("DEBUG: Attempting to remove listeners via cal.off?. ..."); // <-- ADDED DEBUG LOG
            cal.off('modalOpen', handleModalOpen);
            cal.off('modalClose', handleModalClose);
            console.log("DEBUG: Removed listeners via cal.off."); // <-- ADDED DEBUG LOG
        } else {
            console.warn("DEBUG: cal.off method does not exist."); // <-- ADDED DEBUG LOG
        }
      } catch (error) {
        console.warn("Could not remove Cal.com listeners:", error);
      }
      // Ensure class is removed if component unmounts while modal is open
      document.body.classList.remove('cal-modal-open');
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className={`flex min-h-screen flex-col items-center ${primaryTextColor} p-8`}>
      <div className="w-full max-w-3xl">
        <h1 className="font-orbitron text-5xl md:text-6xl text-teal-400 text-center mb-8 md:mb-10">Get In Touch</h1>

        {/* Centered Contact Form Container */}
        <div className="w-full max-w-md mx-auto mb-8">
           <ContactForm /> {/* ContactForm component */}
        </div>

        {/* Centered Cal.com Booking Button Container */}
        <div className="text-center mb-12"> {/* Add margin bottom */}
          <button
            data-cursor-magnetic // Add magnetic effect
            data-cal-link="enyu-rao"
            data-cal-config='{"theme":"light"}' // Ensure theme consistency
            className={`px-6 py-3 rounded-md ${buttonBgColor} ${buttonTextColor} ${buttonHoverBgColor} font-semibold transition-colors duration-200 shadow-md hover:shadow-lg inline-block`} // Use inline-block for centering via text-center
          >
            Book a Meeting
          </button>
        </div>

        {/* Link back to Home */}
        <div className="mt-12 text-center">
          <Link data-cursor-magnetic href="/" className={`hover:${accentColor} transition-colors text-lg`}>
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}