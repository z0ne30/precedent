'use client'; // Make this a client component

import Link from "next/link";
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const ScramblingText = dynamic(() => import('./components/ScramblingText'), { ssr: false });
const ImageCarousel = dynamic(() => import('./components/ImageCarousel'), { ssr: false });

export default function Home() {
  const subtitles = [
    "| magician @ orbit",
    "| chaser of uphill problems",
    "| half-baked dev",
    "| el padrón of launch yard",
  ];

  // Gallery images from public/images/gallery/
  const galleryImages = [
    "/images/gallery/IMG_0042.jpeg",
    "/images/gallery/IMG_1021.JPG",
    "/images/gallery/IMG_24762889ED43-1.jpeg",
    "/images/gallery/IMG_4622.JPG",
    "/images/gallery/IMG_4AD58C67FF41-1.jpeg",
    "/images/gallery/IMG_8850A80FF71E-1.jpeg",
    "/images/gallery/IMG_BEDD9C9B5774-1.jpeg",
    "/images/gallery/JPEG image.jpeg",
    "/images/gallery/launchyard.3.27.25.svb.aa-11.jpg",
    "/images/gallery/image.png",
    "/images/gallery/image1.png",
  ];
  const primaryTextColor = "text-gray-900";
  const accentColor = "text-teal-400";

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Stagger delay between children
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className={`relative flex min-h-screen flex-col ${primaryTextColor} p-8 overflow-hidden`}>
      {/* Main Content Area */}
      <motion.div
        className="z-10 w-full max-w-4xl mx-auto mt-16 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Name and Scrambling text on same line */}
        <motion.div className="flex flex-row items-baseline gap-2 md:gap-4 max-w-3xl mx-auto" variants={itemVariants}>
          <div className={`text-2xl md:text-3xl font-bold ${accentColor}`}>
            Enyu Rao
          </div>
          <div className="whitespace-nowrap">
            <ScramblingText
              texts={subtitles}
              interval={3000}
              className="text-lg text-gray-600 font-serif"
            />
          </div>
        </motion.div>

        {/* Bio content */}
        <motion.div className="space-y-6 text-left max-w-3xl mx-auto" variants={itemVariants}>
          <p className="text-base leading-relaxed">
            I was born <strong>thrice</strong>—
          </p>
          
          <p className="text-base leading-relaxed">
            <em>first</em> under Wushan(巫山)&apos;s mist-veiled peaks,
          </p>
          
          <p className="text-base leading-relaxed">
            <em>again</em> in 2011 after crossing an ocean and an entire continent to the States
          </p>
          
          <p className="text-base leading-relaxed">
            <em>and then</em> in 2016, carving a thirty-day line across the Continental Divide.
          </p>
          
          <p className="text-base leading-relaxed mt-8 font-bold">
            Mountains keep re-writing my DNA: the best views demand altitude and stubborn legs.
          </p>
        </motion.div>

        {/* Image carousel */}
        <motion.div 
          className="w-full max-w-3xl mx-auto my-12"
          variants={itemVariants}
        >
          <ImageCarousel 
            images={galleryImages}
            className="shadow-lg"
          />
        </motion.div>

        {/* More bio content */}
        <motion.div className="space-y-6 text-left max-w-3xl mx-auto" variants={itemVariants}>
          <p className="text-base leading-relaxed">
            I court stubborn riddles—code that bites back, communities that need kindling, ideas that wear a size too large. Since childhood I&apos;ve wrestled them into shape.
          </p>
          
          <p className="text-base leading-relaxed">
            <strong>&quot;Why not?&quot;</strong> usually beats <strong>&quot;Why?&quot;</strong> in my playbook.
          </p>
          
          <p className="text-base leading-relaxed mt-8">
            I live on good music, stories, company—<em>and if they don&apos;t dance, well, they&apos;re no friends of mine.</em>
          </p>
        </motion.div>

        {/* Get in touch button */}
        <motion.div className="pt-8 pb-32 max-w-3xl mx-auto" variants={itemVariants}>
          <Link 
            href="/contact" 
            className="inline-block text-base underline decoration-2 underline-offset-4 hover:text-teal-600 transition-colors duration-200 font-medium"
          >
            get in touch
          </Link>
          <span className="text-base text-gray-600 ml-2">& send me a book/song rec!</span>
        </motion.div>

      </motion.div>
    </div>
  );
}
