import Link from "next/link";

export default function Home() {
  // TODO: Replace with actual abstract vector graphic as subtle background
  // For now, using a dark background color based on the spec.
  const backgroundColor = "bg-gray-900"; // Example dark grey
  const primaryTextColor = "text-white";
  const accentColor = "text-teal-400"; // Example teal
  const buttonBgColor = "bg-teal-600";
  const buttonHoverBgColor = "hover:bg-teal-700";
  const inputBgColor = "bg-gray-800";
  const inputBorderColor = "border-gray-700";

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center ${backgroundColor} ${primaryTextColor} p-8`}>
      {/* Main Content Area */}
      <div className="z-10 w-full max-w-4xl text-center">
        <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${accentColor}`}>
          Your Name / Brand
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Short tagline or introduction about yourself or your work. Modern, tech-focused.
        </p>

        {/* Navigation Links */}
        <nav className="mb-12 flex justify-center space-x-4 md:space-x-6">
          <a href="YOUR_GITHUB_URL" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors`}>GitHub</a>
          <a href="YOUR_PROJECT_SITE_URL" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors`}>Project Site</a>
          <a href="YOUR_TWITTER_URL" target="_blank" rel="noopener noreferrer" className={`hover:text-teal-300 transition-colors`}>Twitter</a>
          <Link href="/blog" className={`hover:text-teal-300 transition-colors`}>Blog</Link>
        </nav>

        {/* Contact Form Section */}
        <div className="w-full max-w-md mx-auto bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Contact Me</h2>
          {/* TODO: Implement form submission logic (serverless function + Vercel KV) */}
          <form action="#" method="POST" className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea
                name="message"
                id="message"
                rows={4}
                required
                className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className={`w-full py-2 px-4 ${buttonBgColor} ${primaryTextColor} font-semibold rounded-md ${buttonHoverBgColor} transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Optional: Footer or other elements can go here */}
    </div>
  );
}
