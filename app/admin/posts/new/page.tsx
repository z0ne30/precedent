'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // To redirect after success
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [tagString, setTagString] = useState(''); // Comma-separated tags
  const [published, setPublished] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Basic slug generation helper (can be improved)
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with hyphens
      .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Auto-generate slug based on title, but allow manual override
    if (!slug || slug === generateSlug(title)) { // Only update if slug is empty or matches old title's slug
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Split comma-separated tags into an array, trim whitespace
    const tagNames = tagString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          published,
          tagNames, // Send as array
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to the admin dashboard on success
        router.push('/admin');
        // Optionally show a success message via query param or toast notification library
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to create post.');
      }
    } catch (error) {
      console.error('Failed to submit new post:', error);
      setStatus('error');
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    // Apply Page Background and Primary Text Color (Light Theme)
    <div className={`min-h-screen bg-gray-50 text-gray-900 p-8`}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
           {/* Apply Link Style (Light Theme) */}
           <Link data-cursor-magnetic href="/admin" className={`text-gray-700 hover:text-teal-600 transition-colors text-sm`}>
             &larr; Back to Admin Dashboard
           </Link>
        </div>
        {/* Apply Title Style (Light Theme) */}
        <h1 className={`text-3xl font-bold mb-6 text-gray-900`}>Create New Post</h1>

        {/* Apply Form Style (Light Theme) */}
        <form onSubmit={handleSubmit} className={`bg-white p-6 rounded-lg shadow border border-gray-200 space-y-4`}>
          {/* Title */}
          <div>
            {/* Apply Label Style (Light Theme) */}
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
              // Apply Input Field Style (Light Theme)
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900`}
            />
          </div>

          {/* Slug */}
          <div>
            {/* Apply Label Style (Light Theme) */}
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug (URL Path)</label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)} // Allow manual override
              required
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" // Basic slug pattern
              title="Use lowercase letters, numbers, and hyphens only."
              // Apply Input Field Style (Light Theme)
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 font-mono text-sm`}
            />
             {/* Apply Meta Text Style (Light Theme) */}
             <p className="text-xs text-gray-500 mt-1">Auto-generated from title, or enter manually (lowercase, numbers, hyphens).</p>
          </div>

          {/* Content (Textarea) */}
          <div>
            {/* Apply Label Style (Light Theme) */}
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
            <textarea
              id="content"
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              // Apply Input Field Style (Light Theme)
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 font-mono text-sm`}
            />
          </div>

           {/* Tags */}
           <div>
            {/* Apply Label Style (Light Theme) */}
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              value={tagString}
              onChange={(e) => setTagString(e.target.value)}
              // Apply Input Field Style (Light Theme)
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900`}
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
             {/* Apply Label Style (Light Theme) */}
             <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
               Publish this post
             </label>
          </div>

          {/* Submit Button & Error Message */}
          <div>
            <button
              data-cursor-magnetic // Add attribute
              type="submit"
              disabled={status === 'loading'}
              // Apply Primary Action Button Style (Light Theme)
              className={`w-full py-2 px-4 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {status === 'loading' ? 'Creating...' : 'Create Post'}
            </button>
            {status === 'error' && (
              // Apply Error Text Style (Light Theme)
              <p className={`mt-2 text-sm text-center text-red-800`}>
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}