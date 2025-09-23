'use client';

import Link from 'next/link';
import { useEffect, useState, FormEvent } from 'react';
import { getCalApi } from "@calcom/embed-react";

export default function ContactPage() {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // State for submission status and feedback
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Initialize Cal.com embed
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi();
        cal("ui", {
          theme: "light",
          styles: { branding: { brandColor: "#14b8a6" } },
          hideEventTypeDetails: false,
        });
      } catch (error) {
        console.error("Failed to initialize Cal.com API:", error);
      }
    })();
  }, []);

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
    <div className="relative min-h-screen flex flex-col items-center justify-center text-gray-900 p-8">
      {/* Main Content */}
      <div className="z-10 w-full max-w-2xl text-center space-y-8">
        {/* Cal.com Booking Button */}
        <div className="mb-8 w-full max-w-md mx-auto">
          <button
            data-cal-link="enyu-rao"
            data-cal-config='{"theme":"light"}'
            className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
          >
            Book a meeting :)
          </button>
        </div>

        {/* Contact Form - Always Visible */}
        <div className="w-full max-w-md mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="form-input"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="form-input"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Got a rec or just want to say hi?"
                  className="form-input"
                ></textarea>
              </div>
              <div>
                <button
                  data-cursor-magnetic
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn btn-primary w-full"
                >
                  {status === 'loading' ? 'Sending...' : 'Send'}
                </button>
              </div>
              <div className="mt-4 h-5">
                <p
                  className={`text-sm text-center transition-opacity duration-300 ease-in-out ${
                    status === 'success' ? 'text-green-600' : 'text-red-600'
                  } ${feedbackMessage ? 'opacity-100' : 'opacity-0'}`}
                  aria-live="polite"
                >
                  {feedbackMessage || '\u00A0'}
                </p>
              </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-12">
          <Link 
            href="/" 
            className="text-teal-600 hover:text-teal-700 underline decoration-2 underline-offset-4 transition-colors duration-200"
          >
            ← Back
          </Link>
        </div>
      </div>
    </div>
  );
}
