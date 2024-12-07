import React, { useState, useEffect } from 'react';

const Description = ({ description }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay (for demonstration purposes)
  useEffect(() => {
    if (description) {
      setIsLoading(false); // Stop loading when the description is available
    }
  }, [description]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 mt-8">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">Description</h2>

      {/* Conditional Rendering for Skeleton Loader or Description */}
      <div className="mt-4">
        {isLoading ? (
          // Skeleton Loader
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
        ) : (
          // Actual Description Text
          <p className="text-gray-600 text-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Description;