'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Tag } from '@prisma/client';

interface BlogSearchControlsProps {
  allTags: Pick<Tag, 'name'>[];
  currentQuery?: string;
  currentTag?: string;
}

export default function BlogSearchControls({ allTags, currentQuery = '', currentTag }: BlogSearchControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get current search params
  const [searchInputValue, setSearchInputValue] = useState(currentQuery);

  // Update input if query changes via URL (e.g., browser back/forward)
  useEffect(() => {
    setSearchInputValue(currentQuery);
  }, [currentQuery]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString()); // Preserve existing params like 'tag'
    if (searchInputValue.trim()) {
      params.set('q', searchInputValue.trim());
    } else {
      params.delete('q');
    }
    params.delete('page'); // Reset to page 1 on new search/filter
    router.push(`/blog?${params.toString()}`);
  };

  const createTagLink = (tagName?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tagName) {
      params.set('tag', tagName);
    } else {
      params.delete('tag');
    }
    params.delete('page'); // Reset page
    params.delete('q'); // Clear search query when changing tag filter
    return `/blog?${params.toString()}`;
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-200 dark:border-gray-700"
    >
      {/* Search Input and Button */}
      <div className="flex-grow w-full md:w-auto flex gap-2">
        <label htmlFor="search" className="sr-only">Search Posts</label>
        <input
          name="q"
          type="search"
          id="search"
          placeholder="Search posts..."
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-grow" // Use global style
        />
        <button type="submit" className="btn btn-primary !px-4 !py-2 whitespace-nowrap"> {/* Use global style */}
          Search
        </button>
      </div>

      {/* Tag Filtering Links */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-end">
        <Link
          data-cursor-magnetic
          href={createTagLink()} // Link without tag param
          // Apply btn-like styling for tags
          className={`text-sm px-3 py-1 rounded-full transition-colors border ${
            !currentTag
              ? 'bg-teal-500 text-white border-teal-500' // Active style
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600' // Inactive style
          }`}
        >
          All Posts
        </Link>
        {allTags.map((tag) => (
          <Link
            data-cursor-magnetic
            key={tag.name}
            href={createTagLink(tag.name)} // Link with tag param
            className={`text-sm px-3 py-1 rounded-full transition-colors border ${
              currentTag === tag.name
                ? 'bg-teal-500 text-white border-teal-500' // Active style
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600' // Inactive style
            }`}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </form>
  );
}