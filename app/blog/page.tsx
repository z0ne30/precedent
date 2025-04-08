import Link from 'next/link';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import PostCard from '@/app/components/blog/PostCard';
import PageLayout from '@/app/components/PageLayout'; // Use consistent layout
import BlogSearchControls from './BlogSearchControls'; // Client component for controls
import PaginationControls from './PaginationControls'; // Client component for pagination

// Define types for fetched data
import { Post, Tag } from '@prisma/client';
type PostWithTags = Post & { tags: Pick<Tag, 'name'>[] };

// --- Server-Side Data Fetching ---

const POSTS_PER_PAGE = 6; // Define how many posts per page

interface BlogData {
  posts: PostWithTags[];
  allTags: Pick<Tag, 'name'>[];
  currentPage: number;
  totalPages: number;
}

async function getBlogData(searchParams: { [key: string]: string | string[] | undefined }): Promise<BlogData> {
  const query = searchParams?.q as string || '';
  const tag = searchParams?.tag as string || undefined;
  const page = parseInt(searchParams?.page as string || '1', 10);
  const limit = POSTS_PER_PAGE;
  const skip = (page - 1) * limit;

  // Base where clause for published posts
  const whereClause: any = { published: true };

  // Add search query conditions
  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { content: { contains: query, mode: 'insensitive' } },
      // Optional: search tags as well?
      // { tags: { some: { name: { contains: query, mode: 'insensitive' } } } }
    ];
  }

  // Add tag filter condition
  if (tag) {
    whereClause.tags = { some: { name: tag } };
  }

  try {
    // Fetch posts and total count in parallel
    const [posts, totalPosts, allTags] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        include: { tags: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
      }),
      prisma.post.count({ where: whereClause }),
      prisma.tag.findMany({
        select: { name: true },
        orderBy: { name: 'asc' },
      })
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    return { posts, allTags, currentPage: page, totalPages };

  } catch (error) {
    console.error("Failed to fetch blog data:", error);
    // Return empty state on error, rely on error.tsx for boundary
    return { posts: [], allTags: [], currentPage: 1, totalPages: 1 };
  }
}

// --- Components ---

// Loading component (can be moved to loading.tsx)
function LoadingSkeleton() {
  // Basic loading text, replace with actual skeleton UI later
  return <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading posts...</p>;
}

// Component to render the list and pagination
async function PostListRenderer({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
   const { posts, currentPage, totalPages } = await getBlogData(searchParams); // Fetch only posts/pagination here

   if (posts.length === 0) {
     return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No posts found matching your criteria.</p>;
   }

   return (
     <>
       {/* Posts Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
         {posts.map((post) => (
           <PostCard key={post.id} post={post} />
         ))}
       </div>
       {/* Pagination */}
       <PaginationControls currentPage={currentPage} totalPages={totalPages} />
     </>
   );
}

// --- Page Component ---

// Make the page component async to fetch data
export default async function BlogPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

  // Fetch tags separately for the controls (could be combined in getBlogData if preferred)
  const allTags = await prisma.tag.findMany({
      select: { name: true },
      orderBy: { name: 'asc' },
    }).catch(err => {
      console.error("Failed to fetch tags for controls:", err);
      return [];
    });

  const currentQuery = searchParams?.q as string || '';
  const currentTag = searchParams?.tag as string || undefined;

  return (
    <PageLayout title="Blog">
       {/* Search and Filter Controls (Client Component) */}
       <BlogSearchControls allTags={allTags} currentQuery={currentQuery} currentTag={currentTag} />

       {/* Post List and Pagination (Server Component with Suspense) */}
       <Suspense fallback={<LoadingSkeleton />}>
         <PostListRenderer searchParams={searchParams} />
       </Suspense>

       {/* Removed Back to Home link - handled by global Header */}
    </PageLayout>
  );
}