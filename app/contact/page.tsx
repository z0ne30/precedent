import Link from 'next/link';
import ContactForm from '../components/ContactForm'; // Import the new component

export default function ContactPage() {
  // Define colors consistent with theme
  // const backgroundColor = "bg-gray-900"; // Removed - Handled by layout
  const primaryTextColor = "text-gray-900"; // Use dark text for light background
  const accentColor = "text-teal-400";

  return (
    <div className={`flex min-h-screen flex-col items-center ${primaryTextColor} p-8`}>
      <div className="w-full max-w-4xl">
        <ContactForm />
         {/* Link back to Home */}
         <div className="mt-12 text-center">
           <Link data-cursor-magnetic href="/" className={`hover:${accentColor} transition-colors`}>
             &larr; Back to Home
           </Link>
         </div>
      </div>
    </div>
  );
}