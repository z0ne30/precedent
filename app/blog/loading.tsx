// Basic loading component for the blog page
// Replace with a more sophisticated skeleton loader if desired

export default function BlogLoading() {
  return (
    <div className="py-10 text-center">
      <p className="text-gray-700 dark:text-gray-300">Loading posts...</p> {/* Darkened gray */}
      {/* Optional: Add skeleton loaders for PostCards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
        ))}
      </div> */}
    </div>
  );
}