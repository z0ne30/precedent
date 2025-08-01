'use client';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Enyu Rao",
    "givenName": "Enyu",
    "familyName": "Rao",
    "url": "https://enyurao.com/",
    "sameAs": [
      "https://enyurao.xyz/",
      "https://github.com/z0ne30",
      "https://linkedin.com/in/enyurao",
      "https://twitter.com/enyurao"
    ],
    "jobTitle": ["Chief of Staff", "Founder"],
    "worksFor": [
      {
        "@type": "Organization",
        "name": "Orbit",
        "jobTitle": "Chief of Staff"
      },
      {
        "@type": "Organization", 
        "name": "Launch Yard",
        "jobTitle": "Founder"
      }
    ],
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "Babson College"
      },
      {
        "@type": "EducationalOrganization",
        "name": "University of St.Gallen"
      }
    ],
    "hasOccupation": [
      {
        "@type": "Occupation",
        "name": "Chief of Staff at Orbit",
        "occupationLocation": {
          "@type": "Place",
          "name": "United States"
        }
      },
      {
        "@type": "Occupation",
        "name": "Founder of Launch Yard",
        "occupationLocation": {
          "@type": "Place",
          "name": "United States"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
