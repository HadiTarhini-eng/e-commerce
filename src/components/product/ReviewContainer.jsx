import React from 'react';

const ReviewContainer = ({ reviews }) => {
  return (
    <div className="mt-8">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>

      {/* List of Reviews */}
      <div className="mt-6 space-y-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="flex items-start bg-white shadow-md p-4 rounded-lg space-x-4"
          >
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
        ))}
      </div>
    </div>
  );
};

export default ReviewContainer;
