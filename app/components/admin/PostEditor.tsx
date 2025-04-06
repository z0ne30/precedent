'use client';

import { useState, useEffect, useCallback } from 'react';
import { Post, Tag } from '@prisma/client'; // Assuming types are available
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/navigation'; // For potential refresh/redirect after delete

// Combine Post and Tags for the editor state
type PostWithTags = Post & { tags: Tag[] };

interface PostEditorProps {
  postId: number | null;
  // Add a callback to potentially refresh the post list after save/delete
  onPostUpdate?: () => void;
}

// Helper to format dates consistently
function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function PostEditor({ postId, onPostUpdate }: PostEditorProps) {
  const router = useRouter();
  const [post, setPost] = useState<PostWithTags | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [tagInput, setTagInput] = useState(''); // Simple comma-separated input for now

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch post data when postId changes
  useEffect(() => {
    if (postId === null) {
      setPost(null);
      setTitle('');
      setSlug('');
      setContent('');
      setPublished(false);
      setTagInput('');
      setError(null);
      setSaveStatus('idle');
      return;
    }

    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      setSaveStatus('idle');
      try {
        const response = await fetch(`/api/admin/posts/${postId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found.');
          }
          throw new Error(`Failed to fetch post: ${response.statusText}`);
        }
        const data: PostWithTags = await response.json();
        setPost(data);
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
        setPublished(data.published);
        setTagInput(data.tags.map(tag => tag.name).join(', ')); // Populate tag input
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unknown error occurred');
        setPost(null); // Clear post data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Debounced save function
  const debouncedSave = useDebouncedCallback(async (fieldData: Partial<PostWithTags & { tagNames: string[] }>) => {
    if (!postId) return;

    setIsSaving(true);
    setSaveStatus('saving');
    setSaveError(null);

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to save: ${response.statusText}`);
      }

      const updatedPost: PostWithTags = await response.json();
      // Update local state with the response to get fresh updatedAt, etc.
      setPost(updatedPost);
      setTitle(updatedPost.title);
      setSlug(updatedPost.slug);
      setContent(updatedPost.content);
      setPublished(updatedPost.published);
      setTagInput(updatedPost.tags.map(tag => tag.name).join(', '));
      setSaveStatus('saved');
      onPostUpdate?.(); // Notify parent to potentially refresh list
      // Clear saved status after a delay
      setTimeout(() => setSaveStatus('idle'), 2000);

    } catch (err: any) {
      console.error('Save error:', err);
      setSaveError(err.message || 'Failed to save post.');
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, 1000); // Debounce for 1 second

  // Handlers for input changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedSave({ title: e.target.value });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    debouncedSave({ slug: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    debouncedSave({ content: e.target.value });
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublished(e.target.checked);
    debouncedSave({ published: e.target.checked });
  };

   const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTagInput = e.target.value;
    setTagInput(newTagInput);
    // Split, trim, and filter empty tags before sending
    const tagNames = newTagInput.split(',').map(t => t.trim()).filter(Boolean);
    debouncedSave({ tagNames });
  };

  // Delete handler
  const handleDelete = async () => {
    if (!postId || !window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setSaveError(null); // Clear previous errors

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete: ${response.statusText}`);
      }

      // Post deleted successfully
      setPost(null); // Clear editor
      // Optionally redirect or notify parent
      onPostUpdate?.(); // Refresh list
      // router.push('/admin'); // Or redirect to main admin page

    } catch (err: any) {
      console.error('Delete error:', err);
      setSaveError(err.message || 'Failed to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };


  // Render logic
  if (postId === null) {
    return <p className="text-gray-500 dark:text-gray-400 text-center mt-10">Select a post from the list to edit.</p>;
  }

  if (isLoading) {
    return <p className="text-gray-500 dark:text-gray-400 text-center mt-10">Loading post...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">Error: {error}</p>;
  }

  if (!post) {
     // Should ideally not happen if not loading and no error, but good fallback
    return <p className="text-gray-500 dark:text-gray-400 text-center mt-10">Post data not available.</p>;
  }

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-850 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Post</h2>
        <div>
          {saveStatus === 'saving' && <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-sm text-green-600 dark:text-green-400 mr-2">Saved!</span>}
          {saveStatus === 'error' && <span className="text-sm text-red-500 mr-2">Save Error!</span>}
          <button
            data-cursor-magnetic // Add attribute
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </button>
        </div>
      </div>

      {/* Display Timestamps only when post is loaded - MOVED HERE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
         <p>Created: {formatDateTime(new Date(post.createdAt))}</p>
         <p className="md:text-right">Last Updated: {formatDateTime(new Date(post.updatedAt))}</p>
      </div>

      {saveError && <p className="text-red-500 text-sm mb-4">Error: {saveError}</p>} {/* Added margin bottom */}

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900"
            placeholder="Post Title"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={handleSlugChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900"
            placeholder="post-slug"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
          <textarea
            id="content"
            rows={15}
            value={content}
            onChange={handleContentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 font-mono"
            placeholder="Write your post content here (Markdown supported)..."
          />
           {/* TODO: Add Markdown preview option */}
        </div>

         <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={handleTagInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900"
            placeholder="e.g., react, nextjs, webdev"
          />
        </div>

        <div className="flex items-center justify-between">
           <div className="flex items-center">
             <input
               id="published"
               name="published"
               type="checkbox"
               checked={published}
               onChange={handlePublishedChange}
               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
             />
             <label htmlFor="published" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
               Published
             </label>
           </div>
        </div>
      </form>
    </div>
  );
}