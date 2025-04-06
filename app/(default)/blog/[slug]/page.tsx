import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation'; // Import notFound
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

// Define the expected shape of the params
interface PageProps {
  params: {
    slug: string;
  };
}

// Revalidate this page every X seconds (e.g., 60) or use on-demand
export const revalidate = 60;

async function getPost(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
        published: true, // Ensure only published posts are accessible
      },
      include: {
        tags: {
          select: { name: true },
        },
      },
    });
    return post;
  } catch (error) {
    console.error(`Failed to fetch post with slug ${slug}:`, error);
    // Return null or throw error to indicate failure
    return null;
  }
}

// Generate static paths for published posts
export async function generateStaticParams() {
  // Need to import prisma here as well if using alias/relative path issues persist
  const { prisma } = await import('@/lib/prisma');
  try {
    const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for blog slugs:", error);
    return []; // Return empty array on error
  } finally {
    // Ensure disconnection in build environments
    await prisma.$disconnect().catch(console.error);
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);

  // If post not found (or not published), trigger a 404 page
  if (!post) {
    notFound();
  }

  // Define colors consistent with light theme
  const primaryTextColor = "text-gray-900"; // Dark text for light bg
  const accentColor = "text-teal-600"; // Darker teal for links
  const metaTextColor = "text-gray-500"; // Standard meta text color
  // Tag and content styles applied directly below

  return (
    <div className={`min-h-screen ${primaryTextColor} p-8`}>
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          {/* Apply link color */}
          <Link data-cursor-magnetic href="/blog" className={`text-gray-700 hover:${accentColor} transition-colors`}>
            &larr; Back to Blog
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-6">
          {/* Apply title color */}
          <h1 className={`text-4xl md:text-5xl font-bold mb-3 text-gray-900`}>
            {post.title}
          </h1>
          {/* Apply meta text color */}
          <div className={`text-sm ${metaTextColor} mb-4`}>
            Published on {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag.name} className={`text-xs font-medium px-2.5 py-0.5 rounded bg-teal-100 text-teal-900`}>
                {tag.name}
              </span>
            ))}
          </div>
        </header>

        {/* Post Content */}
        {/* Render Markdown content using Tailwind Typography plugin */}
        <article className={`prose lg:prose-xl max-w-none`}>
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </article>

      </div>
    </div>
  );
}