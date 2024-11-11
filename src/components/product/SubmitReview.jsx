import React, { useState } from 'react';

const SubmitReview = ({ productId, onSubmitReview }) => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNameChange = (e) => setName(e.target.value);
  const handleReviewChange = (e) => setReview(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === '' || review.trim() === '') {
      setErrorMessage('Name and Review cannot be empty.');
      return;
    }

    // Call the parent onSubmitReview callback
    onSubmitReview({
      productId,
      name,
      review,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    });

    // Reset form
    setName('');
    setReview('');
    setErrorMessage('');
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Submit Your Review</h2>
      
      {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

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
            value={review}
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
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default SubmitReview;
