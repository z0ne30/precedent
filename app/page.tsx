'use client'; // Make this a client component

import Link from "next/link";
import { useState, FormEvent } from 'react'; // Import useState and FormEvent

export default function Home() {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // State for submission status and feedback
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // TODO: Replace with actual abstract vector graphic as subtle background
  // For now, using a dark background color based on the spec.
  const backgroundColor = "bg-gray-900"; // Example dark grey
  const primaryTextColor = "text-white";
  const accentColor = "text-teal-400"; // Example teal
  const buttonBgColor = "bg-teal-600";
  const buttonHoverBgColor = "hover:bg-teal-700";
  const inputBgColor = "bg-gray-800";
  const inputBorderColor = "border-gray-700";
  const successColor = "text-green-400";
  const errorColor = "text-red-400";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setStatus('loading');
    setFeedbackMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setFeedbackMessage(result.message || 'Submission successful!');
        // Clear form fields
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setFeedbackMessage(result.error || 'An error occurred during submission.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setStatus('error');
      setFeedbackMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center ${backgroundColor} ${primaryTextColor} p-8`}>
      {/* Main Content Area */}
      <div className="z-10 w-full max-w-4xl text-center">
        {/* TODO: Update Your Name / Brand */}
        <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${accentColor}`}>
          Your Name / Brand
        </h1>
        {/* TODO: Update Tagline */}
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Short tagline or introduction about yourself or your work. Modern, tech-focused.
        </p>

        {/* Navigation Links */}
        <nav className="mb-12 flex justify-center space-x-4 md:space-x-6">
          {/* TODO: Update GitHub URL */}
          <a href="YOUR_GITHUB_URL" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors`}>GitHub</a>
          {/* TODO: Update Project Site URL */}
          <a href="YOUR_PROJECT_SITE_URL" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors`}>Project Site</a>
          {/* TODO: Update Twitter URL */}
          <a href="YOUR_TWITTER_URL" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors`}>Twitter</a>
          <Link href="/blog" className={`hover:text-teal-300 transition-colors`}>Blog</Link>
        </nav>

        {/* Contact Form Section */}
        <div className="w-full max-w-md mx-auto bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Contact Me</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1 text-left">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={name} // Controlled component
                onChange={(e) => setName(e.target.value)} // Update state on change
                className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 text-left">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email} // Controlled component
                onChange={(e) => setEmail(e.target.value)} // Update state on change
                className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1 text-left">Message</label>
              <textarea
                name="message"
                id="message"
                rows={4}
                required
                value={message} // Controlled component
                onChange={(e) => setMessage(e.target.value)} // Update state on change
                className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                disabled={status === 'loading'} // Disable button while loading
                className={`w-full py-2 px-4 ${buttonBgColor} ${primaryTextColor} font-semibold rounded-md ${buttonHoverBgColor} transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            {/* Feedback Message Area */}
            {feedbackMessage && (
              <p className={`mt-4 text-sm text-center ${status === 'success' ? successColor : errorColor}`}>
                {feedbackMessage}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Optional: Footer or other elements can go here */}
    </div>
  );
}
