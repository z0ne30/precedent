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

  // Removed local color variables, styles are now in globals.css
  // Keep success/error colors for feedback message
  const successColor = "text-green-600";
  const errorColor = "text-red-600";
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
    <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-lg shadow-lg"> {/* Removed mx-auto */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="form-label">Name</label> {/* Use form-label class */}
          <input
            type="text"
            name="name"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input" // Use form-input class
          />
        </div>
        <div>
          <label htmlFor="email" className="form-label">Email</label> {/* Use form-label class */}
          <input
            type="email"
            name="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input" // Use form-input class
          />
        </div>
        <div>
          <label htmlFor="message" className="form-label">Message</label> {/* Use form-label class */}
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-input" // Use form-input class
          ></textarea>
        </div>
        <div>
          <button
            data-cursor-magnetic // Add attribute
            type="submit"
            disabled={status === 'loading'}
            // Use btn and btn-primary classes, keep w-full and disabled states
            className="btn btn-primary w-full"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </div>
        {/* Container to prevent layout shift and apply transition */}
        <div className="mt-4 h-5"> {/* Fixed height container */}
          <p
            className={`text-sm text-center transition-opacity duration-300 ease-in-out ${
              status === 'success' ? successColor : errorColor
            } ${feedbackMessage ? 'opacity-100' : 'opacity-0'}`}
            // Use aria-live for accessibility on status messages
            aria-live="polite"
          >
            {/* Render message or non-breaking space to maintain height */}
            {feedbackMessage || '\u00A0'}
          </p>
        </div>
      </form>
    </div>
  );
}