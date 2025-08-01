'use client';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Enyu Rao",
    "givenName": "Enyu",
    "familyName": "Rao",
    "url": "https://vibetest.vercel.app/",
    "sameAs": [
      // Add your social media profiles here
      "https://github.com/z0ne30",
      "https://linkedin.com/in/enyurao",
      "https://twitter.com/enyurao"
    ],
    "jobTitle": "Software Engineer",
    "worksFor": [
      {
        "@type": "Organization",
        "name": "Orbit"
      },
      {
        "@type": "Organization", 
        "name": "Launch Yard"
      }
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Your University" // Update with your actual education
    },
    "birthPlace": {
      "@type": "Place",
      "name": "Wushan, China"
    },
    "nationality": "Chinese-American",
    "description": "Software engineer and entrepreneur. Born under Wushan's peaks, crossed continents, carved paths across the Continental Divide. Magician at Orbit, chaser of uphill problems, el padrón of Launch Yard.",
    "knowsAbout": [
      "Software Engineering",
      "Web Development", 
      "Entrepreneurship",
      "Mountain Climbing",
      "Continental Divide Trail"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Software Engineer",
      "occupationLocation": {
        "@type": "Place",
        "name": "United States"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
