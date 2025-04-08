'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const searchParams = useSearchParams();

  const createPageLink = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/blog?${params.toString()}`;
  };

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  // Don't render controls if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-4 mt-8 mb-4">
      {/* Previous Button */}
      {hasPreviousPage ? (
        <Link href={createPageLink(currentPage - 1)} className="btn btn-primary !px-4 !py-2">
          &larr; Previous
        </Link>
      ) : (
        <span className="btn btn-primary !px-4 !py-2 opacity-50 cursor-not-allowed">
          &larr; Previous
        </span>
      )}

      {/* Page Indicator */}
      <span className="text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      {hasNextPage ? (
        <Link href={createPageLink(currentPage + 1)} className="btn btn-primary !px-4 !py-2">
          Next &rarr;
        </Link>
      ) : (
        <span className="btn btn-primary !px-4 !py-2 opacity-50 cursor-not-allowed">
          Next &rarr;
        </span>
      )}
    </div>
  );
}