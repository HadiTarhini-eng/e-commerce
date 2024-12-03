import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SubmitReview = ({ productId, onSubmitReview }) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [clicked, setClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);  // New state for submission process

  const handleNameChange = (e) => setName(e.target.value);
  const handleReviewChange = (e) => setComment(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === '' || comment.trim() === '') {
      setErrorMessage('Name and Review cannot be empty.');
      return;
    }

    // Simulate review submission by adding delay (this should be replaced with real submission logic)
    setIsSubmitting(true);

    // Call the parent onSubmitReview callback
    onSubmitReview({
      productId,
      name,
      comment,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    });

    // Reset form after a short delay to simulate loading process
    setTimeout(() => {
      setName('');
      setComment('');
      setErrorMessage('');
      setIsSubmitting(false);
      toast.success(`Review Submitted!`);
      setClicked(true);
      setTimeout(() => setClicked(false), 1000);
    }, 2000); // 2 seconds to simulate submission delay
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-lg bg-white mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Submit Your Review</h2>
      
      {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

      {/* Conditional rendering for skeleton loader or form */}
      {isSubmitting ? (
        <div className="space-y-4">
          {/* Skeleton Loader */}
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Review Input */}
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700">
              Your Review
            </label>
            <textarea
              id="review"
              value={comment}
              onChange={handleReviewChange}
              rows="4"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Write your review here..."
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type='Submit'
            className={`relative inline-flex items-center justify-center w-fit p-3 font-bold h-8 bg-blue-500 text-white rounded-md transition duration-300 ease-out ${clicked ? 'animate-click' : ''}`}
          >
            {/* Animation background span */}
            <span
              className={`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 rounded-md transform ${clicked ? 'bg-green-500 translate-x-0' : 'display-none'}`}
            >
              {/* Checkmark icon that appears when clicked */}
              {clicked && (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            
            {/* Default content of the button */}
            <span
              className={`relative z-10 transition-all duration-300 ease ${clicked ? 'opacity-0' : 'opacity-100'}`}
            >
              Submit Review
            </span>
          </button>
        </form>
      )}
    </div>
  );
};

export default SubmitReview;
