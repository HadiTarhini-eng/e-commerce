import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AddToCart = () => {
  const [quantity, setQuantity] = useState(1);
  const [clicked, setClicked] = useState(false);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // Handle Add to Cart functionality
  const handleAddToCart = () => {
    // Display a success toast when the item is added to the cart
    toast.success(`${quantity} item(s) added to the cart!`);
    
    // Trigger the button animation
    setClicked(true);
  };

  // Reset the clicked state when animation finishes
  const handleAnimationEnd = () => {
    setClicked(false);
  };

  return (
    <div className="flex items-center justify-center space-x-6">
      {/* Quantity Control */}
      <div className="flex items-center rounded-lg overflow-hidden">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200"
          onClick={decreaseQuantity}
        >
          -
        </button>
        <span className="px-6 py-2 text-lg font-semibold text-gray-700">{quantity}</span>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200"
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        className={`relative inline-flex items-center justify-center w-fit p-3 font-bold h-8 bg-blue-500 text-white rounded-md transition duration-300 ease-out ${clicked ? 'animate-click' : ''}`}
        onClick={handleAddToCart}
        onAnimationEnd={handleAnimationEnd} // Listen for the end of the animation
      >
        {/* Animation background span */}
        <span
          className={`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 rounded-md transform ${clicked ? 'bg-green-500' : 'bg-blue-500'}`}
        >
          {/* Checkmark icon that appears when clicked */}
          {clicked && (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>

        {/* Default content of the button */}
        <span
          className={`relative z-10 transition-all duration-300 ease ${clicked ? 'opacity-0' : 'opacity-100'}`}
        >
          Add to Cart
        </span>
      </button>
    </div>
  );
};

export default AddToCart;
