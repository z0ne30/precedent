import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation'; // Import notFound
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import PageLayout from '@/app/components/PageLayout'; // Import PageLayout

// Define the expected shape of the params
interface PageProps {
  params: {
    slug: string;
  };
}

// Revalidate this page every X seconds (e.g., 60) or use on-demand
// This ensures the page is regenerated periodically
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

// Generate static paths for published posts (with logging from debug attempt)
export async function generateStaticParams() {
  // Check if DATABASE_URL is accessible in the build environment
  console.log(`[generateStaticParams] DATABASE_URL accessible: ${!!process.env.DATABASE_URL}`);
  console.log("[generateStaticParams] Attempting to generate...");
  // Need to import prisma here as well if using alias/relative path issues persist
  const { prisma } = await import('@/lib/prisma');
  try {
    console.log("[generateStaticParams] Prisma imported. Fetching posts...");
    const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } });
    console.log(`[generateStaticParams] Fetched ${posts.length} posts.`);
    const paths = posts.map((post) => ({
      slug: post.slug,
    }));
    console.log("[generateStaticParams] Paths generated:", paths);
    return paths;
  } catch (error) {
    // Log the specific error object for more details
    console.error("[generateStaticParams] ERROR fetching posts:", error);
    return []; // Return empty array on error
  } finally {
    try {
      console.log("[generateStaticParams] Disconnecting Prisma...");
      await prisma.$disconnect();
      console.log("[generateStaticParams] Prisma disconnected.");
    } catch (disconnectError) {
      console.error("[generateStaticParams] ERROR disconnecting Prisma:", disconnectError);
    }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);

  // If post not found (or not published), trigger a 404 page
  if (!post) {
    notFound();
  }

  // Define colors consistent with light theme (can be removed if relying solely on prose/global styles)
  const metaTextColor = "text-gray-500"; // Standard meta text color

  return (
    // Use PageLayout for consistent padding and max-width
    <PageLayout>
      {/* Removed "Back to Blog" link as Header provides navigation */}

      {/* Post Header */}
      <header className="mb-6">
        {/* Apply title color */}
        <h1 className={`text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-gray-100`}> {/* Added dark mode text */}
          {post.title}
        </h1>
        {/* Apply meta text color */}
        <div className={`text-sm ${metaTextColor} dark:text-gray-400 mb-4`}> {/* Added dark mode text */}
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag.name} className={`text-xs font-medium px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 dark:bg-teal-800 dark:text-teal-100`}> {/* Added dark mode styles */}
              {tag.name}
            </span>
          ))}
        </div>
      </header>

      {/* Render Markdown content using Tailwind Typography plugin - Add top margin */}
      <article className={`prose dark:prose-invert lg:prose-xl max-w-none mt-8`}> {/* ADDED mt-8 */}
        <ReactMarkdown>
          {post.content}
        </ReactMarkdown>
      </article>

    </PageLayout>
  );
}