import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { submitReview } from '../../../api/clientApi';

const SubmitReview = ({ productId, onSubmitReview }) => {
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [clicked, setClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);  // New state for submission process
  const navigate = useNavigate();

  // Access logged-in user ID and login status from AuthContext
  const { isLoggedIn, userId } = useAuth();

  const handleReviewChange = (e) => setComment(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate('/signin');
      toast.error('You must login to access this feature!');
    } else {
      if (comment.trim() === '') {
        setErrorMessage('Review cannot be empty.');
        return;
      }

      if (!userId) {
        setErrorMessage('User ID not found.');
        return;
      }

      setIsSubmitting(true);

      // Prepare the review data, including the userId
      const reviewData = {
        productId,
        comment,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        userId, // Add userId to the review payload
      };

      try {
        // Call the submitReview API
        const response = await submitReview(productId, reviewData);

        // Assuming the response contains the submitted review, you can pass it to the parent component
        if (onSubmitReview) {
          onSubmitReview(response); // This could be to update the UI with the new review
        }

        // Show success toast
        toast.success('Review Submitted!');
        
        // Reset the form and loading state
        setComment('');
        setErrorMessage('');
        setIsSubmitting(false);
        setClicked(true);
        setTimeout(() => setClicked(false), 1000); // Button animation reset

      } catch (error) {
        // Handle error
        toast.error('Failed to submit review. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-lg bg-white">
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
            type="submit"
            className={`relative inline-flex items-center justify-center w-fit p-3 font-bold h-8 bg-palette-button text-white rounded-md transition duration-300 ease-out ${clicked ? 'animate-click' : ''}`}
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
