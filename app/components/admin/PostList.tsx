import Link from 'next/link';
import { Post } from '@prisma/client';

// Define the type for the items expected in the list
type PostListItem = Pick<Post, 'id' | 'title' | 'updatedAt'>;

interface PostListProps {
  posts: PostListItem[];
  selectedPostId: number | null; // For highlighting the currently edited post
  onSelectPost: (id: number) => void; // For selecting a post to edit
  // Add props for bulk selection
  selectedPostIds: Set<number>;
  onToggleSelectPost: (id: number) => void;
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

export default function PostList({
  posts,
  selectedPostId,
  onSelectPost,
  selectedPostIds, // Destructure new props
  onToggleSelectPost, // Destructure new props
}: PostListProps) {
  const allVisibleSelected = posts.length > 0 && selectedPostIds.size === posts.length;

  const handleSelectAllChange = () => {
    if (allVisibleSelected) {
      // Deselect all visible
      posts.forEach(p => {
        if (selectedPostIds.has(p.id)) {
          onToggleSelectPost(p.id); // Toggle only those currently selected
        }
      });
    } else {
      // Select all visible that aren't already selected
      posts.forEach(p => {
        if (!selectedPostIds.has(p.id)) {
          onToggleSelectPost(p.id);
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-full"> {/* Allow list to scroll */}
      <div className="mb-4">
        <Link
          data-cursor-magnetic // Add attribute
          href="/admin/posts/new"
          className="block w-full text-center px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
        >
          Create New Post
        </Link>
      </div>
      {posts.length === 0 ? (
         <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
      ) : (
        // Use React Fragment to return multiple elements from the ternary
        <>
          {/* Add Select All Checkbox */}
          {posts.length > 0 && (
            <div className="flex items-center p-2 border-b border-gray-200 dark:border-gray-700 mb-1">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                checked={allVisibleSelected}
                onChange={handleSelectAllChange}
                aria-label="Select all posts"
              />
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Select All ({selectedPostIds.size} selected)
              </label>
            </div>
          )}
          <ul className="space-y-1 flex-grow overflow-y-auto"> {/* Allow list itself to scroll */}
            {posts.map((post) => (
              <li key={post.id} className="flex items-center"> {/* Use flex for checkbox alignment */}
                 <input
                   type="checkbox"
                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3 ml-2" // Add margin
                   checked={selectedPostIds.has(post.id)}
                   onChange={() => onToggleSelectPost(post.id)}
                   aria-labelledby={`post-title-${post.id}`} // Associate checkbox with title
                 />
                <button
                  data-cursor-magnetic // Add attribute
                  onClick={() => onSelectPost(post.id)}
                  // Adjust width to account for checkbox, remove padding handled by li/button
                  className={`flex-grow text-left p-2 rounded cursor-pointer transition-colors ${
                    selectedPostId === post.id
                      ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-100 font-semibold' // Active state
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' // Inactive state + hover
                  }`}
                >
                  <span id={`post-title-${post.id}`} className="block truncate">{post.title || 'Untitled Post'}</span> {/* Add id for aria-labelledby */}
                  <span className="block text-xs text-gray-500">
                    Edited {formatRelativeTime(new Date(post.updatedAt))} {/* Keep dark mode text color */}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}