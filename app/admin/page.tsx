'use client'; // This needs to be a Client Component to manage state and use hooks

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react'; // Import NextAuth hooks
import { Post } from '@prisma/client'; // Assuming Post type is available
import PostList from '@/app/components/admin/PostList'; // Import PostList
import PostEditor from '@/app/components/admin/PostEditor'; // Import PostEditor

// Define a type for the partial post data needed for the list
type PostListItem = Pick<Post, 'id' | 'title' | 'updatedAt'>;

export default function AdminDashboardPage() {
  const { data: session, status } = useSession(); // Get session status
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(false); // Rename isLoading to avoid conflict

  // Callback to refresh the post list - only fetch if authenticated
  const fetchPosts = useCallback(async () => {
    if (status !== 'authenticated') return; // Don't fetch if not logged in
    setIsPostsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/posts');
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data: PostListItem[] = await response.json();
      setPosts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsPostsLoading(false);
    }
  }, [status]); // Add status as a dependency

  // Fetch posts when authenticated status changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetchPosts();
    } else {
      // Clear posts if user logs out
      setPosts([]);
      setSelectedPostId(null);
      setError(null);
    }
  }, [status, fetchPosts]); // Depend on status and fetchPosts

  const handleSelectPost = (id: number) => {
    setSelectedPostId(id);
  };

  // Handler to refresh list after update/delete in editor
  const handlePostUpdate = () => {
    // Deselect post if it was deleted? Optional, depends on desired UX.
    // setSelectedPostId(null);
    if (status === 'authenticated') {
      fetchPosts(); // Re-fetch the list only if authenticated
    }
  };

  // Handle different session statuses
  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen"><p>Loading session...</p></div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="mb-4">Please sign in to access the admin dashboard.</p>
        <button
          onClick={() => signIn('google')} // Trigger Google sign-in
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  // Render dashboard only if authenticated
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Panel: Post List */}
      {/* Left Panel: Post List */}
      <div className="w-1/4 h-full overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Posts</h2>
          {/* Add Sign Out Button */}
          <button
            onClick={() => signOut()}
            className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
        {isPostsLoading && <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!isPostsLoading && !error && (
          <PostList
            posts={posts}
            selectedPostId={selectedPostId}
            onSelectPost={handleSelectPost}
          />
        )}
        {/* Spacer to push user info down if needed, or integrate differently */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
           <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
             Signed in as: {session?.user?.email}
           </p>
        </div>
      </div>

      {/* Right Panel: Post Editor */}
      <div className="flex-1 h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-850"> {/* Slightly different bg */}
        <PostEditor postId={selectedPostId} onPostUpdate={handlePostUpdate} />
      </div>
    </div>
  );
}