import Link from 'next/link';
// Import removed from top level

// Revalidate this page every X seconds (e.g., 60)
// Or use on-demand revalidation later
export const revalidate = 60;

async function getPosts() {
  // Import and instantiate prisma client within the function scope
  const { prisma } = await import('../../lib/prisma');
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        tags: {
          select: { name: true },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch posts for blog page:", error);
    // Return empty array or handle error appropriately
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  // TODO: Define colors consistent with landing page theme
  const backgroundColor = "bg-gray-900";
  const primaryTextColor = "text-white";
  const accentColor = "text-teal-400";
  const cardBgColor = "bg-gray-800";
  const tagColor = "bg-teal-700 text-teal-100";

  return (
    <div className={`min-h-screen ${backgroundColor} ${primaryTextColor} p-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-center ${accentColor}`}>
          Blog
        </h1>

        {/* Filtering and Search UI Placeholders */}
        <div className="mb-8 p-4 bg-gray-800 rounded-md flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-grow w-full md:w-auto">
            <label htmlFor="search" className="sr-only">Search Posts</label>
            <input
              type="search"
              id="search"
              placeholder="Search posts..."
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              // TODO: Add state and onChange handler for search
            />
          </div>
          <div className="text-gray-400 w-full md:w-auto text-center md:text-left">
            [Tag Filtering Placeholder]
            {/* TODO: Implement tag fetching and filtering UI */}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length === 0 && (
            <p className="text-center text-gray-400">No posts published yet.</p>
          )}
          {posts.map((post) => (
            <article key={post.id} className={`${cardBgColor} p-6 rounded-lg shadow-md`}>
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`} className={`hover:${accentColor} transition-colors`}>
                  {post.title}
                </Link>
              </h2>
              <div className="text-sm text-gray-400 mb-3">
                Published on {new Date(post.createdAt).toLocaleDateString()}
              </div>
              {/* TODO: Add post excerpt/snippet here if desired */}
              {/* <p className="text-gray-300 mb-4">Post snippet...</p> */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag.name} className={`text-xs font-medium px-2.5 py-0.5 rounded ${tagColor}`}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
         {/* Link back to Home */}
         <div className="mt-12 text-center">
           <Link href="/" className={`hover:${accentColor} transition-colors`}>
             &larr; Back to Home
           </Link>
         </div>
      </div>
    </div>
  );
}