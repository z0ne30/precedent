import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { prisma } from '../../../lib/prisma'; // Import prisma client
import DeletePostButton from './DeletePostButton'; // Correct relative path

// TODO: Define colors consistent with theme
const backgroundColor = "bg-gray-900";
const primaryTextColor = "text-white";
const accentColor = "text-teal-400";
const cardBgColor = "bg-gray-800";

// Make component async to fetch data
export default async function AdminDashboardPage() {
  // Fetch all posts (published and drafts)
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' }, // Show recently updated first
    include: {
      tags: { select: { name: true } }, // Include tags if needed later
    },
  });
  return (
    <div className={`min-h-screen ${backgroundColor} ${primaryTextColor} p-8`}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${accentColor}`}>
            Admin Dashboard
          </h1>
          <UserButton afterSignOutUrl="/" /> {/* Allow sign out */}
        </header>

        <div className={`${cardBgColor} p-6 rounded-lg shadow-md`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
            <Link href="/admin/posts/new" className={`px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors`}>
              Create New Post
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3 uppercase text-sm font-semibold text-gray-400">Title</th>
                  <th className="text-left py-2 px-3 uppercase text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-2 px-3 uppercase text-sm font-semibold text-gray-400">Last Updated</th>
                  <th className="text-left py-2 px-3 uppercase text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-400">No posts found.</td>
                  </tr>
                )}
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-2 px-3">{post.title}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.published ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-400">{new Date(post.updatedAt).toLocaleString()}</td>
                    <td className="py-2 px-3 space-x-2">
                       <Link href={`/admin/posts/${post.id}/edit`} className={`text-xs ${accentColor} hover:underline`}>
                         Edit
                       </Link>
                       <DeletePostButton postId={post.id} postTitle={post.title} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-between">
             <Link href="/blog" className={`hover:${accentColor} transition-colors text-sm`}>
               View Public Blog
             </Link>
             <Link href="/" className={`hover:${accentColor} transition-colors text-sm`}>
               Back to Home
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}