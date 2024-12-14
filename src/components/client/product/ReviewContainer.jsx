import React, { useState, useEffect } from 'react';
import SubmitReview from './SubmitReview';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const ReviewContainer = ({ reviews, productId, onSubmitReview }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews'); // Track the active tab

  // Simulate loading delay (for demonstration purposes)
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setIsLoading(false); // Stop loading when reviews are available
    }
  }, [reviews]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-palette-white rounded-lg overflow-hidden p-4 mt-4">
      {/* Tabs Navigation */}
      <div className="tabs">
        <div className="block">
          <ul className="flex border-b border-gray-200 space-x-3 transition-all duration-300 -mb-px">
            <li>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`inline-block py-4 px-6 text-gray-500 hover:text-gray-800 font-medium border-b-2 border-transparent ${activeTab === 'reviews' ? 'border-b-palette-button text-palette-button' : ''}`}
              >
                Reviews
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('submit')}
                className={`inline-block py-4 px-6 text-gray-500 hover:text-gray-800 font-medium border-b-2 border-transparent ${activeTab === 'submit' ? 'border-b-palette-button text-palette-button' : ''}`}
              >
                Submit a Review
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-3">
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="tabcontent">
            <div className="mt-2 space-y-4">
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
                  <div key={review.id} className="flex flex-col items-start bg-white shadow-md p-4 pb-1 rounded-lg border-2">
                    {/* Reviewer's Name */}
                    <div className="flex-shrink-0 flex flex-row gap-2">
                      <UserCircleIcon className="w-7 h-7"/>
                      <div className="font-semibold text-gray-800 text-md">{review.name}</div>
                    </div>

                    {/* Review Content */}
                    <div className="flex-shrink-0">
                      <div className="h-auto max-h-32 overflow-y-auto text-gray-700">
                        <p className="line-clamp-5 text-sm mt-2">{review.comment}</p>
                      </div>
                    </div>

                    {/* Review Date */}
                    <div className="w-full italic text-xs text-gray-400 flex justify-end mt-2">{review.date}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Submit a Review Tab */}
        {activeTab === 'submit' && (
          <div className="tabcontent">
            <SubmitReview productId={productId} onSubmitReview={onSubmitReview} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewContainer;
