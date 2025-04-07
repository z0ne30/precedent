import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // Use alias
import PostCard from '@/app/components/blog/PostCard'; // Import the new PostCard component

// Revalidate this page every X seconds (e.g., 60)
// Or use on-demand revalidation later
export const revalidate = 60;

async function getTags() {
  // Fetch all unique tags
  try {
    const tags = await prisma.tag.findMany({
      select: { name: true },
      orderBy: { name: 'asc' },
    });
    return tags;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}

// Accept searchQuery parameter
async function getPosts(selectedTag?: string, searchQuery?: string) {
  // Use prisma directly
  try {
    const whereConditions: any[] = [{ published: true }];

    if (selectedTag) {
      whereConditions.push({
        tags: {
          some: {
            name: selectedTag,
          },
        },
      });
    }

    if (searchQuery) {
      whereConditions.push({
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { content: { contains: searchQuery, mode: 'insensitive' } },
        ],
      });
    }

    const posts = await prisma.post.findMany({
      where: { AND: whereConditions },
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
    return [];
  }
}

// Update component signature to accept searchParams
export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { tag?: string; q?: string };
}) {
  const selectedTag = searchParams?.tag;
  const searchQuery = searchParams?.q;
  const posts = await getPosts(selectedTag, searchQuery);
  const tags = await getTags();

  // Define colors consistent with light theme
  const primaryTextColor = "text-gray-900";
  const accentColor = "text-teal-600";

  return (
    // Apply light theme text color
    <div className={`min-h-screen ${primaryTextColor} p-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-center ${accentColor}`}>
          Blog
        </h1>

        {/* Wrap search and filters in a form */}
        {/* Adjust form background for light theme */}
        <form method="GET" action="/blog" className="mb-8 p-4 bg-gray-100 rounded-md flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-200">
          {/* Hidden input to persist tag filter during search */}
          {selectedTag && <input type="hidden" name="tag" value={selectedTag} />}

          {/* Search Input and Button */}
          <div className="flex-grow w-full md:w-1/2 flex gap-2">
             <label htmlFor="search" className="sr-only">Search Posts</label>
             <input
               name="q"
               type="search"
               id="search"
               placeholder="Search posts..."
               defaultValue={searchQuery || ''}
               // Apply Input Field Style
               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900"
             />
             {/* Apply Primary Action Button Style */}
             <button type="submit" className={`px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors whitespace-nowrap`}>
               Search
             </button>
          </div>

          {/* Tag Filtering Links */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
             <Link
               data-cursor-magnetic
               href="/blog"
               // Style for "All Posts" tag link
               className={`text-sm px-3 py-1 rounded-full transition-colors border ${
                 !selectedTag
                   ? 'bg-teal-500 text-white border-teal-500' // Active style
                   : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' // Inactive style
               }`}
             >
               All Posts
             </Link>
            {tags.map((tag) => (
              <Link
                data-cursor-magnetic
                key={tag.name}
                href={`/blog?tag=${encodeURIComponent(tag.name)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                // Style for individual tag links
                className={`text-sm px-3 py-1 rounded-full transition-colors border ${
                  selectedTag === tag.name
                    ? 'bg-teal-500 text-white border-teal-500' // Active style
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' // Inactive style
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </form> {/* End of form */}

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length === 0 && (
            <p className="text-center text-gray-400">No posts published yet.</p>
          )}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
         {/* Link back to Home */}
         <div className="mt-12 text-center">
           <Link data-cursor-magnetic href="/" className={`hover:${accentColor} transition-colors`}>
             &larr; Back to Home
           </Link>
         </div>
      </div>
    </div>
  );
}