'use client';

import { useState, useEffect, useCallback } from 'react';
import { Post, Tag } from '@prisma/client'; // Assuming types are available
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown for preview
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
  const [tagInput, setTagInput] = useState(''); // For the input field where user types a new tag
  const [currentTags, setCurrentTags] = useState<string[]>([]); // State for the array of tags

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // State for preview toggle

  // Fetch post data when postId changes
  useEffect(() => {
    if (postId === null) {
      setPost(null);
      setTitle('');
      setSlug('');
      setContent('');
      setPublished(false);
      setTagInput('');
      setCurrentTags([]); // Clear tags array
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
        // setTagInput(data.tags.map(tag => tag.name).join(', ')); // Don't populate input, populate array
        setCurrentTags(data.tags.map(tag => tag.name)); // Populate tags array
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
      // setTagInput(updatedPost.tags.map(tag => tag.name).join(', ')); // Don't update input, update array
      setCurrentTags(updatedPost.tags.map(tag => tag.name)); // Update tags array from response
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

  // Handle changes in the tag *input* field
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Add a tag when Enter is pressed in the input
  const handleAddTagOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if wrapped in form
      const newTag = tagInput.trim();
      if (newTag && !currentTags.includes(newTag)) {
        const updatedTags = [...currentTags, newTag];
        setCurrentTags(updatedTags);
        debouncedSave({ tagNames: updatedTags }); // Save the updated array
      }
      setTagInput(''); // Clear the input field
    }
  };

  // Remove a tag when its 'x' button is clicked
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    setCurrentTags(updatedTags);
    debouncedSave({ tagNames: updatedTags }); // Save the updated array
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
            // Apply base btn style, add specific red colors for delete action
            className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-md hover:shadow-lg active:bg-red-700 active:shadow-inner"
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
          <label htmlFor="title" className="form-label dark:text-gray-300">Title</label> {/* Use form-label */}
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white" // Use form-input, add dark mode styles if needed
            placeholder="Post Title"
          />
        </div>

        <div>
          <label htmlFor="slug" className="form-label dark:text-gray-300">Slug</label> {/* Use form-label */}
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={handleSlugChange}
            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white" // Use form-input
            placeholder="post-slug"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
             <label htmlFor="content" className="form-label dark:text-gray-300 !mb-0">Content</label> {/* Use form-label, remove margin */}
             <button
               type="button"
               onClick={() => setShowPreview(!showPreview)}
               className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-teal-500"
             >
               {showPreview ? 'Edit' : 'Preview'}
             </button>
          </div>
          {showPreview ? (
             // Apply prose styles for Markdown rendering, match dark mode if needed
             <div className="prose dark:prose-invert max-w-none p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 min-h-[300px] overflow-y-auto">
               <ReactMarkdown>{content || '*Preview appears here*'}</ReactMarkdown>
             </div>
           ) : (
             <textarea
               id="content"
               rows={15}
               value={content}
               onChange={handleContentChange}
               className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono" // Use form-input
               placeholder="Write your post content here (Markdown supported)..."
             />
           )}
        </div>

         <div>
          <div>
            <label htmlFor="tag-input" className="form-label dark:text-gray-300">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentTags.map((tag) => (
                <span key={tag} className="flex items-center bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 text-teal-500 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-100 focus:outline-none"
                    aria-label={`Remove ${tag}`}
                  >
                    &times; {/* Multiplication sign as 'x' */}
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              id="tag-input"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleAddTagOnEnter}
              className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Type a tag and press Enter..."
            />
          </div> {/* Add missing closing div for the tag section container */}
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
             {/* Use form-label styling for consistency, adjust margin/display */}
             <label htmlFor="published" className="form-label ml-2 !mb-0 dark:text-gray-100"> {/* Override mb-1 from form-label */}
               Published
             </label>
           </div>
        </div>
      </form>
    </div>
  );
}