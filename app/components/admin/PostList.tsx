import Link from 'next/link';
import { Post } from '@prisma/client';

// Define the type for the items expected in the list
type PostListItem = Pick<Post, 'id' | 'title' | 'updatedAt'>;

interface PostListProps {
  posts: PostListItem[];
  selectedPostId: number | null;
  onSelectPost: (id: number) => void;
}

// Helper function for relative time formatting
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const secondsInWeek = 604800;
  const secondsInMonth = 2629800; // Approximate
  const secondsInYear = 31557600; // Approximate

  if (diffInSeconds < secondsInMinute) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < secondsInHour) {
    return rtf.format(-Math.floor(diffInSeconds / secondsInMinute), 'minute');
  } else if (diffInSeconds < secondsInDay) {
    return rtf.format(-Math.floor(diffInSeconds / secondsInHour), 'hour');
  } else if (diffInSeconds < secondsInWeek) {
    return rtf.format(-Math.floor(diffInSeconds / secondsInDay), 'day');
  } else if (diffInSeconds < secondsInMonth) {
    return rtf.format(-Math.floor(diffInSeconds / secondsInWeek), 'week');
  } else if (diffInSeconds < secondsInYear) {
    return rtf.format(-Math.floor(diffInSeconds / secondsInMonth), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / secondsInYear), 'year');
  }
}

export default function PostList({ posts, selectedPostId, onSelectPost }: PostListProps) {
  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/posts/new"
          className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create New Post
        </Link>
      </div>
      {posts.length === 0 ? (
         <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
      ) : (
        <ul className="space-y-1">
          {posts.map((post) => (
            <li key={post.id}>
              <button
                onClick={() => onSelectPost(post.id)}
                className={`w-full text-left p-2 rounded cursor-pointer transition-colors ${
                  selectedPostId === post.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="block truncate">{post.title || 'Untitled Post'}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  Edited {formatRelativeTime(new Date(post.updatedAt))}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}