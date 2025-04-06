import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // Use alias path
import { notFound } from 'next/navigation';
import EditPostForm from './EditPostForm'; // Client component for the form

// Define the expected shape of the params
interface PageProps {
  params: {
    id: string;
  };
}

async function getPost(id: number) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: { select: { name: true } }, // Fetch tag names
      },
    });
    return post;
  } catch (error) {
    console.error(`Failed to fetch post with id ${id}:`, error);
    return null;
  }
}

export default async function EditPostPage({ params }: PageProps) {
  const postId = parseInt(params.id, 10);

  if (isNaN(postId)) {
    notFound(); // Invalid ID format
  }

  const post = await getPost(postId);

  if (!post) {
    notFound(); // Post not found
  }

  // TODO: Define colors consistent with theme
  const backgroundColor = "bg-gray-900";
  const primaryTextColor = "text-white";
  const accentColor = "text-teal-400";

  return (
    <div className={`min-h-screen ${backgroundColor} ${primaryTextColor} p-8`}>
      <div className="max-w-3xl mx-auto">
         <div className="mb-6">
           <Link data-cursor-magnetic href="/admin" className={`hover:${accentColor} transition-colors text-sm`}>
             &larr; Back to Admin Dashboard
           </Link>
         </div>
        <h1 className={`text-3xl font-bold mb-6 ${accentColor}`}>Edit Post</h1>
        {/* Pass fetched post data to the client component form */}
        <EditPostForm post={post} />
      </div>
    </div>
  );
}