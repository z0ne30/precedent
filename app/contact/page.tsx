import Link from 'next/link';
import ContactForm from '../components/ContactForm'; // Import the new component

export default function ContactPage() {
  // Define colors consistent with theme
  const backgroundColor = "bg-gray-900";
  const primaryTextColor = "text-white";
  const accentColor = "text-teal-400";

  return (
    <div className={`flex min-h-screen flex-col items-center ${backgroundColor} ${primaryTextColor} p-8`}>
      <div className="w-full max-w-4xl">
        <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-center ${accentColor}`}>
          Contact Us
        </h1>
        <ContactForm />
         {/* Link back to Home */}
         <div className="mt-12 text-center">
           <Link href="/" className={`hover:${accentColor} transition-colors`}>
             &larr; Back to Home
           </Link>
         </div>
      </div>
    </div>
  );
}