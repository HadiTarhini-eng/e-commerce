import React, { useState, useEffect } from 'react';

const ReviewContainer = ({ reviews }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay (for demonstration purposes)
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setIsLoading(false); // Stop loading when reviews are available
    }
  }, [reviews]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 mt-8">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>

      {/* Conditional Rendering for Skeleton Loader or Reviews */}
      <div className="mt-6 space-y-4">
        {isLoading ? (
          // Skeleton Loader for Reviews
          <>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start bg-white shadow-md p-4 rounded-lg space-x-4 animate-pulse">
                {/* Reviewer's Name */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full"></div>

                {/* Review Content */}
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          // Display Actual Reviews
          reviews.map((review) => (
            <div key={review.id} className="flex items-start bg-white shadow-md p-4 rounded-lg space-x-4">
              {/* Reviewer's Name */}
              <div className="flex-shrink-0">
                <div className="font-semibold text-gray-800">{review.name}</div>
                <div className="text-sm text-gray-600">{review.date}</div>
              </div>

              {/* Review Content */}
              <div className="flex-grow">
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewContainer;
