'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeletePostButtonProps {
  postId: number;
  postTitle: string; // For confirmation message
}

// TODO: Define colors consistent with theme
const deleteButtonColor = "bg-red-600 hover:bg-red-700";
const textColor = "text-white";

export default function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    // Confirmation dialog
    if (!window.confirm(`Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the current route to reflect the deletion
        router.refresh();
        // Optionally show a success message (e.g., using a toast library)
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to delete post.');
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`text-xs px-2 py-1 rounded ${deleteButtonColor} ${textColor} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </>
  );
}