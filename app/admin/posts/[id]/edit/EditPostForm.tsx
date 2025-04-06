'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post, Tag } from '@prisma/client'; // Import generated types

// Define props including the post data
interface EditPostFormProps {
  post: Post & { tags: Pick<Tag, 'name'>[] }; // Post with associated tag names
}

// TODO: Define colors consistent with theme
const inputBgColor = "bg-gray-700";
const primaryTextColor = "text-white";
const inputBorderColor = "border-gray-600";
const buttonBgColor = "bg-teal-600";
const buttonHoverBgColor = "hover:bg-teal-700";
const errorColor = "text-red-400";

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  // Initialize state with existing post data
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [content, setContent] = useState(post.content);
  // Join tag names into a comma-separated string for the input
  const [tagString, setTagString] = useState(post.tags.map(t => t.name).join(', '));
  const [published, setPublished] = useState(post.published);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Basic slug generation helper (same as create form)
  const generateSlug = (title: string) => {
     return title.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
  };

   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Auto-generate slug based on title if slug hasn't been manually changed
    if (slug === generateSlug(post.title)) { // Compare with original slug derived from original title
      setSlug(generateSlug(newTitle));
    }
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const tagNames = tagString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    try {
      // Use PUT request to the specific post's API endpoint
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          published,
          tagNames,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect back to the admin dashboard on success
        router.push('/admin');
        router.refresh(); // Refresh server components on the dashboard
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to update post.');
      }
    } catch (error) {
      console.error('Failed to submit updated post:', error);
      setStatus('error');
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-gray-800 p-6 rounded-lg shadow-md space-y-4`}>
       {/* Title */}
       <div>
         <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
         <input
           type="text"
           id="title"
           value={title}
           onChange={handleTitleChange}
           required
           className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
         />
       </div>

       {/* Slug */}
       <div>
         <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">Slug (URL Path)</label>
         <input
           type="text"
           id="slug"
           value={slug}
           onChange={(e) => setSlug(e.target.value)}
           required
           pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
           title="Use lowercase letters, numbers, and hyphens only."
           className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm`}
         />
          <p className="text-xs text-gray-400 mt-1">Manually edit if needed (lowercase, numbers, hyphens).</p>
       </div>

       {/* Content (Textarea) */}
       <div>
         <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Content (Markdown)</label>
         <textarea
           id="content"
           rows={15}
           value={content}
           onChange={(e) => setContent(e.target.value)}
           required
           className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm`}
         />
       </div>

        {/* Tags */}
        <div>
         <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
         <input
           type="text"
           id="tags"
           value={tagString}
           onChange={(e) => setTagString(e.target.value)}
           className={`w-full px-3 py-2 ${inputBgColor} ${primaryTextColor} border ${inputBorderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
         />
       </div>

       {/* Published Status */}
       <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-300">
            Publish this post
          </label>
       </div>

       {/* Submit Button & Error Message */}
       <div>
         <button
           data-cursor-magnetic // Add attribute
           type="submit"
           disabled={status === 'loading'}
           className={`w-full py-2 px-4 ${buttonBgColor} ${primaryTextColor} font-semibold rounded-md ${buttonHoverBgColor} transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
         >
           {status === 'loading' ? 'Updating...' : 'Update Post'}
         </button>
         {status === 'error' && (
           <p className={`mt-2 text-sm text-center ${errorColor}`}>
             {errorMessage}
           </p>
         )}
       </div>
     </form>
  );
}