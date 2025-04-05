import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // Use alias
import PostCard from '@/app/components/blog/PostCard'; // Import the new PostCard component

// Revalidate this page every X seconds (e.g., 60)
// Or use on-demand revalidation later
export const revalidate = 60;

async function getTags() {
  // Fetch all unique tags
  // Use prisma directly
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
    // Build an array of conditions for an explicit AND
    const whereConditions: any[] = [{ published: true }];

    // If a tag is selected, add its condition to the array
    if (selectedTag) {
      whereConditions.push({
        tags: {
          some: {
            name: selectedTag,
          },
        },
      });
    }

    // If a search query is provided, add its OR condition to the array
    if (searchQuery) {
      whereConditions.push({
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } }, // Case-insensitive search
          { content: { contains: searchQuery, mode: 'insensitive' } },
        ],
      });
    }

    // Log the final where clause for debugging
    console.log(">>> Prisma where clause:", JSON.stringify({ AND: whereConditions }, null, 2));

    const posts = await prisma.post.findMany({
      // Use the explicit AND condition
      where: { AND: whereConditions }, // This is the query being executed
      orderBy: { createdAt: 'desc' },
      include: {
        tags: {
          select: { name: true },
        },
      },
    });
    console.log(`>>> Found ${posts.length} posts.`); // Log the number of posts found
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
  // Add 'q' for search query
  searchParams?: { tag?: string; q?: string };
}) {
  const selectedTag = searchParams?.tag;
  const searchQuery = searchParams?.q;
  // Fetch posts based on selected tag and search query (if any)
  const posts = await getPosts(selectedTag, searchQuery);
  // Fetch all tags for the filter UI
  const tags = await getTags();

  // Define colors consistent with landing page theme (keep for page background/title)
  const backgroundColor = "bg-gray-900";
  const primaryTextColor = "text-white";
  const accentColor = "text-teal-400";
  const tagColor = "bg-teal-700 text-teal-100"; // Re-add for button styling
  // cardBgColor and tagColor are now handled within PostCard
  return (
    <div className={`min-h-screen ${backgroundColor} ${primaryTextColor} p-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-center ${accentColor}`}>
          Blog
        </h1>

        {/* Wrap search and filters in a form */}
        <form method="GET" action="/blog" className="mb-8 p-4 bg-gray-800 rounded-md flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Hidden input to persist tag filter during search */}
          {selectedTag && <input type="hidden" name="tag" value={selectedTag} />}

          {/* Search Input and Button */}
          <div className="flex-grow w-full md:w-1/2 flex gap-2">
             <label htmlFor="search" className="sr-only">Search Posts</label>
             <input
               name="q" // Name attribute for form submission
               type="search"
               id="search"
               placeholder="Search posts..."
               defaultValue={searchQuery || ''} // Pre-fill from URL
               className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
             />
             <button type="submit" className={`px-4 py-2 ${tagColor} rounded-md hover:opacity-90 transition-opacity whitespace-nowrap`}>
               Search
             </button>
          </div>

          {/* Tag Filtering Links */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
             <Link
               href="/blog"
               className={`text-sm px-3 py-1 rounded-full transition-colors ${
                 !selectedTag
                   ? 'bg-teal-500 text-white'
                   : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
               }`}
             >
               All Posts
             </Link>
            {tags.map((tag) => (
              <Link
                key={tag.name}
                // Preserve search query when clicking tags if needed, or clear it
                href={`/blog?tag=${encodeURIComponent(tag.name)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  selectedTag === tag.name
                    ? 'bg-teal-500 text-white' // Active tag style
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600' // Inactive tag style
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
            // Use the PostCard component
            <PostCard key={post.id} post={post} />
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