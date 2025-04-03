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

// Optional: Generate static paths for better performance if needed
// export async function generateStaticParams() {
//   const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } });
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);

  // If post not found (or not published), trigger a 404 page
  if (!post) {
    notFound();
  }

  // TODO: Define colors consistent with theme
  const backgroundColor = "bg-gray-900";
  const primaryTextColor = "text-white";
  const accentColor = "text-teal-400";
  const metaTextColor = "text-gray-400";
  const tagColor = "bg-teal-700 text-teal-100";
  const contentTextColor = "text-gray-300"; // For post body

  return (
    <div className={`min-h-screen ${backgroundColor} ${primaryTextColor} p-8`}>
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/blog" className={`hover:${accentColor} transition-colors`}>
            &larr; Back to Blog
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-6">
          <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${accentColor}`}>
            {post.title}
          </h1>
          <div className={`text-sm ${metaTextColor} mb-4`}>
            Published on {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag.name} className={`text-xs font-medium px-2.5 py-0.5 rounded ${tagColor}`}>
                {tag.name}
              </span>
            ))}
          </div>
        </header>

        {/* Post Content */}
        {/* TODO: Render Markdown/Rich Text content appropriately */}
        {/* Apply Tailwind typography styles */}
        <article className={`prose prose-invert lg:prose-xl max-w-none ${contentTextColor}`}>
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </article>

      </div>
    </div>
  );
}