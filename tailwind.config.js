/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        // display: ["var(--font-sf)", "system-ui", "sans-serif"], // Removed SF Pro display font
        default: ["var(--font-inter)", "system-ui", "sans-serif"], // Keep Inter for default
        orbitron: ["var(--font-orbitron)", "system-ui", "sans-serif"], // Add Orbitron
      },
      animation: {
        // Fade up and down
        "fade-up": "fade-up 0.5s",
        "fade-down": "fade-down 0.5s",
        // Tooltip
        "slide-up-fade": "slide-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        // Fade up and down
        "fade-up": {
          "0%": {
            opacity: 0,
            transform: "translateY(10px)",
          },
          "80%": {
            opacity: 0.6,
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: 0,
            transform: "translateY(-10px)",
          },
          "80%": {
            opacity: 0.6,
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
        // Tooltip
        "slide-up-fade": {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: 0, transform: "translateY(-6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      typography: ({ theme }) => ({
        DEFAULT: { // Targeting the default 'prose' class
          css: {
            '--tw-prose-body': theme('colors.gray[700]'), // Base text color
            '--tw-prose-headings': theme('colors.gray[900]'), // Heading color
            '--tw-prose-links': theme('colors.teal[600]'), // Link color
            '--tw-prose-bold': theme('colors.gray[900]'),
            '--tw-prose-counters': theme('colors.teal[500]'),
            '--tw-prose-bullets': theme('colors.teal[400]'),
            '--tw-prose-hr': theme('colors.gray[200]'),
            '--tw-prose-quotes': theme('colors.gray[600]'),
            '--tw-prose-quote-borders': theme('colors.teal[300]'),
            '--tw-prose-captions': theme('colors.gray[500]'),
            '--tw-prose-code': theme('colors.indigo[600]'), // Adjust code color if needed
            '--tw-prose-pre-code': theme('colors.indigo[900]'),
            '--tw-prose-pre-bg': theme('colors.gray[100]'), // Code block background
            '--tw-prose-th-borders': theme('colors.gray[300]'),
            '--tw-prose-td-borders': theme('colors.gray[200]'),

            // Link hover color (Tailwind prose doesn't have a direct variable, apply directly)
            'a': {
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: theme('colors.teal[700]'),
              },
            },
            // Paragraph spacing
            'p': {
              marginTop: '0.75em', // Add some top margin too
              marginBottom: '1.25em',
              lineHeight: '1.7',
            },
            // Heading margins (adjust as needed)
            'h1': {
              marginTop: '1.5em',
              marginBottom: '0.75em',
            },
            'h2': {
              marginTop: '1.25em',
              marginBottom: '0.6em',
            },
            'h3': {
              marginTop: '1em',
              marginBottom: '0.5em',
            },
            // Add more customizations if needed for other elements like lists, blockquotes etc.
          },
        },
        // Add specific overrides for dark mode (prose-invert)
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray[300]'), // Lighter body text for dark bg
            '--tw-prose-headings': theme('colors.gray[100]'), // Lighter headings
            '--tw-prose-links': theme('colors.teal[400]'), // Lighter teal links
            '--tw-prose-bold': theme('colors.gray[100]'),
            '--tw-prose-counters': theme('colors.teal[400]'),
            '--tw-prose-bullets': theme('colors.teal[500]'),
            '--tw-prose-hr': theme('colors.gray[700]'),
            '--tw-prose-quotes': theme('colors.gray[400]'),
            '--tw-prose-quote-borders': theme('colors.teal[700]'),
            '--tw-prose-captions': theme('colors.gray[400]'),
            '--tw-prose-code': theme('colors.indigo[400]'),
            '--tw-prose-pre-code': theme('colors.indigo[300]'),
            '--tw-prose-pre-bg': theme('colors.gray[800]'), // Darker code block background
            '--tw-prose-th-borders': theme('colors.gray[600]'),
            '--tw-prose-td-borders': theme('colors.gray[700]'),

            // Adjust link hover for dark mode if needed
            'a:hover': {
               color: theme('colors.teal[300]'),
            },
            // Ensure paragraph/heading styles from DEFAULT are inherited or re-apply if needed
          },
        },
        // You can add customizations for other prose variants like prose-lg here
      }),
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    plugin(({ addVariant }) => {
      addVariant("radix-side-top", '&[data-side="top"]');
      addVariant("radix-side-bottom", '&[data-side="bottom"]');
    }),
  ],
};
