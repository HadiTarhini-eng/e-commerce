// src/components/product/AddToCart.js
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { addToCart } from '../../../redux/cartSlice'; // Import the addToCart action
import { PlusIcon } from '@heroicons/react/24/solid';
import { MinusIcon } from '@heroicons/react/24/solid';

const AddToCart = ({ product, selectedScent, hasScents }) => {
  const dispatch = useDispatch(); // Access the dispatch function from Redux
  const [quantity, setQuantity] = useState(1);
  const [clicked, setClicked] = useState(false);

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Handle Add to Cart functionality
  const handleAddToCart = () => {
    setClicked(true);

    // Dispatch the product details to the cart
    dispatch(addToCart({
      productId: product.id,
      title: product.title,
      newPrice: product.newPrice,
      oldPrice: product.oldPrice,
      image: product.image,
      quantity,
      chipText: product.chipText,
      chipColor: product.chipColor,
      ...(hasScents && selectedScent ? {
        scentId: selectedScent.id,
        scentName: selectedScent.scentName,
        scentImage: selectedScent.image,
      } : {})
    }));

    // Display a success toast when the item is added to the cart
    toast.success(`${quantity} item(s) added to the cart!`);

    // Trigger the button animation
    setTimeout(() => setClicked(false), 1000);
  };

  return (
    <div className="flex items-center justify-start space-x-3">
      {/* Quantity Control */}
      <div className="flex items-center rounded-lg overflow-hidden">
        <button
          className="rounded-l-lg px-2 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200"
          onClick={decreaseQuantity}
        >
          <MinusIcon className="w-4 h-4 text-white"/>
        </button>
        <span className="px-4 py-2 text-lg font-semibold text-gray-700">{quantity}</span>
        <button
          className="rounded-r-lg px-2 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200"
          onClick={increaseQuantity}
        >
          <PlusIcon className="w-4 h-4 text-white"/>
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        className={`relative inline-flex items-center justify-center w-fit font-bold p-2 h-6 bg-blue-500 text-white rounded-md transition duration-300 ease-out ${clicked ? 'animate-click' : ''}`}
        onClick={handleAddToCart}
      >
        {/* Animation background span */}
        <span
          className={`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 rounded-md transform ${clicked ? 'bg-green-500' : 'bg-button'}`}
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
          className={`text-sm relative z-10 transition-all duration-300 ease ${clicked ? 'opacity-0' : 'opacity-100'}`}
        >
          Add to Cart
        </span>
      </button>
    </div>
  );
};

export default AddToCart;
