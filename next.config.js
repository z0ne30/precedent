// Configure Bundle Analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com", "vercel.com"],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.com *.vercel-analytics.com *.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' *.vercel.com *.vercel-analytics.com *.vercel-insights.com; frame-src 'self';"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/z0ne30",
        permanent: false,
      },
      {
        source: "/linkedin",
        destination: "https://www.linkedin.com/in/enyu-rao/",
        permanent: false,
      },
      {
        source: "/x",
        destination: "https://x.com/0xhappier?s=21",
        permanent: false,
      },
      {
        source: "/launchyard",
        destination: "https://launchyard.xyz/",
        permanent: false,
      },
      {
        source: "/orbit",
        destination: "https://www.orbit.engineering/",
        permanent: false,
      },
    ];
  },
};

// Wrap the config with the analyzer
module.exports = withBundleAnalyzer(nextConfig);
