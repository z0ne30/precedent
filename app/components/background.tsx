// app/components/background.tsx

// Define props type to accept className and potentially others
interface BackgroundSVGProps {
  className?: string;
  // Add other props like baseOpacity, lineOpacity etc. if needed for variations
}

const BackgroundSVG = ({ className }: BackgroundSVGProps) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 1200 800"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    className={className} // Apply the passed className
    style={{
      // Keep essential positioning styles, opacity can be controlled via className or props now
      position: 'absolute',
      top: 0,
      left: 0,
      // zIndex: -1, // zIndex might be better controlled by parent container
      opacity: 0.3, // Default opacity, can be overridden by className
    }}
  >
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#14b8a6', stopOpacity: 0.8 }} /> {/* Teal-500 */}
        <stop offset="100%" style={{ stopColor: '#0d9488', stopOpacity: 0.6 }} /> {/* Teal-600 */}
      </linearGradient>
    </defs>

    {/* Subtle grid lines - Kept original grid for structure */}
    <g opacity="0.4"> {/* Increased grid opacity more */}
      <path d="M0 100 H1200 M0 200 H1200 M0 300 H1200 M0 400 H1200 M0 500 H1200 M0 600 H1200 M0 700 H1200" stroke="#FFFFFF" strokeWidth="0.5" />
      <path d="M100 0 V800 M200 0 V800 M300 0 V800 M400 0 V800 M500 0 V800 M600 0 V800 M700 0 V800 M800 0 V800 M900 0 V800 M1000 0 V800 M1100 0 V800" stroke="#FFFFFF" strokeWidth="0.5" />
    </g>

    {/* Interconnected Lines Network */}
    <g opacity="0.6" stroke="url(#tealGradient)" strokeWidth="1"> {/* Increased line opacity more */}
      {/* Lines remain the same as generated */}
      <line x1="50" y1="50" x2="300" y2="400" />
      <line x1="300" y1="400" x2="150" y2="700" />
      <line x1="150" y1="700" x2="500" y2="600" />
      <line x1="500" y1="600" x2="800" y2="750" />
      <line x1="800" y1="750" x2="1100" y2="500" />
      <line x1="1100" y1="500" x2="900" y2="200" />
      <line x1="900" y1="200" x2="600" y2="100" />
      <line x1="600" y1="100" x2="300" y2="400" />
      <line x1="50" y1="50" x2="600" y2="100" />
      <line x1="150" y1="700" x2="900" y2="200" />
      <line x1="500" y1="600" x2="1100" y2="500" />
      <line x1="800" y1="750" x2="400" y2="300" />
      <line x1="400" y1="300" x2="700" y2="500" />
      <line x1="700" y1="500" x2="1000" y2="150" />
      <line x1="1000" y1="150" x2="1150" y2="400" />
      <line x1="1150" y1="400" x2="950" y2="650" />
      <line x1="950" y1="650" x2="650" y2="780" />
      <line x1="650" y1="780" x2="250" y2="550" />
      <line x1="250" y1="550" x2="50" y2="250" />
      <line x1="50" y1="250" x2="400" y2="300" />
    </g>

    {/* Glowing Nodes */}
    <g fill="#14b8a6" filter="url(#glow)" opacity="0.8"> {/* Increased node opacity more */}
      {/* Nodes remain the same */}
      <circle cx="50" cy="50" r="4" />
      <circle cx="300" cy="400" r="5" />
      <circle cx="150" cy="700" r="3" />
      <circle cx="500" cy="600" r="4" />
      <circle cx="800" cy="750" r="5" />
      <circle cx="1100" cy="500" r="3" />
      <circle cx="900" cy="200" r="4" />
      <circle cx="600" cy="100" r="5" />
      <circle cx="400" cy="300" r="3" />
      <circle cx="700" cy="500" r="4" />
      <circle cx="1000" cy="150" r="5" />
      <circle cx="1150" cy="400" r="3" />
      <circle cx="950" cy="650" r="4" />
      <circle cx="650" cy="780" r="5" />
      <circle cx="250" cy="550" r="3" />
      <circle cx="50" cy="250" r="4" />
    </g>
  </svg>
);

export default BackgroundSVG;