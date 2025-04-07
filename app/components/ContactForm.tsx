'use client'; // This component needs state and event handlers

import { useState, FormEvent } from 'react';

export default function ContactForm() {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // State for submission status and feedback
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Define colors (could be passed as props or use context/theme later)
  // Light theme colors
  const primaryTextColor = "text-gray-900"; // Dark text for inputs/form
  const labelTextColor = "text-gray-700";   // Slightly lighter for labels
  const accentColor = "text-teal-500";      // Adjusted accent for light bg
  const buttonBgColor = "bg-teal-600";
  const buttonHoverBgColor = "hover:bg-teal-700";
  const buttonTextColor = "text-white";     // Keep button text white
  const inputBgColor = "bg-white";          // White input background
  const inputBorderColor = "border-gray-300"; // Lighter border
  const successColor = "text-green-600";    // Darker green for light bg
  const errorColor = "text-red-600";        // Darker red for light bg

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    <div className="w-full max-w-md mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Contact Me</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium ${labelTextColor} mb-1 text-left`}>Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
        </div>
        <div>
          <label htmlFor="email" className={`block text-sm font-medium ${labelTextColor} mb-1 text-left`}>Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
        </div>
        <div>
          <label htmlFor="message" className={`block text-sm font-medium ${labelTextColor} mb-1 text-left`}>Message</label>
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
          ></textarea>
        </div>
        <div>
          <button
            data-cursor-magnetic // Add attribute
            type="submit"
            disabled={status === 'loading'}
            className={`w-full py-2 px-4 ${buttonBgColor} ${buttonTextColor} font-semibold rounded-md ${buttonHoverBgColor} transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </div>
        {feedbackMessage && (
          <p className={`mt-4 text-sm text-center ${status === 'success' ? successColor : errorColor}`}>
            {feedbackMessage}
          </p>
        )}
      </form>
    </div>
  );
}