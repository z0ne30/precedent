'use client'; // Required for hover state, animations, and Tooltip

import Link from 'next/link';
import { Post, Tag } from '@prisma/client';
import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';

// Define the expected post structure, including tags
interface PostWithTags extends Post {
  tags: Pick<Tag, 'name'>[];
}

interface PostCardProps {
  post: PostWithTags;
}

// Utility function to generate a simple excerpt
function generateExcerpt(content: string, maxLength: number = 150): string {
  // Remove Markdown images and simple formatting for cleaner excerpt
  let cleanContent = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove Markdown images
    .replace(/[`*_{}[\]()#+\-.!]/g, ''); // Remove common Markdown chars

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  // Find the last space within the maxLength
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

// Consistent date formatting
function formatDate(date: Date): string {
   return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PostCard({ post }: PostCardProps) {
  const excerpt = generateExcerpt(post.content);
  // Colors removed - using direct Tailwind classes based on STYLE_GUIDE.md

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.article
            className={`bg-white border border-gray-200 p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg`}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href={`/blog/${post.slug}`} className="block group">
              <h2 className={`text-2xl font-semibold mb-2 text-gray-900 group-hover:text-teal-600 transition-colors duration-200`}>
                {post.title}
              </h2>
            </Link>
            <div className={`text-sm text-gray-500 mb-3`}>
              Published on {formatDate(new Date(post.createdAt))}
            </div>
            {/* Display a short part of the excerpt directly on the card */}
            <p className={`text-gray-700 mb-4 text-sm leading-relaxed`}>
              {generateExcerpt(post.content, 80)} {/* Shorter version for card */}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto"> {/* mt-auto pushes tags down */}
              {post.tags.map((tag) => (
                <span key={tag.name} className={`text-xs font-medium px-2.5 py-0.5 rounded bg-teal-100 text-teal-900`}>
                  {tag.name}
                </span>
              ))}
            </div>
          </motion.article>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            className="max-w-xs p-3 bg-white text-gray-700 text-sm rounded-md shadow-lg border border-gray-200 z-50"
            side="top" // Show tooltip above the card
          >
            {excerpt}
            <Tooltip.Arrow className="fill-white" /> {/* Match tooltip background */}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}